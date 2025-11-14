// Advanced response generator - creates unique, context-aware responses
import { ParsedMessage } from './nlpEngine';
import { ConversationContext } from './contextUnderstanding';
import { ConversationState } from './conversationFlow';

export interface GeneratedResponse {
  message: string;
  progressIncrement: number;
  category: string;
  reasoning: string;
}

// Response templates organized by context
const responseTemplates = {
  // When user agrees (yes, sure, okay)
  agreeing: {
    to_feature: [
      "Perfect! {feature} it is. {follow_up}",
      "Great choice! {feature} will be included. {follow_up}",
      "Awesome! {feature} added to your app. {follow_up}",
      "Got it! {feature} confirmed. {follow_up}"
    ],
    to_design: [
      "Love it! {design} theme confirmed. {follow_up}",
      "Excellent! {design} design it is. {follow_up}",
      "Perfect! I'll make it {design}. {follow_up}"
    ],
    general: [
      "Understood! {follow_up}",
      "Got it! {follow_up}",
      "Perfect! {follow_up}",
      "Noted! {follow_up}"
    ]
  },

  // When user declines (no, not needed)
  declining: {
    to_feature: [
      "No problem! We'll skip {feature}. {follow_up}",
      "Understood, no {feature} needed. {follow_up}",
      "Got it, we won't include {feature}. {follow_up}"
    ],
    general: [
      "Okay, no worries! {follow_up}",
      "Understood! {follow_up}",
      "Got it! {follow_up}"
    ]
  },

  // When user is clarifying/referencing previous statement
  clarifying: {
    apologetic: [
      "You're absolutely right, my apologies! I remember you said {reference}. {follow_up}",
      "Sorry about that! Yes, you mentioned {reference}. {follow_up}",
      "My bad! I got it - {reference}. {follow_up}"
    ],
    acknowledging: [
      "Right! You mentioned {reference}. {follow_up}",
      "Yes, I remember - {reference}. {follow_up}",
      "Exactly! Based on your {reference}, {follow_up}"
    ]
  },

  // When user is vague
  vague: [
    "I need a bit more detail to build your perfect app. {specific_question}",
    "Can you be more specific? For example, {example}",
    "Help me understand better - {specific_question}",
    "Let me ask this differently: {specific_question}"
  ],

  // App type specific responses
  app_type_detected: {
    habit_tracker: [
      "Awesome! A habit tracker app. What specific habits do you want users to track? (Exercise, reading, water intake, meditation, etc.)",
      "Perfect! Habit tracking app. Should users be able to set daily goals and track streaks?",
      "Great! For your habit tracker, what's the main screen users see when they open the app?"
    ],
    ecommerce: [
      "Excellent! An e-commerce app. Will you sell physical products, digital products, or both?",
      "Perfect! Shopping app. What payment methods do you want to accept? (Credit card, PayPal, etc.)",
      "Great! For your store, do you need inventory management and order tracking?"
    ],
    social_media: [
      "Awesome! A social media app. Should users be able to create posts with photos and text?",
      "Perfect! Social platform. Do you want features like stories, direct messaging, and following?",
      "Great! For your social app, what makes it unique compared to Instagram or Facebook?"
    ],
    fitness: [
      "Excellent! A fitness app. Will it track workouts, nutrition, or both?",
      "Perfect! Fitness tracker. Do you need pre-built workout plans or should users create their own?",
      "Great! For your fitness app, should there be progress tracking with charts and statistics?"
    ],
    todo_productivity: [
      "Awesome! A productivity app. Should tasks have due dates, priorities, and categories?",
      "Perfect! To-do app. Do you want collaboration features so teams can work together?",
      "Great! For your task manager, should there be recurring tasks and reminders?"
    ],
    messaging_chat: [
      "Excellent! A messaging app. Should it support one-on-one chats, group chats, or both?",
      "Perfect! Chat app. Do you need voice calls, video calls, or just text messaging?",
      "Great! For your messenger, should messages support photos, videos, and file attachments?"
    ],
    education: [
      "Awesome! An education app. What subjects or topics will it cover?",
      "Perfect! Learning platform. Will there be video lessons, quizzes, or both?",
      "Great! For your education app, should there be progress tracking and certificates?"
    ],
    game: [
      "Excellent! A mobile game. What type of game? (Puzzle, action, racing, strategy, etc.)",
      "Perfect! Game app. Will it be single-player, multiplayer, or both?",
      "Great! For your game, should there be levels, achievements, and leaderboards?"
    ],
    finance: [
      "Awesome! A finance app. Will it track expenses, budgets, or investments?",
      "Perfect! Money management app. Should there be charts showing spending patterns?",
      "Great! For your finance app, do you need bank account integration?"
    ],
    food_recipe: [
      "Excellent! A food app. Is it for recipes, restaurant delivery, or meal planning?",
      "Perfect! Recipe app. Should users be able to upload their own recipes?",
      "Great! For your food app, do you need nutritional information and dietary filters?"
    ]
  },

  // Feature-specific follow-ups
  feature_detected: {
    authentication: [
      "Should users log in with email/password, Google, Facebook, or all of these?",
      "Do you need 'Forgot Password' and email verification features?",
      "Should there be different user roles like admin, regular user, or moderator?"
    ],
    dark_mode: [
      "Should dark mode be the default, or can users toggle between dark and light?",
      "What accent colors should we use in dark mode? (Blue, purple, green, etc.)",
      "Should it be pure black or more of a dark gray theme?"
    ],
    payment: [
      "What payment methods? (Credit card, PayPal, Apple Pay, Google Pay, etc.)",
      "Will it be one-time payments, subscriptions, or both?",
      "Do you need invoice generation and payment history tracking?"
    ],
    notifications: [
      "What should trigger notifications? (New messages, updates, reminders, etc.)",
      "Should notifications be push notifications, email, or both?",
      "Can users customize which notifications they receive?"
    ],
    chat: [
      "Should messaging be one-on-one, group chat, or both?",
      "Do you need read receipts and typing indicators?",
      "Should messages support photos, videos, or file attachments?"
    ],
    search: [
      "What should users be able to search for?",
      "Should there be filters to narrow down search results?",
      "Do you want autocomplete or search suggestions?"
    ]
  },

  // Design-specific follow-ups
  design_detected: {
    color_mentioned: [
      "Great! {color} will be the primary color. What about accent colors?",
      "Nice! {color} theme. Should it be bright {color} or more muted?",
      "Perfect! {color} it is. What other colors should complement it?"
    ],
    style_mentioned: [
      "Love the {style} style! Should buttons be rounded or sharp-edged?",
      "Perfect! {style} design. Do you want lots of animations or keep it simple?",
      "Great! {style} theme. What font style? (Modern, classic, playful, etc.)"
    ]
  },

  // Progress-based questions (based on completion %)
  stage_based: {
    early: [ // 0-30%
      "What's the main problem your app solves for users?",
      "Who is your target audience? (Age, profession, interests, etc.)",
      "What's the first screen users see when they open your app?",
      "Name 3 features your app MUST have to work."
    ],
    middle: [ // 30-60%
      "How do users navigate through different sections of your app?",
      "What design style do you prefer? (Modern, minimal, colorful, professional, etc.)",
      "Should the app work offline or need constant internet connection?",
      "Do you need any third-party integrations? (Payment, maps, social media, etc.)"
    ],
    late: [ // 60-90%
      "Any unique features that make your app stand out?",
      "What colors or theme would you like for your app?",
      "Are there different user roles or permissions needed?",
      "What platforms? (iOS, Android, Web, or all?)"
    ],
    final: [ // 90-99%
      "Is there anything else important I should know about your app?",
      "Any last details or special requirements?",
      "What's the one thing that will make users love your app?"
    ]
  }
};

