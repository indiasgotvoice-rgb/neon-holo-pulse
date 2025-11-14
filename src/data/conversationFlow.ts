import { ConversationContext, getMissingInformation } from './contextUnderstanding';
import { MessageScore } from './scoringSystem';

export type ConversationStage = 
  | 'initial'           // Just started
  | 'app_type_discovery' // Finding out what app they want
  | 'feature_gathering'  // Collecting core features
  | 'design_exploration' // Understanding design preferences
  | 'technical_details'  // Technical requirements
  | 'refinement'         // Polishing and final details
  | 'complete';          // Ready to build

export interface ConversationState {
  stage: ConversationStage;
  completionPercentage: number;
  messageCount: number;
  questionsAsked: string[];
  topicsDiscussed: string[];
  needsClarification: boolean;
  currentFocus?: string;
  blockers: string[]; // What's preventing progress
}

export interface StageRequirements {
  stage: ConversationStage;
  minPercentage: number;
  maxPercentage: number;
  requiredInfo: string[];
  primaryFocus: string;
  secondaryFocus?: string[];
}

// Define requirements for each conversation stage
const stageRequirements: StageRequirements[] = [
  {
    stage: 'initial',
    minPercentage: 0,
    maxPercentage: 15,
    requiredInfo: [],
    primaryFocus: 'app_type'
  },
  {
    stage: 'app_type_discovery',
    minPercentage: 10,
    maxPercentage: 30,
    requiredInfo: ['app_type'],
    primaryFocus: 'app_type',
    secondaryFocus: ['core_features']
  },
  {
    stage: 'feature_gathering',
    minPercentage: 25,
    maxPercentage: 55,
    requiredInfo: ['app_type', 'core_features'],
    primaryFocus: 'core_features',
    secondaryFocus: ['problem_statement', 'target_audience']
  },
  {
    stage: 'design_exploration',
    minPercentage: 50,
    maxPercentage: 75,
    requiredInfo: ['app_type', 'core_features'],
    primaryFocus: 'design_preferences',
    secondaryFocus: ['user_flow']
  },
  {
    stage: 'technical_details',
    minPercentage: 70,
    maxPercentage: 90,
    requiredInfo: ['app_type', 'core_features', 'design_preferences'],
    primaryFocus: 'technical_requirements',
    secondaryFocus: ['integrations', 'platform']
  },
  {
    stage: 'refinement',
    minPercentage: 85,
    maxPercentage: 99,
    requiredInfo: ['app_type', 'core_features', 'design_preferences'],
    primaryFocus: 'additional_details',
    secondaryFocus: ['unique_value', 'monetization']
  },
  {
    stage: 'complete',
    minPercentage: 100,
    maxPercentage: 100,
    requiredInfo: ['app_type', 'core_features'],
    primaryFocus: 'ready_to_build'
  }
];

// Determine current conversation stage
export const determineConversationStage = (
  completionPercentage: number,
  context: ConversationContext
): ConversationStage => {
  // Check each stage in order
  for (const requirement of stageRequirements) {
    if (completionPercentage >= requirement.minPercentage && 
        completionPercentage <= requirement.maxPercentage) {
      
      // Verify required info is present
      const missingInfo = getMissingInformation(context);
      const hasRequiredInfo = requirement.requiredInfo.every(
        info => !missingInfo.includes(info)
      );
      
      // If missing required info for this stage, stay at previous stage
      if (!hasRequiredInfo && requirement.stage !== 'initial') {
        const currentIndex = stageRequirements.findIndex(r => r.stage === requirement.stage);
        if (currentIndex > 0) {
          return stageRequirements[currentIndex - 1].stage;
        }
      }
      
      return requirement.stage;
    }
  }
  
  return 'complete';
};

