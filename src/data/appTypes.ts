export interface AppTypeDefinition {
  type: string;
  keywords: string[];
  aliases: string[];
  commonFeatures: string[];
  mustHaveFeatures: string[];
  followUpQuestions: string[];
  relatedTypes: string[];
  complexityLevel: 'simple' | 'medium' | 'complex';
  examples: string[];
}

export const appTypeDatabase: AppTypeDefinition[] = [
  {
    type: "ecommerce_shopping",
    keywords: [
      "shop", "shopping", "store", "ecommerce", "e-commerce", "buy", "sell", 
      "product", "cart", "checkout", "payment", "stripe", "paypal", "purchase",
      "marketplace", "vendor", "seller", "buyer", "catalog", "inventory",
      "amazon", "shopify", "etsy", "ebay", "alibaba", "flipkart"
    ],
    aliases: [
      "shopping app", "online store", "e-commerce app", "marketplace app",
      "retail app", "product catalog", "shopping cart app"
    ],
    commonFeatures: [
      "product listings", "shopping cart", "checkout", "payment gateway",
      "product search", "filters", "categories", "wishlist", "reviews",
      "ratings", "order tracking", "user accounts", "address management"
    ],
    mustHaveFeatures: [
      "product display", "add to cart", "checkout process", "payment integration"
    ],
    followUpQuestions: [
      "Will you sell physical products, digital products, or both?",
      "Do you need multiple vendor support or single vendor?",
      "What payment methods do you want to accept?",
      "Do you need inventory management?",
      "Should there be product reviews and ratings?",
      "Do you want to offer discounts and coupon codes?",
      "Will you need shipping integration?",
      "Should customers be able to track their orders?",
      "Do you need a wishlist or favorites feature?",
      "What product categories will you have?"
    ],
    relatedTypes: ["marketplace", "retail", "booking"],
    complexityLevel: "complex",
    examples: [
      "Amazon", "eBay", "Shopify store", "Etsy", "AliExpress", "ASOS",
      "Walmart app", "Target app", "Best Buy app"
    ]
  },
  {
    type: "social_media",
    keywords: [
      "social", "instagram", "facebook", "twitter", "tiktok", "snapchat",
      "feed", "post", "follow", "like", "comment", "share", "story",
      "profile", "timeline", "friends", "followers", "social network"
    ],
    aliases: [
      "social media app", "social network", "social platform", 
      "photo sharing app", "community app"
    ],
    commonFeatures: [
      "user profiles", "news feed", "posts", "likes", "comments", "shares",
      "follow/unfollow", "stories", "direct messaging", "notifications",
      "hashtags", "mentions", "photo upload", "video upload"
    ],
    mustHaveFeatures: [
      "user profiles", "feed", "posts", "interactions (like/comment)"
    ],
    followUpQuestions: [
      "Should users be able to create posts with photos and text?",
      "Do you want stories or temporary posts?",
      "Should there be direct messaging between users?",
      "Do you need video content support?",
      "Should users be able to follow/unfollow each other?",
      "Do you want hashtags and trending topics?",
      "Should there be a discovery or explore page?",
      "Do you need group or community features?",
      "Should there be live streaming?",
      "What makes your social app unique?"
    ],
    relatedTypes: ["messaging", "content_sharing", "community"],
    complexityLevel: "complex",
    examples: [
      "Instagram", "Facebook", "Twitter", "TikTok", "LinkedIn", "Pinterest",
      "Reddit", "Tumblr", "WeChat"
    ]
  },
  {
    type: "fitness_health",
    keywords: [
      "fitness", "workout", "exercise", "gym", "health", "calories",
      "steps", "tracking", "running", "yoga", "weight", "nutrition",
      "diet", "training", "muscle", "cardio", "athlete"
    ],
    aliases: [
      "fitness app", "workout app", "health tracker", "exercise app",
      "gym app", "nutrition app"
    ],
    commonFeatures: [
      "workout tracking", "exercise library", "calorie counter", "step counter",
      "goal setting", "progress tracking", "nutrition logging", "weight tracking",
      "workout plans", "timer", "statistics", "achievements"
    ],
    mustHaveFeatures: [
      "activity tracking", "goal setting", "progress visualization"
    ],
    followUpQuestions: [
      "Will you track workouts, nutrition, or both?",
      "Do you need pre-built workout plans?",
      "Should there be video demonstrations for exercises?",
      "Do you want to integrate with wearables (Apple Watch, Fitbit)?",
      "Should users be able to set and track fitness goals?",
      "Do you need social features like challenges with friends?",
      "Should there be a calorie and meal tracker?",
      "Do you want to track body measurements and weight?",
      "Should there be rest day reminders?",
      "Do you need a water intake tracker?"
    ],
    relatedTypes: ["health", "wellness", "sports"],
    complexityLevel: "medium",
    examples: [
      "MyFitnessPal", "Strava", "Nike Training Club", "Fitbit", "Peloton",
      "8fit", "JEFIT", "StrongLifts"
    ]
  },
  {
    type: "food_recipe",
    keywords: [
      "food", "recipe", "cook", "meal", "restaurant", "delivery",
      "menu", "dish", "ingredient", "kitchen", "chef", "cuisine",
      "dinner", "lunch", "breakfast", "baking"
    ],
    aliases: [
      "recipe app", "cooking app", "food delivery app", "meal planner",
      "restaurant app"
    ],
    commonFeatures: [
      "recipe database", "ingredient lists", "cooking instructions",
      "meal planning", "grocery list", "timers", "nutritional info",
      "photo upload", "favorites", "search filters", "categories"
    ],
    mustHaveFeatures: [
      "recipe display", "ingredients list", "cooking steps"
    ],
    followUpQuestions: [
      "Is this for recipes, restaurant delivery, or meal planning?",
      "Should users be able to upload their own recipes?",
      "Do you need nutritional information for recipes?",
      "Should there be step-by-step cooking timers?",
      "Do you want dietary filters (vegan, gluten-free, etc.)?",
      "Should there be a grocery list feature?",
      "Do you need cooking videos?",
      "Should users be able to rate and review recipes?",
      "Do you want meal planning for the week?",
      "Should there be portion size calculators?"
    ],
    relatedTypes: ["delivery", "lifestyle", "social"],
    complexityLevel: "medium",
    examples: [
      "Tasty", "AllRecipes", "Yummly", "Food Network Kitchen",
      "Mealime", "Paprika", "ChefTap"
    ]
  },
  {
    type: "productivity_task",
    keywords: [
      "todo", "task", "note", "reminder", "calendar", "schedule",
      "planner", "organize", "checklist", "project", "productivity",
      "work", "management", "deadline", "priority"
    ],
    aliases: [
      "todo app", "task manager", "note taking app", "productivity app",
      "project manager", "organizer"
    ],
    commonFeatures: [
      "task creation", "due dates", "priorities", "categories", "tags",
      "reminders", "notifications", "calendar view", "recurring tasks",
      "subtasks", "notes", "file attachments", "search"
    ],
    mustHaveFeatures: [
      "create tasks", "mark complete", "organize tasks"
    ],
    followUpQuestions: [
      "Will it focus on tasks, notes, or both?",
      "Should tasks have due dates and priorities?",
      "Do you need categories or projects to organize tasks?",
      "Should there be recurring tasks or reminders?",
      "Do you want collaboration features for teams?",
      "Should there be a calendar view?",
      "Do you need file attachments for tasks?",
      "Should there be tags and labels?",
      "Do you want time tracking features?",
      "Should there be templates for common tasks?"
    ],
    relatedTypes: ["business", "calendar", "notes"],
    complexityLevel: "simple",
    examples: [
      "Todoist", "Any.do", "Microsoft To Do", "Things 3", "Notion",
      "Evernote", "Google Keep", "Trello"
    ]
  },
  {
    type: "messaging_chat",
    keywords: [
      "chat", "message", "messaging", "whatsapp", "telegram", "dm",
      "conversation", "talk", "communicate", "instant message", "text",
      "call", "video call", "voice"
    ],
    aliases: [
      "messaging app", "chat app", "instant messenger", "communication app"
    ],
    commonFeatures: [
      "one-on-one chat", "group chat", "photo sharing", "voice messages",
      "video calls", "voice calls", "read receipts", "typing indicators",
      "emoji", "stickers", "file sharing", "status updates"
    ],
    mustHaveFeatures: [
      "send messages", "receive messages", "chat history"
    ],
    followUpQuestions: [
      "Should it support one-on-one chats, group chats, or both?",
      "Do you want voice and video calling?",
      "Should there be photo and file sharing?",
      "Do you need end-to-end encryption?",
      "Should there be read receipts and typing indicators?",
      "Do you want status or story features?",
      "Should there be emoji and sticker support?",
      "Do you need voice messages?",
      "Should messages be deletable or editable?",
      "Do you want message reactions?"
    ],
    relatedTypes: ["social", "communication", "video"],
    complexityLevel: "complex",
    examples: [
      "WhatsApp", "Telegram", "Signal", "Messenger", "WeChat",
      "Discord", "Slack", "iMessage"
    ]
  },
  {
    type: "education_learning",
    keywords: [
      "learn", "education", "course", "lesson", "quiz", "study",
      "student", "teacher", "school", "training", "tutorial",
      "exam", "test", "certificate", "class", "university"
    ],
    aliases: [
      "learning app", "education app", "course app", "study app",
      "e-learning platform"
    ],
    commonFeatures: [
      "course catalog", "video lessons", "quizzes", "progress tracking",
      "certificates", "discussion forums", "assignments", "grades",
      "flashcards", "notes", "bookmarks", "search"
    ],
    mustHaveFeatures: [
      "content delivery", "learning materials", "progress tracking"
    ],
    followUpQuestions: [
      "What subjects or topics will it cover?",
      "Will there be video lessons or just text content?",
      "Should there be quizzes and tests?",
      "Do you need progress tracking for students?",
      "Should there be certificates upon completion?",
      "Do you want live classes or pre-recorded content?",
      "Should there be discussion forums or Q&A?",
      "Do you need homework or assignment submission?",
      "Should there be a gradebook or scoring system?",
      "Do you want gamification like points and badges?"
    ],
    relatedTypes: ["video", "productivity", "content"],
    complexityLevel: "medium",
    examples: [
      "Duolingo", "Coursera", "Udemy", "Khan Academy", "Skillshare",
      "edX", "Babbel", "Quizlet"
    ]
  },
  {
    type: "game",
    keywords: [
      "game", "play", "player", "score", "level", "3d", "2d",
      "arcade", "puzzle", "action", "adventure", "racing", "strategy",
      "multiplayer", "gaming", "leaderboard", "achievement"
    ],
    aliases: [
      "mobile game", "video game", "gaming app", "game app"
    ],
    commonFeatures: [
      "gameplay mechanics", "scoring system", "levels", "achievements",
      "leaderboards", "save/load", "settings", "sound effects", "music",
      "difficulty levels", "power-ups", "characters"
    ],
    mustHaveFeatures: [
      "game mechanics", "user interaction", "scoring or progression"
    ],
    followUpQuestions: [
      "What type of game? (puzzle, action, adventure, racing, strategy, etc.)",
      "Will it be 2D or 3D?",
      "Do you need scoring and leaderboards?",
      "Should there be multiple levels or stages?",
      "Will it be single-player, multiplayer, or both?",
      "Should there be character customization?",
      "Do you need power-ups or special items?",
      "Should there be achievements or trophies?",
      "Do you want in-game currency?",
      "Will there be ads or in-app purchases?"
    ],
    relatedTypes: ["entertainment", "arcade", "sports"],
    complexityLevel: "complex",
    examples: [
      "Candy Crush", "PUBG Mobile", "Among Us", "Clash of Clans",
      "Subway Surfers", "Temple Run", "Angry Birds"
    ]
  }
];