// Feature elaboration questions (when feature is detected but needs more info)
const featureElaborationMap: Record<string, string[]> = {
  authentication: [
    "Should users log in with email/password, social media (Google, Facebook), or both?",
    "Do you need 'Forgot Password' or email verification?",
    "Should there be different user roles like admin and regular user?"
  ],
  user_profile: [
    "What information should be on user profiles? (Bio, photo, location, etc.)",
    "Can users customize or edit their profiles?",
    "Should profiles be public, private, or have privacy settings?"
  ],
  notifications: [
    "What events should trigger notifications?",
    "Should notifications be push notifications, email, or both?",
    "Can users customize which notifications they receive?"
  ],
  payment: [
    "What payment methods do you want to accept?",
    "Will it be one-time payments, subscriptions, or both?",
    "Do you need invoice generation or payment history?"
  ],
  chat: [
    "Should messaging be one-on-one, group chat, or both?",
    "Do you need features like read receipts and typing indicators?",
    "Should messages support photos, videos, or file attachments?"
  ],
  search: [
    "What should users be able to search for?",
    "Should there be filters to narrow down search results?",
    "Do you want autocomplete or search suggestions?"
  ],
  media_upload: [
    "What file types should users be able to upload? (Photos, videos, PDFs, etc.)",
    "Should there be image editing features like cropping or filters?",
    "Do you need file size limits or compression?"
  ],
  location: [
    "How should location be used? (Show nearby places, directions, user location, etc.)",
    "Should the app work with GPS or manual location entry?",
    "Do you need map integration like Google Maps?"
  ],
  analytics: [
    "What kind of analytics do you need? (User behavior, sales, engagement, etc.)",
    "Should there be charts and graphs for visualizing data?",
    "Do you need real-time analytics or daily/weekly reports?"
  ],
  calendar: [
    "Should users be able to create, edit, and delete events?",
    "Do you need reminders or notifications for scheduled events?",
    "Should there be calendar views like day, week, or month?"
  ]
};