// Update conversation state after new message
export const updateConversationState = (
  currentState: ConversationState,
  messageScore: MessageScore,
  context: ConversationContext,
  lastBotQuestion?: string
): ConversationState => {
  const newPercentage = Math.min(
    currentState.completionPercentage + messageScore.progressIncrement,
    100
  );
  
  const newStage = determineConversationStage(newPercentage, context);
  
  const questionsAsked = lastBotQuestion 
    ? [...currentState.questionsAsked, lastBotQuestion]
    : currentState.questionsAsked;
  
  // Track topics discussed
  const topicsDiscussed = new Set(currentState.topicsDiscussed);
  if (context.appType) topicsDiscussed.add('app_type');
  if (context.mentionedFeatures.length > 0) topicsDiscussed.add('features');
  if (context.mentionedDesignPrefs.length > 0) topicsDiscussed.add('design');
  if (context.problemStatement) topicsDiscussed.add('problem');
  if (context.targetAudience) topicsDiscussed.add('audience');
  if (context.mentionedPlatforms.length > 0) topicsDiscussed.add('platform');
  
  // Determine blockers
  const blockers: string[] = [];
  const missingInfo = getMissingInformation(context);
  
  if (missingInfo.includes('app_type') && newPercentage > 15) {
    blockers.push('Need to specify app type');
  }
  if (missingInfo.includes('core_features') && newPercentage > 30) {
    blockers.push('Need at least 3 core features');
  }
  if (messageScore.qualityLevel === 'poor') {
    blockers.push('Messages need more detail');
  }
  
  return {
    stage: newStage,
    completionPercentage: newPercentage,
    messageCount: currentState.messageCount + 1,
    questionsAsked,
    topicsDiscussed: Array.from(topicsDiscussed),
    needsClarification: messageScore.qualityLevel === 'poor',
    currentFocus: context.currentFocus,
    blockers
  };
};

// Determine what to ask next based on state
export const determineNextQuestion = (
  state: ConversationState,
  context: ConversationContext,
  availableQuestions: Map<string, string[]>
): string | null => {
  const currentStageReq = stageRequirements.find(r => r.stage === state.stage);
  if (!currentStageReq) return null;
  
  // Get missing information
  const missingInfo = getMissingInformation(context);
  
  // Priority 1: Ask about blockers first
  if (state.blockers.length > 0) {
    if (missingInfo.includes('app_type')) {
      const questions = availableQuestions.get('app_type');
      return getUnaskedQuestion(questions || [], state.questionsAsked);
    }
    
    if (missingInfo.includes('core_features')) {
      const questions = availableQuestions.get('features');
      return getUnaskedQuestion(questions || [], state.questionsAsked);
    }
  }
  
  // Priority 2: Ask about primary focus of current stage
  const primaryQuestions = availableQuestions.get(currentStageReq.primaryFocus);
  if (primaryQuestions) {
    const question = getUnaskedQuestion(primaryQuestions, state.questionsAsked);
    if (question) return question;
  }
  
  // Priority 3: Ask about secondary focus
  if (currentStageReq.secondaryFocus) {
    for (const focus of currentStageReq.secondaryFocus) {
      const questions = availableQuestions.get(focus);
      if (questions) {
        const question = getUnaskedQuestion(questions, state.questionsAsked);
        if (question) return question;
      }
    }
  }
  
  // Priority 4: Ask about missing information
  for (const info of missingInfo) {
    const questions = availableQuestions.get(info);
    if (questions) {
      const question = getUnaskedQuestion(questions, state.questionsAsked);
      if (question) return question;
    }
  }
  
  // Default: Return generic encouragement
  const encouragement = availableQuestions.get('encouragement');
  return getUnaskedQuestion(encouragement || [], state.questionsAsked);
};

// Helper: Get question that hasn't been asked yet
const getUnaskedQuestion = (questions: string[], askedQuestions: string[]): string | null => {
  const unasked = questions.filter(q => !askedQuestions.includes(q));
  if (unasked.length === 0) return null;
  return unasked[Math.floor(Math.random() * unasked.length)];
};

// Check if conversation is ready to proceed to next stage
export const canProgressToNextStage = (
  state: ConversationState,
  context: ConversationContext
): { canProgress: boolean; reason?: string } => {
  const currentStageReq = stageRequirements.find(r => r.stage === state.stage);
  if (!currentStageReq) return { canProgress: false, reason: 'Invalid stage' };
  
  // Check if at minimum percentage for next stage
  const nextStageReq = stageRequirements[stageRequirements.findIndex(r => r.stage === state.stage) + 1];
  if (!nextStageReq) {
    return { canProgress: state.completionPercentage >= 100, reason: 'Need 100% completion' };
  }
  
  if (state.completionPercentage < nextStageReq.minPercentage) {
    return { 
      canProgress: false, 
      reason: `Need ${nextStageReq.minPercentage}% completion (currently at ${state.completionPercentage}%)` 
    };
  }
  
  // Check if required information is present
  const missingInfo = getMissingInformation(context);
  const missingRequired = currentStageReq.requiredInfo.filter(info => missingInfo.includes(info));
  
  if (missingRequired.length > 0) {
    return {
      canProgress: false,
      reason: `Missing required information: ${missingRequired.join(', ')}`
    };
  }
  
  // Check if there are blockers
  if (state.blockers.length > 0) {
    return {
      canProgress: false,
      reason: `Blockers: ${state.blockers.join(', ')}`
    };
  }
  
  return { canProgress: true };
};