// Smart app type detection with confidence scoring
export const detectAppTypeAdvanced = (message: string): { type: string; confidence: number } | null => {
  const lowerMsg = message.toLowerCase();
  let bestMatch: { type: string; confidence: number } | null = null;

  for (const appDef of appTypeDatabase) {
    let confidence = 0;
    
    // Check keywords
    const keywordMatches = appDef.keywords.filter(keyword => 
      lowerMsg.includes(keyword.toLowerCase())
    ).length;
    confidence += keywordMatches * 10;
    
    // Check aliases (stronger match)
    const aliasMatches = appDef.aliases.filter(alias => 
      lowerMsg.includes(alias.toLowerCase())
    ).length;
    confidence += aliasMatches * 25;
    
    // Check common features mentioned
    const featureMatches = appDef.commonFeatures.filter(feature => 
      lowerMsg.includes(feature.toLowerCase())
    ).length;
    confidence += featureMatches * 5;
    
    // Check examples mentioned
    const exampleMatches = appDef.examples.filter(example => 
      lowerMsg.toLowerCase().includes(example.toLowerCase())
    ).length;
    confidence += exampleMatches * 30;
    
    if (confidence > 0 && (!bestMatch || confidence > bestMatch.confidence)) {
      bestMatch = { type: appDef.type, confidence };
    }
  }
  
  return bestMatch && bestMatch.confidence >= 10 ? bestMatch : null;
};