// Generate dynamic response based on parsed message
export const generateResponse = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState,
  lastBotQuestion: string
): GeneratedResponse => {
  
  console.log('🎨 Generating response for:', {
    intent: parsed.intent,
    isAgreement: parsed.isAgreement,
    isDisagreement: parsed.isDisagreement,
    isReference: parsed.isReference,
    sentiment: parsed.sentiment
  });

  // Handle agreement
  if (parsed.isAgreement) {
    return handleAgreement(parsed, context, state, lastBotQuestion);
  }

  // Handle disagreement
  if (parsed.isDisagreement) {
    return handleDisagreement(parsed, context, state, lastBotQuestion);
  }

  // Handle reference to previous statement
  if (parsed.isReference || parsed.sentiment === 'frustrated') {
    return handleReference(parsed, context, state);
  }

  // Handle vague response
  if (parsed.isVague) {
    return handleVague(parsed, context, state);
  }

  // Handle app type detection
  if (parsed.entities.appTypes.length > 0 && !context.appType) {
    return handleAppTypeDetection(parsed, context, state);
  }

  // Handle feature detection
  if (parsed.entities.features.length > 0) {
    return handleFeatureDetection(parsed, context, state);
  }

  // Handle design elements
  if (parsed.entities.colors.length > 0 || parsed.entities.designStyles.length > 0) {
    return handleDesignDetection(parsed, context, state);
  }

  // Default: stage-based question
  return handleStageBased(parsed, context, state);
};

// Handle user agreeing (yes, sure, okay)
const handleAgreement = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState,
  lastBotQuestion: string
): GeneratedResponse => {
  
  // Determine what they're agreeing to
  const lowerQuestion = lastBotQuestion.toLowerCase();
  
  // Agreeing to a feature
  if (/\b(feature|need|want|should)\b/i.test(lowerQuestion)) {
    const featureMentioned = Object.keys(featureElaborationMap).find(f => 
      lowerQuestion.includes(f.replace('_', ' '))
    );
    
    if (featureMentioned) {
      const templates = responseTemplates.agreeing.to_feature;
      const template = templates[Math.floor(Math.random() * templates.length)];
      const followUp = getNextQuestion(context, state);
      
      return {
        message: template
          .replace('{feature}', featureMentioned.replace('_', ' '))
          .replace('{follow_up}', followUp),
        progressIncrement: 8,
        category: 'agreement',
        reasoning: 'User agreed to feature'
      };
    }
  }
  
  // Agreeing to design
  if (/\b(design|color|theme|style)\b/i.test(lowerQuestion)) {
    const templates = responseTemplates.agreeing.to_design;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const followUp = getNextQuestion(context, state);
    
    const design = context.mentionedDesignPrefs[context.mentionedDesignPrefs.length - 1] || 'that';
    
    return {
      message: template
        .replace('{design}', design)
        .replace('{follow_up}', followUp),
      progressIncrement: 6,
      category: 'agreement',
      reasoning: 'User agreed to design choice'
    };
  }
  
  // General agreement
  const templates = responseTemplates.agreeing.general;
  const template = templates[Math.floor(Math.random() * templates.length)];
  const followUp = getNextQuestion(context, state);
  
  return {
    message: template.replace('{follow_up}', followUp),
    progressIncrement: 5,
    category: 'agreement',
    reasoning: 'User agreed generally'
  };
};

