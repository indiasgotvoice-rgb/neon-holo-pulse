export interface BotPromptCategory {
  category: string;
  questions: string[];
}

export const botPrompts: BotPromptCategory[] = [
  {
    category: "app_type",
    questions: [
      "What type of app do you want to build? (e.g., social media, e-commerce, productivity, game, fitness, education, etc.)",
      "Is this a business app, personal project, or something else?",
      "Who is the target audience for your app?",
    ]
  },
  {
    category: "features",
    questions: [
      "What are the main features you want in your app?",
      "Can you list 3-5 core functionalities your app must have?",
      "Do you need user authentication (login/signup)?",
      "Will users need to save or manage data?",
      "Do you need push notifications or real-time updates?",
      "Should users be able to upload photos or files?",
      "Do you need payment integration (like Stripe or PayPal)?",
      "Will there be a chat or messaging feature?",
      "Should users be able to create posts, articles, or content?",
      "Do you want a feed or timeline feature?",
      "Should users have profiles they can customize?",
      "Do you need a search or filter feature?",
      "Will there be categories or tags for organizing things?",
      "Should users be able to bookmark or favorite items?",
      "Do you need location-based features or maps?",
    ]
  },
  {
    category: "design",
    questions: [
      "What design style do you prefer? (modern, minimal, colorful, professional, playful, futuristic)",
      "Do you have a color scheme in mind? (or any specific brand colors)",
      "Can you describe the overall look and feel you want?",
      "Do you have any apps that inspire your design? (like Instagram, Twitter, Netflix, etc.)",
      "Should it be dark mode, light mode, or both?",
      "Do you want animations and smooth transitions?",
      "Should the design be simple and clean, or feature-rich?",
    ]
  },
  {
    category: "user_flow",
    questions: [
      "Describe the main user journey - what happens when someone opens your app?",
      "What's the first screen users should see after logging in?",
      "How do users navigate through the app? (tabs, menu, swipe, etc.)",
      "What actions can users take on the main screen?",
      "Describe a typical user session from start to finish.",
      "What should happen when a user clicks the main button?",
      "How do users discover new content in your app?",
    ]
  },
  {
    category: "technical",
    questions: [
      "Do you need the app to work offline?",
      "Will you integrate with any third-party services? (Google, Facebook, APIs, etc.)",
      "Do you need admin controls or a dashboard?",
      "Should the app have different user roles? (admin, user, moderator, etc.)",
      "Do you need analytics or user tracking?",
      "Should data sync across multiple devices?",
      "Do you need cloud storage for user data?",
    ]
  },
  {
    category: "content",
    questions: [
      "What kind of content will be displayed in your app?",
      "Will users create content or is it pre-loaded?",
      "Do you need categories or filters for organizing content?",
      "Should users be able to search for content?",
      "Do you want social features like likes, comments, or shares?",
      "Can users follow other users or topics?",
      "Should there be trending or recommended content?",
    ]
  },
  {
    category: "specific_app_followup",
    questions: [
      "Great! For a {app_type}, what specific features make it unique?",
      "How will users interact with {feature} in your app?",
      "Tell me more about how {feature} should work step by step.",
      "What happens after a user {action}?",
      "Should {feature} be visible on the home screen or in a separate tab?",
    ]
  },
  {
    category: "details",
    questions: [
      "Tell me more about the specific features you mentioned.",
      "Can you elaborate on how that would work?",
      "What happens after a user does that action?",
      "Are there any unique or special features that make your app different?",
      "What problems does your app solve for users?",
      "Any other important details I should know?",
    ]
  },
  {
    category: "encouragement",
    questions: [
      "Great! Can you tell me more about the features you want?",
      "That's helpful! What kind of design style do you prefer?",
      "Good progress! Can you describe the main user flow?",
      "Nice! What colors or theme would you like?",
      "Tell me more about who will use this app and how.",
      "Excellent! Any other important features I should know about?",
      "Perfect! Can you describe the visual design in more detail?",
      "Wonderful! What should happen when users first open the app?",
      "Love it! How should users navigate between different sections?",
      "That sounds interesting! What makes your app unique?",
    ]
  },
  {
    category: "completion",
    questions: [
      "Perfect! I have all the information I need. Click 'Build Now' to start building your app!",
      "Excellent! I have a complete picture of your app. Ready to build when you are!",
      "Amazing! Your app description is complete. Click 'Build Now' to get started!",
      "Great job! You've provided all the details needed. Hit 'Build Now' to begin!",
    ]
  },
  {
    category: "need_more_details",
    questions: [
      "Please describe your app more deeply for better results. Include details about features, design, and functionality.",
      "I need more information to build a great app. Can you tell me more about what you want?",
      "That's a good start! Can you provide more specific details about your app?",
      "Help me understand better - what exactly do you want your app to do?",
      "Can you elaborate more? The more details you provide, the better I can build your app!",
    ]
  },
  {
    category: "welcome",
    questions: [
      "Hey! I'm your app builder 👋",
      "Welcome! I'm here to help you build your dream app 🚀",
      "Hi there! Let's create something amazing together ✨",
    ]
  },
  {
    category: "start",
    questions: [
      "Please start describing your app - what do you want to build?",
      "Tell me about the app you want to build. What's the main idea?",
      "What app would you like to create today? Describe it to me!",
    ]
  }
];

