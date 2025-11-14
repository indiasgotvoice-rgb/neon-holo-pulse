import { ConversationContext } from './contextUnderstanding';
import { ConversationState } from './conversationFlow';
import { appTypeDatabase, getAppTypeFollowUps, detectAppTypeAdvanced } from './appTypes';

export interface GeneratedQuestion {
  question: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

// Generate context-aware follow-up question
export const generateSmartQuestion = (
  userMessage: string,
  context: ConversationContext,
  state: ConversationState,
  previousQuestions: string[]
): GeneratedQuestion => {
  
  // 1. If app type detected but not in context, ask about it specifically
  const detectedAppType = detectAppTypeAdvanced(userMessage);
  if (detectedAppType && !context.appType) {
    const followUps = getAppTypeFollowUps(detectedAppType.type);
    const unasked = followUps.filter(q => !previousQuestions.includes(q));
    
    if (unasked.length > 0) {
      return {
        question: unasked[0],
        category: 'app_type_specific',
        priority: 'high',
        reasoning: `Detected ${detectedAppType.type} app, asking specific follow-up`
      };
    }
  }
  
  // 2. If user mentioned features but didn't elaborate
  const mentionedFeatures = extractFeatureMentions(userMessage);
  if (mentionedFeatures.length > 0 && !context.mentionedFeatures.includes(mentionedFeatures[0])) {
    return generateFeatureElaborationQuestion(mentionedFeatures[0]);
  }
  
  // 3. If user mentioned a competitor app
  const mentionedCompetitor = extractCompetitorMention(userMessage);
  if (mentionedCompetitor) {
    return generateCompetitorComparisonQuestion(mentionedCompetitor);
  }
  
  // 4. If user mentioned design elements
  const designElements = extractDesignMentions(userMessage);
  if (designElements.length > 0) {
    return generateDesignDeepDiveQuestion(designElements);
  }
  
  // 5. If user mentioned technical terms
  const technicalTerms = extractTechnicalMentions(userMessage);
  if (technicalTerms.length > 0) {
    return generateTechnicalClarificationQuestion(technicalTerms);
  }
  
  // 6. If user gave vague answer, ask for specifics
  if (userMessage.trim().split(/\s+/).length < 5) {
    return generateSpecificityQuestion(context, state);
  }
  
  // 7. Based on conversation stage
  return generateStageBasedQuestion(context, state, previousQuestions);
};

// Extract feature mentions from message
const extractFeatureMentions = (message: string): string[] => {
  const features: string[] = [];
  
  const featurePatterns = [
    { pattern: /\b(login|signup|authentication|auth)\b/i, feature: 'authentication' },
    { pattern: /\b(payment|checkout|stripe|paypal|purchase)\b/i, feature: 'payment' },
    { pattern: /\b(chat|messaging|dm|conversation)\b/i, feature: 'messaging' },
    { pattern: /\b(notification|push|alert)\b/i, feature: 'notifications' },
    { pattern: /\b(upload|photo|image|video|file)\b/i, feature: 'media_upload' },
    { pattern: /\b(search|find|filter|sort)\b/i, feature: 'search' },
    { pattern: /\b(profile|account|dashboard)\b/i, feature: 'user_profile' },
    { pattern: /\b(like|comment|share|follow)\b/i, feature: 'social_interactions' },
    { pattern: /\b(map|location|gps|geolocation)\b/i, feature: 'location' },
    { pattern: /\b(calendar|schedule|reminder|booking)\b/i, feature: 'calendar' }
  ];
  
  for (const { pattern, feature } of featurePatterns) {
    if (pattern.test(message)) {
      features.push(feature);
    }
  }
  
  return features;
};

// Extract competitor mentions
const extractCompetitorMention = (message: string): string | null => {
  const lowerMsg = message.toLowerCase();
  
  const competitors = [
    'instagram', 'facebook', 'twitter', 'tiktok', 'snapchat', 'linkedin',
    'amazon', 'ebay', 'shopify', 'etsy', 'walmart', 'target',
    'uber', 'lyft', 'doordash', 'grubhub', 'airbnb',
    'netflix', 'spotify', 'youtube', 'hulu',
    'whatsapp', 'telegram', 'discord', 'slack', 'zoom',
    'duolingo', 'coursera', 'udemy', 'skillshare',
    'tinder', 'bumble', 'hinge',
    'notion', 'trello', 'asana', 'monday'
  ];
  
  for (const competitor of competitors) {
    if (lowerMsg.includes(competitor)) {
      return competitor;
    }
  }
  
  return null;
};

// Extract design mentions
const extractDesignMentions = (message: string): string[] => {
  const lowerMsg = message.toLowerCase();
  const designs: string[] = [];
  
  const designKeywords = [
    'modern', 'minimal', 'minimalist', 'colorful', 'vibrant', 'dark mode', 'light mode',
    'professional', 'playful', 'elegant', 'simple', 'clean', 'bold', 'gradient',
    'flat', 'material', 'glassmorphism', 'neumorphism', 'responsive', 'animated'
  ];
  
  for (const keyword of designKeywords) {
    if (lowerMsg.includes(keyword)) {
      designs.push(keyword);
    }
  }
  
  // Extract colors
  const colorRegex = /\b(red|blue|green|yellow|purple|pink|orange|black|white|gray|grey|cyan|magenta|brown|gold|silver)\b/gi;
  const colorMatches = message.match(colorRegex);
  if (colorMatches) {
    designs.push(...colorMatches.map(c => c.toLowerCase()));
  }
  
  return designs;
};

// Extract technical mentions
const extractTechnicalMentions = (message: string): string[] => {
  const lowerMsg = message.toLowerCase();
  const technical: string[] = [];
  
  const techKeywords = [
    'api', 'database', 'cloud', 'real-time', 'offline', 'sync', 'encryption',
    'oauth', 'jwt', 'websocket', 'rest', 'graphql', 'firebase', 'supabase',
    'stripe', 'paypal', 'google maps', 'aws', 'analytics', 'seo'
  ];
  
  for (const keyword of techKeywords) {
    if (lowerMsg.includes(keyword)) {
      technical.push(keyword);
    }
  }
  
  return technical;
};

// Generate feature elaboration question
const generateFeatureElaborationQuestion = (feature: string): GeneratedQuestion => {
  const elaborationQuestions: Record<string, string[]> = {
    authentication: [
      'Should users log in with email/password, social media (Google, Facebook), or both?',
      'Do you need features like "Forgot Password" or email verification?',
      'Should there be different user roles like admin, regular user, or moderator?'
    ],
    payment: [
      'What payment methods do you want to accept? (Credit card, PayPal, Apple Pay, etc.)',
      'Will it be one-time payments, subscriptions, or both?',
      'Do you need invoice generation or payment history tracking?'
    ],
    messaging: [
      'Should messaging be one-on-one, group chat, or both?',
      'Do you need features like read receipts, typing indicators, or voice messages?',
      'Should messages support photos, videos, or file attachments?'
    ],
    notifications: [
      'What events should trigger notifications? (New messages, updates, reminders, etc.)',
      'Should notifications be push notifications, email, or both?',
      'Can users customize which notifications they receive?'
    ],
    media_upload: [
      'What file types should users be able to upload? (Photos, videos, PDFs, etc.)',
      'Should there be image editing features like cropping or filters?',
      'Do you need file size limits or compression?'
    ],
    search: [
      'What should users be able to search for? (Products, users, posts, etc.)',
      'Should there be filters to narrow down search results?',
      'Do you want autocomplete or search suggestions?'
    ],
    user_profile: [
      'What information should be on user profiles? (Bio, photo, location, etc.)',
      'Can users customize or edit their profiles?',
      'Should profiles be public, private, or have privacy settings?'
    ],
    social_interactions: [
      'What social features do you want? (Like, comment, share, follow, etc.)',
      'Should there be a feed or timeline showing social activity?',
      'Do you need features to report or block users?'
    ],
    location: [
      'How should location be used? (Show nearby places, directions, user location, etc.)',
      'Should the app work with GPS or manual location entry?',
      'Do you need map integration like Google Maps or Apple Maps?'
    ],
    calendar: [
      'Should users be able to create, edit, and delete events?',
      'Do you need reminders or notifications for scheduled events?',
      'Should there be calendar views like day, week, or month?'
    ]
  };
  
  const questions = elaborationQuestions[feature] || [
    `Can you tell me more about how the ${feature.replace('_', ' ')} feature should work?`,
    `What specific functionality do you need for ${feature.replace('_', ' ')}?`
  ];
  
  return {
    question: questions[Math.floor(Math.random() * questions.length)],
    category: 'feature_elaboration',
    priority: 'high',
    reasoning: `User mentioned ${feature}, need more details`
  };
};

// Generate competitor comparison question
const generateCompetitorComparisonQuestion = (competitor: string): GeneratedQuestion => {
  const questions = [
    `You mentioned ${competitor}. What specific features from ${competitor} do you want in your app?`,
    `Should your app work like ${competitor}, or do you want something different?`,
    `What do you like or dislike about ${competitor} that you want to change in your app?`,
    `Is your app inspired by ${competitor}, or is it solving a different problem?`
  ];
  
  return {
    question: questions[Math.floor(Math.random() * questions.length)],
    category: 'competitor_comparison',
    priority: 'high',
    reasoning: `User mentioned competitor app: ${competitor}`
  };
};

// Generate design deep-dive question
const generateDesignDeepDiveQuestion = (designElements: string[]): GeneratedQuestion => {
  const element = designElements[0];
  
  const designQuestions: Record<string, string[]> = {
    modern: [
      'What makes a "modern" design for you? Clean lines, bold typography, or something else?',
      'Should the modern design include animations and smooth transitions?'
    ],
    minimal: [
      'For a minimal design, do you want lots of white space and simple layouts?',
      'Should the minimal style apply to colors too, like using black and white?'
    ],
    dark: [
      'Should dark mode be the default, or should users be able to toggle between dark and light?',
      'What colors should accent the dark theme? (Blue, purple, green, etc.)'
    ],
    colorful: [
      'What color palette are you thinking? Bright and vibrant or soft pastels?',
      'Should different sections of the app use different colors?'
    ]
  };
  
  const matchingQuestions = designQuestions[element] || [
    `You mentioned "${element}" design. Can you describe what that means to you?`,
    `What specific visual elements should reflect the "${element}" style?`
  ];
  
  return {
    question: matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)],
    category: 'design_detail',
    priority: 'medium',
    reasoning: `User mentioned design element: ${element}`
  };
};