// Handle user declining (no, not needed)
const handleDisagreement = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState,
  lastBotQuestion: string
): GeneratedResponse => {
  
  const lowerQuestion = lastBotQuestion.toLowerCase();
  
  // Declining a feature
  if (/\b(feature|need|want|should)\b/i.test(lowerQuestion)) {
    const featureMentioned = Object.keys(featureElaborationMap).find(f => 
      lowerQuestion.includes(f.replace('_', ' '))
    );
    
    if (featureMentioned) {
      const templates = responseTemplates.declining.to_feature;
      const template = templates[Math.floor(Math.random() * templates.length)];
      const followUp = getNextQuestion(context, state);
      
      return {
        message: template
          .replace('{feature}', featureMentioned.replace('_', ' '))
          .replace('{follow_up}', followUp),
        progressIncrement: 3,
        category: 'disagreement',
        reasoning: 'User declined feature'
      };
    }
  }
  
  // General disagreement
  const templates = responseTemplates.declining.general;
  const template = templates[Math.floor(Math.random() * templates.length)];
  const followUp = getNextQuestion(context, state);
  
  return {
    message: template.replace('{follow_up}', followUp),
    progressIncrement: 2,
    category: 'disagreement',
    reasoning: 'User declined generally'
  };
};

// Handle reference to previous statement
const handleReference = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState
): GeneratedResponse => {
  
  // Find what they're referencing
  let reference = '';
  if (context.appType) {
    reference = `${context.appType.replace('_', ' ')} app`;
  } else if (context.mentionedFeatures.length > 0) {
    reference = context.mentionedFeatures[0].replace('_', ' ');
  } else {
    reference = 'what you mentioned';
  }
  
  const templates = parsed.sentiment === 'frustrated' 
    ? responseTemplates.clarifying.apologetic
    : responseTemplates.clarifying.acknowledging;
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  const followUp = getNextQuestion(context, state);
  
  return {
    message: template
      .replace('{reference}', reference)
      .replace('{follow_up}', followUp),
    progressIncrement: 3,
    category: 'clarifying',
    reasoning: 'User referenced previous statement'
  };
};

// Handle vague response
const handleVague = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState
): GeneratedResponse => {
  
  const templates = responseTemplates.vague;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Generate specific question or example
  let specificQuestion = '';
  let example = '';
  
  if (!context.appType) {
    specificQuestion = "What type of app do you want to build?";
    example = "a shopping app, social media app, fitness tracker, etc.";
  } else if (context.mentionedFeatures.length < 3) {
    specificQuestion = "What are the main features your app needs?";
    example = "user login, photo upload, search, notifications, etc.";
  } else {
    specificQuestion = "What design style do you prefer?";
    example = "modern and minimal, colorful and playful, professional, etc.";
  }
  
  return {
    message: template
      .replace('{specific_question}', specificQuestion)
      .replace('{example}', example),
    progressIncrement: 0,
    category: 'clarification_needed',
    reasoning: 'User response was vague'
  };
};

// Handle app type detection
const handleAppTypeDetection = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState
): GeneratedResponse => {
  
  const appType = parsed.entities.appTypes[0];
  const templates = responseTemplates.app_type_detected[appType as keyof typeof responseTemplates.app_type_detected];
  
  if (templates) {
    const message = templates[Math.floor(Math.random() * templates.length)];
    return {
      message,
      progressIncrement: 15,
      category: 'app_type',
      reasoning: `Detected ${appType} app type`
    };
  }
  
  // Fallback for unlisted app types
  const followUp = getNextQuestion(context, state);
  return {
    message: `Perfect! A ${appType.replace('_', ' ')} app. ${followUp}`,
    progressIncrement: 12,
    category: 'app_type',
    reasoning: `Detected ${appType} app type (generic)`
  };
};

