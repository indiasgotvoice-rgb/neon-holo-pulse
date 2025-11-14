import { MessageIntent, ConversationContext } from './contextUnderstanding';
import { detectAppTypeAdvanced, extractMentionedFeatures } from './appTypes';

export interface MessageScore {
  totalScore: number;
  breakdown: {
    wordCount: number;
    detailLevel: number;
    specificityScore: number;
    featureMentions: number;
    technicalDepth: number;
    clarityScore: number;
    contextRelevance: number;
  };
  shouldIncreaseProgress: boolean;
  progressIncrement: number;
  qualityLevel: 'poor' | 'basic' | 'good' | 'excellent';
  feedback: string;
}

// Main scoring function
export const scoreMessage = (
  message: string,
  intent: MessageIntent,
  context: ConversationContext,
  previousMessages: Array<{ content: string; sender_type: string }>
): MessageScore => {
  const breakdown = {
    wordCount: scoreWordCount(message),
    detailLevel: scoreDetailLevel(message),
    specificityScore: scoreSpecificity(message, context),
    featureMentions: scoreFeatureMentions(message, context),
    technicalDepth: scoreTechnicalDepth(message),
    clarityScore: scoreClarity(message),
    contextRelevance: scoreContextRelevance(message, context, previousMessages)
  };

  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  
  // Determine if progress should increase
  const shouldIncreaseProgress = totalScore >= 15 && !intent.needsClarification;
  
  // Calculate progress increment (0-15 points max)
  const progressIncrement = shouldIncreaseProgress ? Math.min(totalScore, 15) : 0;
  
  // Determine quality level
  let qualityLevel: 'poor' | 'basic' | 'good' | 'excellent' = 'poor';
  if (totalScore >= 40) qualityLevel = 'excellent';
  else if (totalScore >= 25) qualityLevel = 'good';
  else if (totalScore >= 10) qualityLevel = 'basic';
  
  // Generate feedback
  const feedback = generateFeedback(breakdown, qualityLevel, context);
  
  return {
    totalScore,
    breakdown,
    shouldIncreaseProgress,
    progressIncrement,
    qualityLevel,
    feedback
  };
};

// Score based on word count
const scoreWordCount = (message: string): number => {
  const wordCount = message.trim().split(/\s+/).length;
  
  if (wordCount < 3) return 0;
  if (wordCount < 5) return 1;
  if (wordCount < 10) return 3;
  if (wordCount < 20) return 5;
  if (wordCount < 40) return 7;
  if (wordCount < 60) return 9;
  return 10;
};

// Score based on level of detail
const scoreDetailLevel = (message: string): number => {
  let score = 0;
  
  // Check for specific details
  if (/\b(specifically|exactly|precisely|particularly|in detail)\b/i.test(message)) score += 3;
  
  // Check for examples
  if (/\b(like|such as|for example|e\.g\.|for instance|similar to)\b/i.test(message)) score += 3;
  
  // Check for comparisons
  if (/\b(better than|worse than|similar to|different from|compared to)\b/i.test(message)) score += 2;
  
  // Check for quantifiable details
  if (/\b(\d+\s*(users?|people|items?|products?|features?|screens?|pages?))\b/i.test(message)) score += 3;
  
  // Check for time references
  if (/\b(daily|weekly|monthly|yearly|hourly|real-time|instant)\b/i.test(message)) score += 2;
  
  return Math.min(score, 10);
};

// Score based on specificity
const scoreSpecificity = (message: string, context: ConversationContext): number => {
  let score = 0;
  const lowerMsg = message.toLowerCase();
  
  // Check if app type is mentioned with specifics
  const appTypeDetected = detectAppTypeAdvanced(message);
  if (appTypeDetected && appTypeDetected.confidence > 30) {
    score += 5;
  }
  
  // Check for specific feature names (not just "features")
  const specificFeatures = [
    'authentication', 'payment gateway', 'real-time chat', 'push notifications',
    'geolocation', 'camera integration', 'social sharing', 'offline mode',
    'cloud sync', 'multi-language', 'dark mode', 'analytics', 'admin panel'
  ];
  const featureCount = specificFeatures.filter(f => lowerMsg.includes(f)).length;
  score += Math.min(featureCount * 2, 6);
  
  // Check for specific design mentions
  const designSpecifics = [
    'gradient', 'card-based', 'minimalist', 'material design', 'glassmorphism',
    'neumorphism', 'flat design', 'skeuomorphic', 'responsive', 'animated'
  ];
  const designCount = designSpecifics.filter(d => lowerMsg.includes(d)).length;
  score += Math.min(designCount * 2, 4);
  
  // Check for specific color mentions
  if (/#[0-9a-f]{6}\b/i.test(message) || /\b(rgb|rgba|hsl)\s*\(/i.test(message)) {
    score += 3;
  } else if (/\b(blue|red|green|yellow|purple|pink|orange|black|white|gray|grey)\b/i.test(message)) {
    score += 1;
  }
  
  // Check for specific platform mentions
  if (/\b(ios|android|web|desktop|mobile)\b/i.test(lowerMsg)) {
    score += 2;
  }
  
  return Math.min(score, 15);
};