// Generate technical clarification question
const generateTechnicalClarificationQuestion = (technicalTerms: string[]): GeneratedQuestion => {
  const term = technicalTerms[0];
  
  const techQuestions: Record<string, string[]> = {
    api: [
      'Which APIs do you want to integrate? (Google, Facebook, payment APIs, etc.)',
      'Are you building your own API or connecting to existing ones?'
    ],
    database: [
      'What kind of data needs to be stored? (User info, posts, products, etc.)',
      'Should the database be cloud-based or local to the device?'
    ],
    'real-time': [
      'What features need to be real-time? (Chat, notifications, live updates, etc.)',
      'How important is instant synchronization across devices?'
    ],
    offline: [
      'What should work offline? (Read-only content, cached data, full functionality?)',
      'Should offline changes sync automatically when back online?'
    ]
  };
  
  const matchingQuestions = techQuestions[term] || [
    `You mentioned ${term}. Can you explain how you want to use it in your app?`,
    `What functionality does ${term} enable for your users?`
  ];
  
  return {
    question: matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)],
    category: 'technical_clarification',
    priority: 'medium',
    reasoning: `User mentioned technical term: ${term}`
  };
};

// Generate specificity question when answer is too vague
const generateSpecificityQuestion = (
  context: ConversationContext,
  state: ConversationState
): GeneratedQuestion => {
  const questions = [
    'Can you provide more specific details about what you just mentioned?',
    'That sounds interesting! Can you elaborate on that with more information?',
    'Tell me more - what exactly do you mean by that?',
    'I need a bit more detail. Can you describe that further?',
    'Can you give me an example or be more specific about what you want?'
  ];
  
  return {
    question: questions[Math.floor(Math.random() * questions.length)],
    category: 'clarification',
    priority: 'high',
    reasoning: 'User response was too vague'
  };
};