// Detect specific app types from user message
const detectAppType = (message: string): string | null => {
  const msg = message.toLowerCase();
  
  // Social Media
  if (/\b(social|instagram|facebook|twitter|tiktok|snapchat|feed|post|follow|like|comment|share)\b/i.test(msg)) {
    return "social_media";
  }
  // E-commerce
  if (/\b(shop|store|ecommerce|e-commerce|buy|sell|product|cart|checkout|payment|stripe)\b/i.test(msg)) {
    return "ecommerce";
  }
  // Fitness
  if (/\b(fitness|workout|exercise|gym|health|calories|steps|tracking|running)\b/i.test(msg)) {
    return "fitness";
  }
  // Food/Recipe
  if (/\b(food|recipe|cook|meal|restaurant|delivery|menu|dish)\b/i.test(msg)) {
    return "food";
  }
  // Gaming
  if (/\b(game|play|player|score|level|3d|2d|arcade|puzzle)\b/i.test(msg)) {
    return "game";
  }
  // Education
  if (/\b(learn|education|course|lesson|quiz|study|student|teacher|school)\b/i.test(msg)) {
    return "education";
  }
  // Productivity
  if (/\b(todo|task|note|reminder|calendar|schedule|planner|organize)\b/i.test(msg)) {
    return "productivity";
  }
  // Music/Media
  if (/\b(music|song|playlist|spotify|audio|podcast|video|stream)\b/i.test(msg)) {
    return "media";
  }
  // Chat/Messaging
  if (/\b(chat|message|messaging|whatsapp|telegram|dm|conversation)\b/i.test(msg)) {
    return "chat";
  }
  // News
  if (/\b(news|article|blog|read|rss|headline)\b/i.test(msg)) {
    return "news";
  }
  // Travel
  if (/\b(travel|trip|flight|hotel|booking|vacation|destination)\b/i.test(msg)) {
    return "travel";
  }
  // Dating
  if (/\b(dating|match|swipe|tinder|bumble|profile|meet)\b/i.test(msg)) {
    return "dating";
  }
  
  return null;
};

// Extract mentioned features from user message
const extractFeatures = (message: string): string[] => {
  const msg = message.toLowerCase();
  const features: string[] = [];
  
  if (/\b(login|signup|auth|register|account)\b/i.test(msg)) features.push("authentication");
  if (/\b(chat|message|dm|messaging)\b/i.test(msg)) features.push("chat");
  if (/\b(payment|pay|stripe|paypal|checkout)\b/i.test(msg)) features.push("payment");
  if (/\b(upload|photo|image|video|file)\b/i.test(msg)) features.push("upload");
  if (/\b(notification|push|alert)\b/i.test(msg)) features.push("notifications");
  if (/\b(search|filter|find)\b/i.test(msg)) features.push("search");
  if (/\b(like|favorite|bookmark|save)\b/i.test(msg)) features.push("likes");
  if (/\b(comment|reply|discuss)\b/i.test(msg)) features.push("comments");
  if (/\b(share|send|forward)\b/i.test(msg)) features.push("sharing");
  if (/\b(profile|user|account|bio)\b/i.test(msg)) features.push("profiles");
  if (/\b(feed|timeline|stream)\b/i.test(msg)) features.push("feed");
  if (/\b(map|location|gps|nearby)\b/i.test(msg)) features.push("location");
  if (/\b(follow|follower|subscribe)\b/i.test(msg)) features.push("following");
  if (/\b(admin|dashboard|control|manage)\b/i.test(msg)) features.push("admin");
  if (/\b(dark mode|theme|color)\b/i.test(msg)) features.push("theming");
  
  return features;
};