// Score based on feature mentions
const scoreFeatureMentions = (message: string, context: ConversationContext): number => {
  let score = 0;
  
  // Detect app type and check for must-have features
  const appTypeDetected = detectAppTypeAdvanced(message);
  if (appTypeDetected && context.appType) {
    const mentionedFeatures = extractMentionedFeatures(message, context.appType);
    score += Math.min(mentionedFeatures.length * 2, 10);
  }
  
  // Check for action verbs (indicates functional features)
  const actionVerbs = [
    'create', 'edit', 'delete', 'upload', 'download', 'share', 'like',
    'comment', 'post', 'save', 'export', 'import', 'filter', 'search',
    'sort', 'track', 'monitor', 'analyze', 'report', 'notify'
  ];
  const verbCount = actionVerbs.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(message)).length;
  score += Math.min(verbCount, 5);
  
  return Math.min(score, 12);
};

// Score based on technical depth
const scoreTechnicalDepth = (message: string): number => {
  let score = 0;
  const lowerMsg = message.toLowerCase();
  
  // APIs and integrations
  const integrations = [
    'api', 'rest api', 'graphql', 'websocket', 'oauth', 'sso',
    'stripe', 'paypal', 'google maps', 'firebase', 'supabase',
    'aws', 'azure', 'gcp', 'cloudinary', 'sendgrid', 'twilio'
  ];
  const integrationCount = integrations.filter(i => lowerMsg.includes(i)).length;
  score += Math.min(integrationCount * 2, 8);
  
  // Database and storage
  const storage = [
    'database', 'postgresql', 'mysql', 'mongodb', 'redis',
    'cloud storage', 's3', 'blob storage', 'cdn'
  ];
  const storageCount = storage.filter(s => lowerMsg.includes(s)).length;
  score += Math.min(storageCount * 2, 6);
  
  // Authentication methods
  const auth = [
    'login', 'signup', 'authentication', 'google login', 'facebook login',
    'email verification', 'two-factor', '2fa', 'biometric', 'jwt'
  ];
  const authCount = auth.filter(a => lowerMsg.includes(a)).length;
  score += Math.min(authCount, 4);
  
  // Advanced features
  const advanced = [
    'machine learning', 'ai', 'blockchain', 'encryption', 'caching',
    'load balancing', 'microservices', 'serverless', 'websockets'
  ];
  const advancedCount = advanced.filter(a => lowerMsg.includes(a)).length;
  score += Math.min(advancedCount * 2, 4);
  
  return Math.min(score, 15);
};

// Score based on clarity
const scoreClarity = (message: string): number => {
  let score = 10; // Start with perfect clarity
  
  // Deduct for vague words
  const vagueWords = ['thing', 'stuff', 'maybe', 'kind of', 'sort of', 'whatever', 'something', 'anything'];
  const vagueCount = vagueWords.filter(w => message.toLowerCase().includes(w)).length;
  score -= vagueCount * 2;
  
  // Deduct for no vowels (gibberish)
  if (!/[aeiou]/i.test(message)) {
    score -= 8;
  }
  
  // Deduct for repeated words
  const words = message.toLowerCase().split(/\s+/);
  if (words.length > 1 && words.every(w => w === words[0])) {
    score -= 10;
  }
  
  // Deduct for no alphabetic characters
  if (!/[a-zA-Z]/.test(message)) {
    score -= 10;
  }
  
  // Deduct for excessive punctuation
  const punctuationRatio = (message.match(/[!?.]{2,}/g) || []).length;
  score -= punctuationRatio * 2;
  
  // Bonus for proper structure
  if (/^[A-Z]/.test(message)) score += 1; // Starts with capital
  if (/[.!?]$/.test(message)) score += 1; // Ends with punctuation
  
  return Math.max(score, 0);
};

