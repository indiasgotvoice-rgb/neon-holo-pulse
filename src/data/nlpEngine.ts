// Advanced NLP engine - understands grammar, context, yes/no, pronouns, etc.

export interface ParsedMessage {
  originalText: string;
  cleanedText: string;
  tokens: string[];
  intent: string;
  isQuestion: boolean;
  isAgreement: boolean; // yes, sure, okay, yeah, definitely, etc.
  isDisagreement: boolean; // no, nope, not needed, don't want, etc.
  isVague: boolean; // idk, maybe, whatever, etc.
  isReference: boolean; // "I already said", "like I mentioned", etc.
  entities: {
    appTypes: string[];
    features: string[];
    colors: string[];
    numbers: number[];
    technologies: string[];
    designStyles: string[];
    platforms: string[];
  };
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
  confidence: number;
}

// Agreement patterns (understands yes/no in context)
const agreementPatterns = {
  strong_yes: [
    /^(yes|yeah|yep|yup|sure|definitely|absolutely|of course|for sure|correct|right|exactly|indeed)$/i,
    /^(yes|yeah|yep|yup),?\s/i,
    /\b(that'?s?\s+right|that'?s?\s+correct|you'?re?\s+right)\b/i
  ],
  mild_yes: [
    /^(ok|okay|alright|fine|sounds good|sounds great|perfect|great|good|nice)$/i,
    /\b(i agree|i think so|probably|i guess)\b/i
  ],
  strong_no: [
    /^(no|nope|nah|never|not at all|absolutely not|definitely not)$/i,
    /^(no|nope),?\s/i,
    /\b(don'?t\s+(want|need)|won'?t\s+need|not\s+needed)\b/i
  ],
  mild_no: [
    /\b(maybe not|probably not|not sure|not really|i don'?t think)\b/i,
    /\b(skip|pass|leave it)\b/i
  ]
};

// Reference patterns (user referring to previous statements)
const referencePatterns = [
  /\b(i (already|just) (said|told you|mentioned)|like i (said|mentioned|told you))\b/i,
  /\b(as i (said|mentioned)|i repeat)\b/i,
  /\b(again,|i'?ll say again)\b/i,
  /\b(that'?s what i (said|meant))\b/i
];

// Vague patterns
const vaguePatterns = [
  /^(idk|dunno|i don'?t know|not sure|maybe|whatever|anything|something)$/i,
  /\b(i guess|kind of|sort of|whatever you (want|think)|up to you)\b/i,
  /\b(doesn'?t matter|any|whichever)\b/i
];

// Parse user message with deep understanding
export const parseMessage = (
  message: string,
  conversationHistory: Array<{ content: string; sender_type: string }>
): ParsedMessage => {
  const originalText = message;
  const cleanedText = message.trim();
  const lowerText = cleanedText.toLowerCase();
  const tokens = cleanedText.split(/\s+/);

  // Check agreement/disagreement
  const isAgreement = 
    agreementPatterns.strong_yes.some(p => p.test(lowerText)) ||
    agreementPatterns.mild_yes.some(p => p.test(lowerText));
  
  const isDisagreement = 
    agreementPatterns.strong_no.some(p => p.test(lowerText)) ||
    agreementPatterns.mild_no.some(p => p.test(lowerText));

  // Check if referencing previous statement
  const isReference = referencePatterns.some(p => p.test(lowerText));

  // Check if vague
  const isVague = vaguePatterns.some(p => p.test(lowerText));

  // Detect intent
  const intent = detectIntent(cleanedText, isAgreement, isDisagreement, isReference);

  // Extract entities
  const entities = extractEntities(cleanedText);

  // Determine sentiment
  const sentiment = determineSentiment(cleanedText, isReference);

  // Is it a question?
  const isQuestion = /\?$/.test(cleanedText) || /^(what|when|where|who|why|how|can|should|will|is|are|do|does)\b/i.test(cleanedText);

  // Confidence score
  const confidence = calculateConfidence(cleanedText, entities, isVague);

  return {
    originalText,
    cleanedText,
    tokens,
    intent,
    isQuestion,
    isAgreement,
    isDisagreement,
    isVague,
    isReference,
    entities,
    sentiment,
    confidence
  };
};

// Detect intent from message
const detectIntent = (
  text: string,
  isAgreement: boolean,
  isDisagreement: boolean,
  isReference: boolean
): string => {
  const lower = text.toLowerCase();

  if (isAgreement) return 'agreeing';
  if (isDisagreement) return 'declining';
  if (isReference) return 'clarifying';

  // App type mentions
  if (/\b(app|application|software|platform|tool|system)\b/i.test(text)) {
    return 'describing_app_type';
  }

  // Feature mentions
  if (/\b(feature|function|capability|should|can|will|need|want|include)\b/i.test(text)) {
    return 'describing_features';
  }

  // Design mentions
  if (/\b(design|look|style|color|theme|ui|ux|interface|screen|button)\b/i.test(text)) {
    return 'describing_design';
  }

  // Technical mentions
  if (/\b(api|database|server|cloud|integration|authentication|payment)\b/i.test(text)) {
    return 'describing_technical';
  }

  // User flow mentions
  if (/\b(user|navigate|click|open|close|see|view|page|screen)\b/i.test(text)) {
    return 'describing_user_flow';
  }

  // Problem/purpose mentions
  if (/\b(problem|solve|help|purpose|goal|need|issue|challenge)\b/i.test(text)) {
    return 'describing_problem';
  }

  return 'general_description';
};

// Extract entities with advanced patterns
const extractEntities = (text: string) => {
  const lower = text.toLowerCase();
  
  // App types (30+ categories)
  const appTypes: string[] = [];
  const appTypePatterns: Record<string, RegExp[]> = {
    'ecommerce': [/\b(shop|shopping|store|ecommerce|e-commerce|buy|sell|product|cart|marketplace|retail)\b/i],
    'social_media': [/\b(social|instagram|facebook|twitter|tiktok|feed|post|follow|like|share|community)\b/i],
    'fitness': [/\b(fitness|workout|exercise|gym|health|calories|training|muscle|cardio)\b/i],
    'habit_tracker': [/\b(habit|routine|daily|track|streak|goal|productivity|self-improvement)\b/i],
    'food_recipe': [/\b(food|recipe|cook|meal|restaurant|delivery|dish|ingredient|kitchen)\b/i],
    'todo_productivity': [/\b(todo|task|note|reminder|checklist|organize|planner|productivity)\b/i],
    'messaging_chat': [/\b(chat|message|messaging|talk|conversation|dm|communicate|text)\b/i],
    'education': [/\b(learn|education|course|lesson|quiz|study|student|teacher|training)\b/i],
    'game': [/\b(game|play|player|score|level|arcade|puzzle|racing|multiplayer)\b/i],
    'finance': [/\b(finance|money|budget|expense|income|bank|investment|stock|crypto)\b/i],
    'dating': [/\b(dating|match|swipe|profile|relationship|meet|single|partner)\b/i],
    'travel': [/\b(travel|trip|flight|hotel|booking|vacation|destination|tourism)\b/i],
    'music': [/\b(music|song|playlist|artist|album|audio|streaming|radio)\b/i],
    'video': [/\b(video|movie|film|watch|stream|youtube|netflix|series)\b/i],
    'photo': [/\b(photo|picture|image|camera|gallery|filter|edit|instagram)\b/i],
    'news': [/\b(news|article|blog|read|journalism|magazine|media)\b/i],
    'weather': [/\b(weather|forecast|temperature|rain|sun|climate)\b/i],
    'meditation': [/\b(meditation|mindfulness|relax|calm|breathe|peace|zen)\b/i],
    'pet_care': [/\b(pet|dog|cat|animal|vet|care|feed|walk)\b/i],
    'real_estate': [/\b(real estate|property|house|apartment|rent|buy|sell|lease)\b/i],
    'healthcare': [/\b(health|medical|doctor|appointment|symptom|medicine|hospital)\b/i],
    'booking': [/\b(booking|reservation|appointment|schedule|calendar|slot)\b/i],
    'delivery': [/\b(delivery|order|courier|ship|package|track)\b/i],
    'crm': [/\b(crm|customer|client|lead|sales|pipeline|contact)\b/i],
    'hr': [/\b(hr|employee|staff|payroll|attendance|recruitment|hiring)\b/i]
  };

  for (const [type, patterns] of Object.entries(appTypePatterns)) {
    if (patterns.some(p => p.test(text))) {
      appTypes.push(type);
    }
  }

  // Features (100+ common features)
  const features: string[] = [];
  const featurePatterns: Record<string, RegExp> = {
    'authentication': /\b(login|signup|sign up|sign in|register|authentication|auth|account creation)\b/i,
    'social_login': /\b(google login|facebook login|social login|oauth|apple login)\b/i,
    'password_reset': /\b(forgot password|reset password|password recovery)\b/i,
    'email_verification': /\b(email verification|verify email|confirmation email)\b/i,
    'two_factor_auth': /\b(2fa|two factor|two-factor|authentication code)\b/i,
    'user_profile': /\b(profile|user profile|account settings|my account|bio)\b/i,
    'avatar_upload': /\b(profile picture|avatar|photo upload|profile photo)\b/i,
    'settings': /\b(settings|preferences|configuration|options)\b/i,
    'notifications': /\b(notification|push notification|alert|remind)\b/i,
    'push_notifications': /\b(push notification|mobile notification|app notification)\b/i,
    'email_notifications': /\b(email notification|email alert)\b/i,
    'in_app_messaging': /\b(in-app message|notification center)\b/i,
    'chat': /\b(chat|messaging|direct message|dm|conversation|talk)\b/i,
    'group_chat': /\b(group chat|group message|channel)\b/i,
    'voice_call': /\b(voice call|audio call|phone call)\b/i,
    'video_call': /\b(video call|video chat|webcam|facetime)\b/i,
    'file_sharing': /\b(file sharing|share file|attach file|send file)\b/i,
    'media_upload': /\b(upload|photo upload|image upload|video upload|file upload)\b/i,
    'camera': /\b(camera|take photo|capture|picture)\b/i,
    'gallery': /\b(gallery|photo library|albums)\b/i,
    'search': /\b(search|find|lookup|discover)\b/i,
    'filters': /\b(filter|sort|refine|category)\b/i,
    'favorites': /\b(favorite|wishlist|bookmark|save|starred)\b/i,
    'like': /\b(like|heart|upvote|thumbs up)\b/i,
    'comment': /\b(comment|reply|respond)\b/i,
    'share': /\b(share|forward|send to)\b/i,
    'follow': /\b(follow|subscribe|unfollow)\b/i,
    'feed': /\b(feed|timeline|stream|news feed)\b/i,
    'stories': /\b(story|stories|ephemeral|24 hours)\b/i,
    'live_streaming': /\b(live stream|broadcast|go live)\b/i,
    'payment': /\b(payment|checkout|purchase|buy|pay)\b/i,
    'stripe': /\b(stripe|stripe payment)\b/i,
    'paypal': /\b(paypal)\b/i,
    'credit_card': /\b(credit card|debit card|card payment)\b/i,
    'subscription': /\b(subscription|recurring payment|monthly|yearly)\b/i,
    'cart': /\b(cart|shopping cart|basket)\b/i,
    'wishlist': /\b(wishlist|want list|save for later)\b/i,
    'reviews': /\b(review|rating|rate|feedback|star)\b/i,
    'location': /\b(location|gps|map|geolocation|nearby)\b/i,
    'maps': /\b(map|google maps|navigation|directions)\b/i,
    'qr_code': /\b(qr code|qr scanner|scan)\b/i,
    'barcode': /\b(barcode|scan barcode)\b/i,
    'calendar': /\b(calendar|schedule|date picker|event)\b/i,
    'booking': /\b(book|reservation|appointment|slot)\b/i,
    'analytics': /\b(analytics|statistics|stats|insights|metrics)\b/i,
    'dashboard': /\b(dashboard|overview|summary|report)\b/i,
    'admin_panel': /\b(admin|admin panel|manage|control panel)\b/i,
    'multi_language': /\b(multi-language|translation|localization|i18n)\b/i,
    'dark_mode': /\b(dark mode|dark theme|night mode)\b/i,
    'offline_mode': /\b(offline|offline mode|work offline|no internet)\b/i,
    'sync': /\b(sync|synchronize|cloud sync|backup)\b/i,
    'export': /\b(export|download|backup|save as)\b/i,
    'import': /\b(import|upload data|restore)\b/i,
    'pdf_generation': /\b(pdf|generate pdf|export pdf)\b/i,
    'email': /\b(email|send email|mail)\b/i,
    'sms': /\b(sms|text message|send sms)\b/i
  };

  for (const [feature, pattern] of Object.entries(featurePatterns)) {
    if (pattern.test(text)) {
      features.push(feature);
    }
  }

  // Colors
  const colors: string[] = [];
  const colorRegex = /\b(red|blue|green|yellow|purple|pink|orange|black|white|gray|grey|cyan|magenta|brown|gold|silver|violet|indigo|turquoise|navy|maroon|teal|lime|olive|coral|salmon|peach|lavender|mint)\b/gi;
  const colorMatches = text.match(colorRegex);
  if (colorMatches) {
    colors.push(...colorMatches.map(c => c.toLowerCase()));
  }

  // Numbers
  const numbers: number[] = [];
  const numberRegex = /\b\d+\b/g;
  const numberMatches = text.match(numberRegex);
  if (numberMatches) {
    numbers.push(...numberMatches.map(n => parseInt(n)));
  }

  // Technologies
  const technologies: string[] = [];
  const techKeywords = [
    'react', 'vue', 'angular', 'node', 'python', 'java', 'swift', 'kotlin',
    'firebase', 'supabase', 'mongodb', 'postgresql', 'mysql', 'redis',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'stripe', 'paypal', 'twilio', 'sendgrid', 'cloudinary'
  ];
  for (const tech of techKeywords) {
    if (new RegExp(`\\b${tech}\\b`, 'i').test(text)) {
      technologies.push(tech);
    }
  }

  // Design styles
  const designStyles: string[] = [];
  const designKeywords = [
    'modern', 'minimal', 'minimalist', 'colorful', 'vibrant', 'professional',
    'playful', 'elegant', 'simple', 'clean', 'bold', 'flat', 'material',
    'glassmorphism', 'neumorphism', 'gradient', 'animated', 'responsive'
  ];
  for (const style of designKeywords) {
    if (new RegExp(`\\b${style}\\b`, 'i').test(text)) {
      designStyles.push(style);
    }
  }

  // Platforms
  const platforms: string[] = [];
  if (/\b(ios|iphone|ipad|apple)\b/i.test(text)) platforms.push('ios');
  if (/\b(android|google play)\b/i.test(text)) platforms.push('android');
  if (/\b(web|website|browser)\b/i.test(text)) platforms.push('web');
  if (/\b(mobile|phone|app)\b/i.test(text)) platforms.push('mobile');

  return {
    appTypes: [...new Set(appTypes)],
    features: [...new Set(features)],
    colors: [...new Set(colors)],
    numbers,
    technologies: [...new Set(technologies)],
    designStyles: [...new Set(designStyles)],
    platforms: [...new Set(platforms)]
  };
};

// Determine sentiment
const determineSentiment = (text: string, isReference: boolean): 'positive' | 'neutral' | 'negative' | 'frustrated' => {
  const lower = text.toLowerCase();

  // Frustrated (when user repeats themselves)
  if (isReference || /\b(again|repeat|already told|keep asking)\b/i.test(text)) {
    return 'frustrated';
  }

  // Negative
  const negativeWords = ['no', 'not', 'never', 'hate', 'dislike', 'bad', 'terrible', 'awful', 'wrong'];
  const negativeCount = negativeWords.filter(w => lower.includes(w)).length;
  if (negativeCount > 2) return 'negative';

  // Positive
  const positiveWords = ['yes', 'great', 'awesome', 'perfect', 'love', 'excellent', 'amazing', 'good', 'nice'];
  const positiveCount = positiveWords.filter(w => lower.includes(w)).length;
  if (positiveCount > 1) return 'positive';

  return 'neutral';
};

// Calculate confidence
const calculateConfidence = (text: string, entities: any, isVague: boolean): number => {
  if (isVague) return 10;

  const wordCount = text.split(/\s+/).length;
  const entityCount = 
    entities.appTypes.length +
    entities.features.length +
    entities.colors.length +
    entities.designStyles.length;

  let confidence = 50;
  if (wordCount > 10) confidence += 20;
  if (wordCount > 20) confidence += 10;
  if (entityCount > 0) confidence += 20;

  return Math.min(confidence, 100);
};