// Get follow-up questions for detected app type
export const getAppTypeFollowUps = (appType: string): string[] => {
  const appDef = appTypeDatabase.find(def => def.type === appType);
  return appDef?.followUpQuestions || [];
};

// Get must-have features for app type
export const getMustHaveFeatures = (appType: string): string[] => {
  const appDef = appTypeDatabase.find(def => def.type === appType);
  return appDef?.mustHaveFeatures || [];
};

// Check if message mentions features
export const extractMentionedFeatures = (message: string, appType: string): string[] => {
  const appDef = appTypeDatabase.find(def => def.type === appType);
  if (!appDef) return [];
  
  const mentioned: string[] = [];
  const lowerMsg = message.toLowerCase();
  
  for (const feature of appDef.commonFeatures) {
    if (lowerMsg.includes(feature.toLowerCase())) {
      mentioned.push(feature);
    }
  }
  
  return mentioned;
};

// Add this at the end of appTypes.ts file (before the last closing bracket)

// Extract features mentioned in message that match app type's common features
export const extractMentionedFeatures = (message: string, appType: string): string[] => {
  const appDef = appTypeDatabase.find(def => def.type === appType);
  if (!appDef) return [];
  
  const mentioned: string[] = [];
  const lowerMsg = message.toLowerCase();
  
  for (const feature of appDef.commonFeatures) {
    if (lowerMsg.includes(feature.toLowerCase())) {
      mentioned.push(feature);
    }
  }
  
  return mentioned;
};