// Score based on context relevance
const scoreContextRelevance = (
  message: string,
  context: ConversationContext,
  previousMessages: Array<{ content: string; sender_type: string }>
): number => {
  let score = 0;
  const lowerMsg = message.toLowerCase();
  
  // Check if responding to the last bot question
  const lastBotMessage = [...previousMessages].reverse().find(m => m.sender_type === 'bot');
  if (lastBotMessage) {
    const lastBotLower = lastBotMessage.content.toLowerCase();
    
    // If bot asked about features and user mentions features
    if (lastBotLower.includes('feature') && /\b(feature|function|capability)\b/i.test(message)) {
      score += 5;
    }
    
    // If bot asked about design and user mentions design
    if (lastBotLower.includes('design') && /\b(design|style|color|theme)\b/i.test(message)) {
      score += 5;
    }
    
    // If bot asked about user flow and user mentions users/screens
    if (lastBotLower.includes('user') && /\b(user|screen|page|navigate)\b/i.test(message)) {
      score += 5;
    }
    
    // If bot asked about problem and user mentions problem/solution
    if (lastBotLower.includes('problem') && /\b(problem|solve|solution|issue)\b/i.test(message)) {
      score += 5;
    }
  }
  
  // Check if building on previous context
  if (context.appType && lowerMsg.includes(context.appType.replace('_', ' '))) {
    score += 3;
  }
  
  if (context.mentionedFeatures.length > 0) {
    const mentionsPreviousFeatures = context.mentionedFeatures.some(f => 
      lowerMsg.includes(f.toLowerCase())
    );
    if (mentionsPreviousFeatures) score += 2;
  }
  
  // Check if adding new information (not repeating)
  const userMessages = previousMessages.filter(m => m.sender_type === 'user');
  const isRepeat = userMessages.some(m => 
    m.content.toLowerCase() === message.toLowerCase()
  );
  if (isRepeat) {
    score -= 10;
  }
  
  return Math.max(score, 0);
};

// Generate feedback message
const generateFeedback = (
  breakdown: MessageScore['breakdown'],
  quality: 'poor' | 'basic' | 'good' | 'excellent',
  context: ConversationContext
): string => {
  const issues: string[] = [];
  const strengths: string[] = [];
  
  // Identify issues
  if (breakdown.wordCount < 3) issues.push('message is too short');
  if (breakdown.clarityScore < 5) issues.push('message is unclear or contains gibberish');
  if (breakdown.specificityScore < 3) issues.push('needs more specific details');
  if (breakdown.featureMentions < 2) issues.push('should mention specific features');
  
  // Identify strengths
  if (breakdown.specificityScore >= 10) strengths.push('very specific');
  if (breakdown.technicalDepth >= 8) strengths.push('good technical depth');
  if (breakdown.detailLevel >= 7) strengths.push('detailed description');
  if (breakdown.contextRelevance >= 5) strengths.push('relevant to conversation');
  
  // Generate feedback based on quality
  if (quality === 'poor') {
    return `Please provide more details. ${issues.join(', ')}.`;
  } else if (quality === 'basic') {
    return `Good start! Consider adding more information about ${context.appType ? 'features and design' : 'what type of app you want'}.`;
  } else if (quality === 'good') {
    return strengths.length > 0 
      ? `Great! Your description is ${strengths.join(' and ')}.`
      : 'Good information! Keep going with more details.';
  } else {
    return strengths.length > 0
      ? `Excellent! ${strengths.join(', ')} - this is very helpful!`
      : 'Perfect! Very comprehensive description.';
  }
};

// Validation: Check if message is valid at all
export const isValidMessage = (message: string): { valid: boolean; reason?: string } => {
  const trimmed = message.trim();
  
  // Too short
  if (trimmed.length < 2) {
    return { valid: false, reason: 'Message is too short' };
  }
  
  // Only numbers or symbols
  if (/^[0-9!@#$%^&*()_+=\-{}\[\]:;"'<>,.?\/\\|`~\s]+$/.test(trimmed)) {
    return { valid: false, reason: 'Please use words to describe your app' };
  }
  
  // No vowels (keyboard mashing)
  if (!/[aeiou]/i.test(trimmed) && trimmed.length > 3) {
    return { valid: false, reason: 'Message appears to be gibberish' };
  }
  
  // Single character repeated
  if (/^(.)\1+$/.test(trimmed)) {
    return { valid: false, reason: 'Please provide a meaningful description' };
  }
  
  // Word count less than 2
  if (trimmed.split(/\s+/).length < 2) {
    return { valid: false, reason: 'Please use at least 2 words to describe your idea' };
  }
  
  return { valid: true };
};

// Helper: Suggest what to add next
export const suggestNextInformation = (
  context: ConversationContext,
  currentScore: MessageScore
): string[] => {
  const suggestions: string[] = [];
  
  if (!context.appType) {
    suggestions.push('Mention what type of app you want (e.g., shopping, social, fitness)');
  }
  
  if (context.mentionedFeatures.length < 3) {
    suggestions.push('Describe at least 3 core features your app should have');
  }
  
  if (!context.problemStatement) {
    suggestions.push('Explain what problem your app solves for users');
  }
  
  if (!context.targetAudience) {
    suggestions.push('Describe who will use this app');
  }
  
  if (context.mentionedDesignPrefs.length === 0) {
    suggestions.push('Mention your design preferences (colors, style, theme)');
  }
  
  if (currentScore.breakdown.technicalDepth < 3) {
    suggestions.push('Specify technical requirements (integrations, APIs, etc.)');
  }
  
  return suggestions;
};
