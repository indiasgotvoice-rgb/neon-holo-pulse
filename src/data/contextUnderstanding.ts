export interface MessageIntent {
  primaryIntent: string;
  confidence: number;
  entities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  completeness: number; // 0-100
  needsClarification: boolean;
}

export interface ConversationContext {
  appType?: string;
  mentionedFeatures: string[];
  mentionedDesignPrefs: string[];
  mentionedPlatforms: string[];
  problemStatement?: string;
  targetAudience?: string;
  uniqueValue?: string;
  techStack: string[];
  currentFocus: string; // What the conversation is currently about
}

// Intent patterns for different conversation goals
const intentPatterns = {
  describing_app_type: {
    patterns: [
      /\b(i want|need|looking for|trying to (build|create|make))\s+(?:a|an)?\s*(\w+)\s+app/i,
      /\b(app|application|platform)\s+(for|about|that)\s+(\w+)/i,
      /\b(like|similar to|clone of|inspired by)\s+(\w+)/i,
      /\b(shopping|social|fitness|game|chat|messaging|education)\s+app/i,
    ],
    keywords: ['app', 'application', 'platform', 'website', 'system'],
    confidence: 0.8
  },
  
  describing_features: {
    patterns: [
      /\b(should have|needs|wants|includes?)\s+(\w+)/i,
      /\b(feature|function|capability|ability)\s+(to|for)\s+(\w+)/i,
      /\b(users? can|allow users? to|let users?)\s+(\w+)/i,
      /\b(with|having|including)\s+(login|payment|chat|search|upload)/i,
    ],
    keywords: ['feature', 'functionality', 'capability', 'need', 'want', 'should', 'must', 'can'],
    confidence: 0.7
  },
  
  describing_design: {
    patterns: [
      /\b(design|look|style|theme|color|ui|ux)\b/i,
      /\b(modern|minimal|colorful|dark|light|professional|playful)\s+(design|style|theme)/i,
      /\b(should look|want it to look|design should be)\s+(\w+)/i,
    ],
    keywords: ['design', 'style', 'theme', 'color', 'modern', 'minimal', 'ui', 'ux'],
    confidence: 0.7
  },
  
  describing_user_flow: {
    patterns: [
      /\b(when (user|someone) (opens?|uses?|clicks?))/i,
      /\b(first screen|home screen|landing page|main page)/i,
      /\b(navigate|navigation|flow|journey|path)/i,
      /\b(after|then|next|before)\s+(user|they)/i,
    ],
    keywords: ['user', 'screen', 'page', 'navigate', 'flow', 'journey', 'step'],
    confidence: 0.6
  },
  
  describing_problem: {
    patterns: [
      /\b(problem|issue|challenge|difficulty)\s+(is|with)/i,
      /\b(solves?|solving|solution for|helps? with)\s+(\w+)/i,
      /\b(users? (struggle|have trouble|find it hard|can't|cannot))/i,
      /\b(pain point|frustration|obstacle)/i,
    ],
    keywords: ['problem', 'solve', 'solution', 'issue', 'challenge', 'difficulty', 'pain point'],
    confidence: 0.8
  },
  
  describing_target_audience: {
    patterns: [
      /\b(for|target(ing)?|aimed at)\s+(people|users?|customers?|clients?)/i,
      /\b(audience|demographic|market)\s+(is|are)/i,
      /\b(age group|teenagers?|adults?|seniors?|kids?|children)/i,
      /\b(business(es)?|consumers?|students?|teachers?|professionals?)/i,
    ],
    keywords: ['target', 'audience', 'users', 'customers', 'demographic', 'market'],
    confidence: 0.7
  },
  
  vague_or_unclear: {
    patterns: [
      /^(ok|okay|yes|no|sure|maybe|idk|dunno|hmm|uh)$/i,
      /^.{1,5}$/,  // Very short messages
      /^[^a-zA-Z]+$/,  // No letters
    ],
    keywords: [],
    confidence: 0.9
  }
};

// Analyze message intent
export const analyzeIntent = (message: string, context: ConversationContext): MessageIntent => {
  const lowerMsg = message.toLowerCase();
  let primaryIntent = 'unknown';
  let maxConfidence = 0;
  const entities: string[] = [];
  
  // Check each intent pattern
  for (const [intent, config] of Object.entries(intentPatterns)) {
    let confidence = 0;
    
    // Pattern matching
    for (const pattern of config.patterns) {
      if (pattern.test(message)) {
        confidence += config.confidence;
        const matches = message.match(pattern);
        if (matches && matches.length > 1) {
          entities.push(...matches.slice(1).filter(m => m));
        }
      }
    }
    
    // Keyword matching
    const keywordMatches = config.keywords.filter(kw => lowerMsg.includes(kw)).length;
    confidence += keywordMatches * 0.1;
    
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      primaryIntent = intent;
    }
  }
  
  // Determine sentiment
  const sentiment = determineSentiment(message);
  
  // Calculate completeness (how detailed is the message)
  const completeness = calculateCompleteness(message, primaryIntent);
  
  // Determine if clarification needed
  const needsClarification = 
    primaryIntent === 'vague_or_unclear' || 
    completeness < 30 || 
    message.trim().split(/\s+/).length < 3;
  
  return {
    primaryIntent,
    confidence: Math.min(maxConfidence, 1.0),
    entities: [...new Set(entities)],
    sentiment,
    completeness,
    needsClarification
  };
};

// Determine message sentiment
const determineSentiment = (message: string): 'positive' | 'neutral' | 'negative' => {
  const lowerMsg = message.toLowerCase();
  
  const positiveWords = ['great', 'awesome', 'perfect', 'love', 'excellent', 'amazing', 'yes', 'sure', 'definitely'];
  const negativeWords = ['no', 'don\'t', 'can\'t', 'won\'t', 'never', 'bad', 'difficult', 'hard', 'problem'];
  
  const positiveCount = positiveWords.filter(w => lowerMsg.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lowerMsg.includes(w)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Calculate how complete/detailed a message is
const calculateCompleteness = (message: string, intent: string): number => {
  const wordCount = message.trim().split(/\s+/).length;
  let score = 0;
  
  // Word count scoring
  if (wordCount > 5) score += 20;
  if (wordCount > 10) score += 20;
  if (wordCount > 20) score += 20;
  if (wordCount > 40) score += 20;
  
  // Has specific details
  if (/\b(specifically|exactly|precisely|particularly)\b/i.test(message)) score += 10;
  
  // Has numbers or examples
  if (/\d/.test(message)) score += 5;
  if (/\b(like|such as|for example|e\.g\.|example)\b/i.test(message)) score += 10;
  
  // Has action words
  if (/\b(will|should|can|must|need|want)\b/i.test(message)) score += 5;
  
  // Intent-specific scoring
  if (intent === 'describing_features' && /\b(feature|function|allow|enable)\b/i.test(message)) score += 10;
  if (intent === 'describing_design' && /\b(color|theme|style|modern|minimal)\b/i.test(message)) score += 10;
  
  return Math.min(score, 100);
};

// Extract specific entities from message
export const extractEntities = (message: string): {
  appTypes: string[];
  features: string[];
  platforms: string[];
  technologies: string[];
  competitors: string[];
} => {
  const lowerMsg = message.toLowerCase();
  
  // App type entities
  const appTypes: string[] = [];
  const appTypeKeywords = {
    'ecommerce': ['shop', 'shopping', 'store', 'ecommerce', 'e-commerce', 'buy', 'sell', 'product'],
    'social': ['social', 'instagram', 'facebook', 'twitter', 'feed', 'post', 'follow'],
    'fitness': ['fitness', 'workout', 'exercise', 'gym', 'health', 'calories'],
    'food': ['food', 'recipe', 'cook', 'meal', 'restaurant', 'delivery'],
    'game': ['game', 'play', 'player', 'score', 'level'],
    'productivity': ['todo', 'task', 'note', 'reminder', 'calendar'],
    'messaging': ['chat', 'message', 'messaging', 'dm', 'conversation'],
    'education': ['learn', 'education', 'course', 'lesson', 'quiz', 'study']
  };
  
  for (const [type, keywords] of Object.entries(appTypeKeywords)) {
    if (keywords.some(kw => lowerMsg.includes(kw))) {
      appTypes.push(type);
    }
  }
  
  // Feature entities
  const features: string[] = [];
  const featureKeywords = [
    'login', 'signup', 'authentication', 'auth',
    'payment', 'checkout', 'stripe', 'paypal',
    'chat', 'messaging', 'notification', 'push notification',
    'search', 'filter', 'sort',
    'upload', 'download', 'file', 'photo', 'image', 'video',
    'profile', 'account', 'dashboard',
    'like', 'comment', 'share', 'follow',
    'rating', 'review', 'feedback'
  ];
  
  for (const feature of featureKeywords) {
    if (lowerMsg.includes(feature)) {
      features.push(feature);
    }
  }
  
  // Platform entities
  const platforms: string[] = [];
  if (/\b(ios|iphone|ipad|apple)\b/i.test(message)) platforms.push('ios');
  if (/\b(android|google play)\b/i.test(message)) platforms.push('android');
  if (/\b(web|website|browser)\b/i.test(message)) platforms.push('web');
  if (/\b(mobile|phone)\b/i.test(message)) platforms.push('mobile');
  
  // Technology entities
  const technologies: string[] = [];
  const techKeywords = ['react', 'vue', 'angular', 'node', 'python', 'java', 'swift', 'kotlin', 'firebase', 'supabase', 'mongodb', 'postgresql'];
  for (const tech of techKeywords) {
    if (lowerMsg.includes(tech)) {
      technologies.push(tech);
    }
  }
  
  // Competitor entities (mentioned apps)
  const competitors: string[] = [];
  const competitorKeywords = [
    'instagram', 'facebook', 'twitter', 'tiktok', 'snapchat',
    'amazon', 'ebay', 'shopify', 'etsy',
    'uber', 'lyft', 'airbnb',
    'netflix', 'spotify', 'youtube',
    'whatsapp', 'telegram', 'discord', 'slack'
  ];
  for (const competitor of competitorKeywords) {
    if (lowerMsg.includes(competitor)) {
      competitors.push(competitor);
    }
  }
  
  return {
    appTypes: [...new Set(appTypes)],
    features: [...new Set(features)],
    platforms: [...new Set(platforms)],
    technologies: [...new Set(technologies)],
    competitors: [...new Set(competitors)]
  };
};

// Update conversation context based on new message
export const updateContext = (
  currentContext: ConversationContext,
  message: string,
  intent: MessageIntent
): ConversationContext => {
  const entities = extractEntities(message);
  
  const updatedContext: ConversationContext = {
    ...currentContext,
    mentionedFeatures: [...new Set([...currentContext.mentionedFeatures, ...entities.features])],
    mentionedDesignPrefs: currentContext.mentionedDesignPrefs,
    mentionedPlatforms: [...new Set([...currentContext.mentionedPlatforms, ...entities.platforms])],
    techStack: [...new Set([...currentContext.techStack, ...entities.technologies])],
    currentFocus: intent.primaryIntent
  };
  
  // Update app type if detected
  if (entities.appTypes.length > 0 && !currentContext.appType) {
    updatedContext.appType = entities.appTypes[0];
  }
  
  // Extract problem statement
  if (intent.primaryIntent === 'describing_problem') {
    updatedContext.problemStatement = message;
  }
  
  // Extract target audience
  if (intent.primaryIntent === 'describing_target_audience') {
    updatedContext.targetAudience = message;
  }
  
  return updatedContext;
};

// Determine what information is still missing
export const getMissingInformation = (context: ConversationContext): string[] => {
  const missing: string[] = [];
  
  if (!context.appType) {
    missing.push('app_type');
  }
  
  if (context.mentionedFeatures.length < 3) {
    missing.push('core_features');
  }
  
  if (!context.problemStatement) {
    missing.push('problem_statement');
  }
  
  if (!context.targetAudience) {
    missing.push('target_audience');
  }
  
  if (context.mentionedDesignPrefs.length === 0) {
    missing.push('design_preferences');
  }
  
  if (context.mentionedPlatforms.length === 0) {
    missing.push('platform');
  }
  
  return missing;
};

// Calculate overall conversation completeness
export const calculateConversationCompleteness = (context: ConversationContext): number => {
  let score = 0;
  
  if (context.appType) score += 20;
  if (context.mentionedFeatures.length >= 3) score += 25;
  if (context.mentionedFeatures.length >= 5) score += 10;
  if (context.problemStatement) score += 15;
  if (context.targetAudience) score += 10;
  if (context.mentionedDesignPrefs.length > 0) score += 10;
  if (context.mentionedPlatforms.length > 0) score += 5;
  if (context.uniqueValue) score += 5;
  
  return Math.min(score, 100);
};