// Get stage-specific guidance for user
export const getStageGuidance = (stage: ConversationStage): string => {
  const guidance: Record<ConversationStage, string> = {
    'initial': 'Start by telling me what kind of app you want to build.',
    'app_type_discovery': 'Great! Now tell me more about the main features your app should have.',
    'feature_gathering': 'Excellent! Let me know about the design and look you envision.',
    'design_exploration': 'Perfect! Now let\'s discuss the technical aspects and integrations.',
    'technical_details': 'Almost there! Any additional details or unique features you want to add?',
    'refinement': 'Final touches! Share any last details to make your app perfect.',
    'complete': 'All set! Your app description is complete. Click "Build Now" to proceed.'
  };
  
  return guidance[stage];
};

// Get progress feedback based on state
export const getProgressFeedback = (state: ConversationState): string => {
  if (state.completionPercentage < 20) {
    return 'Just getting started! Keep describing your app.';
  } else if (state.completionPercentage < 40) {
    return 'Good progress! Tell me more about the features.';
  } else if (state.completionPercentage < 60) {
    return 'Halfway there! Let\'s talk about design and user experience.';
  } else if (state.completionPercentage < 80) {
    return 'Great work! Almost there - just need a few more details.';
  } else if (state.completionPercentage < 100) {
    return 'Excellent! Just a bit more information and we\'ll be ready to build.';
  } else {
    return 'Perfect! Your app description is complete!';
  }
};

// Detect if user is going off-topic
export const isOffTopic = (
  message: string,
  context: ConversationContext,
  state: ConversationState
): boolean => {
  const lowerMsg = message.toLowerCase();
  
  // List of off-topic keywords
  const offTopicKeywords = [
    'weather', 'sports', 'movie', 'music', 'recipe', 'joke',
    'how are you', 'what\'s up', 'hello', 'hi there', 'good morning',
    'tell me about yourself', 'who made you', 'who created you'
  ];
  
  // Check if message contains off-topic keywords
  const containsOffTopic = offTopicKeywords.some(keyword => lowerMsg.includes(keyword));
  
  // Also check if message is too short and doesn't relate to app building
  const appRelatedKeywords = [
    'app', 'feature', 'design', 'user', 'screen', 'page', 'function',
    'build', 'create', 'make', 'want', 'need', 'should', 'can'
  ];
  
  const containsAppRelated = appRelatedKeywords.some(keyword => lowerMsg.includes(keyword));
  
  // If contains off-topic and doesn't contain app-related, it's off-topic
  return containsOffTopic && !containsAppRelated;
};

// Get redirection message for off-topic conversation
export const getRedirectionMessage = (state: ConversationState): string => {
  const redirections = [
    'Let\'s stay focused on your app! ' + getStageGuidance(state.stage),
    'I\'m here to help you build an app. ' + getStageGuidance(state.stage),
    'That\'s interesting, but let\'s talk about your app instead. ' + getStageGuidance(state.stage)
  ];
  
  return redirections[Math.floor(Math.random() * redirections.length)];
};

// Initialize conversation state
export const initializeConversationState = (): ConversationState => {
  return {
    stage: 'initial',
    completionPercentage: 0,
    messageCount: 0,
    questionsAsked: [],
    topicsDiscussed: [],
    needsClarification: false,
    blockers: []
  };
};

// Get conversation summary
export const getConversationSummary = (
  state: ConversationState,
  context: ConversationContext
): string => {
  const summary: string[] = [];
  
  if (context.appType) {
    summary.push(`App Type: ${context.appType.replace('_', ' ')}`);
  }
  
  if (context.mentionedFeatures.length > 0) {
    summary.push(`Features: ${context.mentionedFeatures.slice(0, 5).join(', ')}${context.mentionedFeatures.length > 5 ? '...' : ''}`);
  }
  
  if (context.targetAudience) {
    summary.push(`Target Audience: ${context.targetAudience}`);
  }
  
  if (context.mentionedDesignPrefs.length > 0) {
    summary.push(`Design: ${context.mentionedDesignPrefs.join(', ')}`);
  }
  
  if (context.mentionedPlatforms.length > 0) {
    summary.push(`Platforms: ${context.mentionedPlatforms.join(', ')}`);
  }
  
  if (summary.length === 0) {
    return 'No information collected yet.';
  }
  
  return summary.join(' | ');
};