// Handle feature detection
const handleFeatureDetection = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState
): GeneratedResponse => {
  
  const newFeatures = parsed.entities.features.filter(
    f => !context.mentionedFeatures.includes(f)
  );
  
  if (newFeatures.length === 0) {
    return handleStageBased(parsed, context, state);
  }
  
  const feature = newFeatures[0];
  const elaborationQuestions = featureElaborationMap[feature];
  
  if (elaborationQuestions) {
    const question = elaborationQuestions[Math.floor(Math.random() * elaborationQuestions.length)];
    return {
      message: `Great! You want ${feature.replace('_', ' ')}. ${question}`,
      progressIncrement: 10,
      category: 'feature_detail',
      reasoning: `User mentioned ${feature}, asking for details`
    };
  }
  
  const followUp = getNextQuestion(context, state);
  return {
    message: `Perfect! ${feature.replace('_', ' ')} noted. ${followUp}`,
    progressIncrement: 8,
    category: 'feature',
    reasoning: `User mentioned ${feature}`
  };
};

// Handle design detection
const handleDesignDetection = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState
): GeneratedResponse => {
  
  if (parsed.entities.colors.length > 0) {
    const color = parsed.entities.colors[0];
    const templates = responseTemplates.design_detected.color_mentioned;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      message: template.replace('{color}', color),
      progressIncrement: 7,
      category: 'design',
      reasoning: `User mentioned ${color} color`
    };
  }
  
  if (parsed.entities.designStyles.length > 0) {
    const style = parsed.entities.designStyles[0];
    const templates = responseTemplates.design_detected.style_mentioned;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      message: template.replace('{style}', style),
      progressIncrement: 7,
      category: 'design',
      reasoning: `User mentioned ${style} style`
    };
  }
  
  return handleStageBased(parsed, context, state);
};

// Handle stage-based questions
const handleStageBased = (
  parsed: ParsedMessage,
  context: ConversationContext,
  state: ConversationState
): GeneratedResponse => {
  
  const completion = state.completionPercentage;
  let questions: string[];
  let stage: string;
  
  if (completion < 30) {
    questions = responseTemplates.stage_based.early;
    stage = 'early';
  } else if (completion < 60) {
    questions = responseTemplates.stage_based.middle;
    stage = 'middle';
  } else if (completion < 90) {
    questions = responseTemplates.stage_based.late;
    stage = 'late';
  } else {
    questions = responseTemplates.stage_based.final;
    stage = 'final';
  }
  
  // Filter out questions already asked
  const unasked = questions.filter(q => !state.questionsAsked.includes(q));
  const question = unasked.length > 0 
    ? unasked[Math.floor(Math.random() * unasked.length)]
    : questions[Math.floor(Math.random() * questions.length)];
  
  const increment = parsed.confidence > 50 ? 8 : 5;
  
  return {
    message: question,
    progressIncrement: increment,
    category: stage,
    reasoning: `Stage-based question for ${stage} stage`
  };
};

// Get next logical question based on context
const getNextQuestion = (context: ConversationContext, state: ConversationState): string => {
  
  // Need app type
  if (!context.appType) {
    return "What type of app is this?";
  }
  
  // Need more features
  if (context.mentionedFeatures.length < 3) {
    return "What are the main features your app needs?";
  }
  
  // Need design
  if (context.mentionedDesignPrefs.length === 0) {
    return "What design style do you prefer?";
  }
  
  // Need target audience
  if (!context.targetAudience) {
    return "Who is your target audience?";
  }
  
  // Need problem statement
  if (!context.problemStatement) {
    return "What problem does your app solve?";
  }
  
  // Generic follow-up
  const followUps = [
    "What else should I know about your app?",
    "Any other important features?",
    "What makes your app unique?"
  ];
  
  return followUps[Math.floor(Math.random() * followUps.length)];
};