// Generate stage-based question
const generateStageBasedQuestion = (
  context: ConversationContext,
  state: ConversationState,
  previousQuestions: string[]
): GeneratedQuestion => {
  
  // Stage: Initial / App Type Discovery
  if (state.stage === 'initial' || state.stage === 'app_type_discovery') {
    if (!context.appType) {
      const questions = [
        'What type of app do you want to build? (Shopping, social media, fitness, education, etc.)',
        'Describe the main purpose of your app in one sentence.',
        'Who is this app for and what problem does it solve?',
        'Is there an existing app that inspired yours? Tell me about it.'
      ];
      return {
        question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
        category: 'app_type',
        priority: 'high',
        reasoning: 'Need to identify app type'
      };
    }
  }
  
  // Stage: Feature Gathering
  if (state.stage === 'feature_gathering') {
    if (context.mentionedFeatures.length < 3) {
      const questions = [
        'What are the top 3 features your app MUST have?',
        'When a user opens your app, what can they do?',
        'What actions should users be able to perform?',
        'List the core functionalities your app needs to work.'
      ];
      return {
        question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
        category: 'features',
        priority: 'high',
        reasoning: 'Need more core features'
      };
    } else if (!context.problemStatement) {
      const questions = [
        'What problem does your app solve for users?',
        'Why would someone download and use your app?',
        'What makes your app valuable or useful?'
      ];
      return {
        question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
        category: 'problem',
        priority: 'medium',
        reasoning: 'Need problem statement'
      };
    } else if (!context.targetAudience) {
      const questions = [
        'Who is your target audience? (Age, profession, interests, etc.)',
        'Describe your typical user - who will use this app the most?',
        'Is this app for businesses, consumers, students, or a specific group?'
      ];
      return {
        question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
        category: 'audience',
        priority: 'medium',
        reasoning: 'Need target audience'
      };
    }
  }
  
  // Stage: Design Exploration
  if (state.stage === 'design_exploration') {
    if (context.mentionedDesignPrefs.length === 0) {
      const questions = [
        'What design style do you prefer? (Modern, minimal, colorful, professional, playful)',
        'Do you have a color scheme in mind for your app?',
        'Should the app have dark mode, light mode, or both?',
        'Describe the overall look and feel you want for your app.'
      ];
      return {
        question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
        category: 'design',
        priority: 'high',
        reasoning: 'Need design preferences'
      };
    } else {
      const questions = [
        'Describe the user journey - what happens when someone first opens your app?',
        'What should be on the main screen or home page?',
        'How do users navigate through different sections of your app?',
        'Walk me through a typical user session from start to finish.'
      ];
      return {
        question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
        category: 'user_flow',
        priority: 'medium',
        reasoning: 'Need user flow details'
      };
    }
  }
  
  // Stage: Technical Details
  if (state.stage === 'technical_details') {
    const questions = [
      'Do you need any third-party integrations? (Payment, maps, social media, etc.)',
      'Should the app work offline or need constant internet connection?',
      'Do you need an admin panel or dashboard to manage the app?',
      'Are there different user roles or permissions needed?',
      'What platforms should this work on? (iOS, Android, Web)'
    ];
    return {
      question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
      category: 'technical',
      priority: 'medium',
      reasoning: 'Gathering technical requirements'
    };
  }
  
  // Stage: Refinement
  if (state.stage === 'refinement') {
    const questions = [
      'Any unique or special features that make your app stand out?',
      'Is there anything else important I should know about your app?',
      'Do you have any specific requirements I have not asked about yet?',
      'What is the one thing that will make users love your app?'
    ];
    return {
      question: getUnaskedQuestion(questions, previousQuestions) || questions[0],
      category: 'refinement',
      priority: 'low',
      reasoning: 'Final details and refinement'
    };
  }
  
  // Default fallback
  return {
    question: 'Tell me more about your app vision!',
    category: 'general',
    priority: 'low',
    reasoning: 'General encouragement'
  };
};

// Helper: Get unasked question from list
const getUnaskedQuestion = (questions: string[], askedQuestions: string[]): string | null => {
  const unasked = questions.filter(q => !askedQuestions.includes(q));
  if (unasked.length === 0) return null;
  return unasked[Math.floor(Math.random() * unasked.length)];
};