// Extract design preferences
const extractDesignPrefs = (message: string): string[] => {
  const msg = message.toLowerCase();
  const prefs: string[] = [];
  
  if (/\b(modern|clean|sleek|contemporary)\b/i.test(msg)) prefs.push("modern");
  if (/\b(minimal|minimalist|simple|basic)\b/i.test(msg)) prefs.push("minimal");
  if (/\b(colorful|vibrant|bright|bold)\b/i.test(msg)) prefs.push("colorful");
  if (/\b(dark|dark mode|black|night)\b/i.test(msg)) prefs.push("dark");
  if (/\b(light|light mode|white|bright)\b/i.test(msg)) prefs.push("light");
  if (/\b(professional|corporate|business)\b/i.test(msg)) prefs.push("professional");
  if (/\b(playful|fun|casual|friendly)\b/i.test(msg)) prefs.push("playful");
  if (/\b(neon|glow|futuristic|cyber)\b/i.test(msg)) prefs.push("neon");
  
  return prefs;
};

// SUPER SMART prompt selector
export const getSmartBotPrompt = (
  userMessage: string,
  completionPercentage: number,
  previousMessages: Array<{ content: string; sender_type: string }>
): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Detect what user is talking about
  const appType = detectAppType(userMessage);
  const mentionedFeatures = extractFeatures(userMessage);
  const designPrefs = extractDesignPrefs(userMessage);
  
  // Get previously asked questions
  const askedQuestions = previousMessages
    .filter(m => m.sender_type === 'bot')
    .map(m => m.content);
  
  // Helper to get random question from category that hasn't been asked
  const getUnaskedQuestion = (category: string): string => {
    const categoryPrompts = botPrompts.find(p => p.category === category);
    if (!categoryPrompts) return getRandomEncouragement();
    
    const unasked = categoryPrompts.questions.filter(q => !askedQuestions.includes(q));
    if (unasked.length === 0) return getRandomEncouragement();
    
    return unasked[Math.floor(Math.random() * unasked.length)];
  };
  
  const getRandomEncouragement = (): string => {
    const encouragement = botPrompts.find(p => p.category === 'encouragement');
    if (!encouragement) return "Tell me more!";
    return encouragement.questions[Math.floor(Math.random() * encouragement.questions.length)];
  };
  
  // STAGE 1: Early (0-30%) - Understand app type and main idea
  if (completionPercentage < 30) {
    // If user mentioned a specific app type, ask about its unique features
    if (appType) {
      const appTypeQuestions: Record<string, string[]> = {
        social_media: [
          "Cool! For your social media app, should users be able to create posts with photos and text?",
          "Should users have profiles they can customize?",
          "Do you want a feed showing posts from people they follow?",
        ],
        ecommerce: [
          "Great! For your e-commerce app, will you sell physical products, digital products, or both?",
          "Do you need a shopping cart and checkout system?",
          "Should there be product categories and search filters?",
        ],
        fitness: [
          "Awesome! For your fitness app, do you want to track workouts, steps, calories, or all of them?",
          "Should users be able to set goals and see progress over time?",
          "Do you need workout plans or exercise libraries?",
        ],
        food: [
          "Nice! For your food app, will it be for recipes, restaurant delivery, or meal planning?",
          "Should users be able to save favorite recipes or dishes?",
          "Do you need ingredient lists and cooking instructions?",
        ],
        game: [
          "Exciting! What type of game? (puzzle, action, adventure, arcade, etc.)",
          "Will it be 2D or 3D?",
          "Do you need scoring, levels, or achievements?",
        ],
        productivity: [
          "Perfect! For your productivity app, will it focus on tasks, notes, reminders, or all of them?",
          "Should tasks have due dates and priorities?",
          "Do you need categories or projects to organize things?",
        ],
        chat: [
          "Cool! For your messaging app, should it support one-on-one chats, group chats, or both?",
          "Do you want features like photo sharing, voice messages, or video calls?",
          "Should there be read receipts and typing indicators?",
        ],
      };
      
      const specificQuestions = appTypeQuestions[appType];
      if (specificQuestions) {
        const unasked = specificQuestions.filter(q => !askedQuestions.includes(q));
        if (unasked.length > 0) {
          return unasked[0];
        }
      }
    }
    
    // Ask about app type if not detected
    if (!askedQuestions.some(q => q.toLowerCase().includes('type of app'))) {
      return "What type of app do you want to build? (e.g., social media, e-commerce, productivity, game, fitness, education, etc.)";
    }
    
    // Ask about target audience
    if (!askedQuestions.some(q => q.toLowerCase().includes('target audience'))) {
      return "Who is the target audience for your app?";
    }
    
    return getUnaskedQuestion('features');
  }
  
  // STAGE 2: Mid-Early (30-50%) - Dive into specific features
  if (completionPercentage < 50) {
    // Follow up on mentioned features
    if (mentionedFeatures.includes("authentication") && !askedQuestions.some(q => q.toLowerCase().includes('login'))) {
      return "Should users be able to sign up with email, Google, or both?";
    }
    if (mentionedFeatures.includes("chat") && !askedQuestions.some(q => q.toLowerCase().includes('messaging'))) {
      return "For the chat feature, should it be real-time? And should users be able to share photos?";
    }
    if (mentionedFeatures.includes("payment") && !askedQuestions.some(q => q.toLowerCase().includes('payment'))) {
      return "For payments, do you want one-time purchases, subscriptions, or both?";
    }
    if (mentionedFeatures.includes("upload") && !askedQuestions.some(q => q.toLowerCase().includes('upload'))) {
      return "Should users be able to upload photos, videos, or both? Any size limits?";
    }
    
    return getUnaskedQuestion('features');
  }
  
  // STAGE 3: Mid (50-70%) - Design and user experience
  if (completionPercentage < 70) {
    // Ask about design if user mentioned it
    if (designPrefs.length > 0 && !askedQuestions.some(q => q.toLowerCase().includes('color'))) {
      return "What colors or color scheme would you like? Any specific brand colors?";
    }
    
    if (!askedQuestions.some(q => q.toLowerCase().includes('design style'))) {
      return "What design style do you prefer? (modern, minimal, colorful, professional, playful, futuristic)";
    }
    
    if (!askedQuestions.some(q => q.toLowerCase().includes('user journey') || q.toLowerCase().includes('first screen'))) {
      return "What's the first screen users should see when they open your app?";
    }
    
    if (!askedQuestions.some(q => q.toLowerCase().includes('navigate'))) {
      return "How should users navigate through the app? (bottom tabs, side menu, swipe, etc.)";
    }
    
    return getUnaskedQuestion('design');
  }
  
  // STAGE 4: Late (70-90%) - Polish and technical details
  if (completionPercentage < 90) {
    if (!askedQuestions.some(q => q.toLowerCase().includes('offline'))) {
      return "Do you need the app to work offline?";
    }
    
    if (!askedQuestions.some(q => q.toLowerCase().includes('admin'))) {
      return "Do you need admin controls or a dashboard to manage users/content?";
    }
    
    if (!askedQuestions.some(q => q.toLowerCase().includes('unique') || q.toLowerCase().includes('different'))) {
      return "What makes your app unique or different from similar apps?";
    }
    
    return getUnaskedQuestion('details');
  }
  
  // STAGE 5: Final (90-100%) - Last details
  return "Any other important features or details I should know before we start building?";
};
