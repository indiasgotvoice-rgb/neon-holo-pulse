export interface BotPromptCategory {
  category: string;
  questions: string[];
}

export const botPrompts: BotPromptCategory[] = [
  {
    category: "app_type",
    questions: [
      "What type of app do you want to build? (e.g., social media, e-commerce, productivity, game, etc.)",
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
    ]
  },
  {
    category: "design",
    questions: [
      "What design style do you prefer? (modern, minimal, colorful, professional, playful)",
      "Do you have a color scheme in mind?",
      "Can you describe the overall look and feel you want?",
      "Do you have any apps that inspire your design?",
      "Should it be dark mode, light mode, or both?",
    ]
  },
  {
    category: "user_flow",
    questions: [
      "Describe the main user journey - what happens when someone opens your app?",
      "What's the first screen users should see?",
      "How do users navigate through the app?",
      "What actions can users take on the main screen?",
      "Describe a typical user session from start to finish.",
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
    ]
  },
  {
    category: "details",
    questions: [
      "Tell me more about the specific features you mentioned.",
      "Can you elaborate on how users will interact with [feature]?",
      "What happens after a user does [action]?",
      "Are there any unique or special features that make your app different?",
      "What problems does your app solve for users?",
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
    ]
  },
  {
    category: "completion",
    questions: [
      "Perfect! I have all the information I need. Click 'Build Now' to start building your app!",
      "Excellent! I have a complete picture of your app. Ready to build when you are!",
      "Amazing! Your app description is complete. Click 'Build Now' to get started!",
    ]
  },
  {
    category: "need_more_details",
    questions: [
      "Please describe your app more deeply for better results. Include details about features, design, and functionality.",
      "I need more information to build a great app. Can you tell me more about what you want?",
      "That's a good start! Can you provide more specific details about your app?",
      "Help me understand better - what exactly do you want your app to do?",
    ]
  },
  {
    category: "welcome",
    questions: [
      "Hey! I'm your app builder",
      "Welcome! I'm here to help you build your dream app",
      "Hi there! Let's create something amazing together",
    ]
  },
  {
    category: "start",
    questions: [
      "Please start describing your app",
      "Tell me about the app you want to build",
      "What app would you like to create today?",
    ]
  }
];

// Smart prompt selector based on user message context
export const getSmartBotPrompt = (
  userMessage: string,
  completionPercentage: number,
  previousMessages: Array<{ content: string; sender_type: string }>
): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Check what user mentioned
  const mentionsFeatures = /\b(feature|function|need|want|should|can)\b/i.test(lowerMsg);
  const mentionsDesign = /\b(design|color|theme|look|style|ui|ux)\b/i.test(lowerMsg);
  const mentionsUserFlow = /\b(user|navigate|screen|page|flow|journey)\b/i.test(lowerMsg);
  const mentionsTechnical = /\b(api|integrate|database|auth|login|payment)\b/i.test(lowerMsg);
  const mentionsContent = /\b(content|data|post|article|image|video)\b/i.test(lowerMsg);
  
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
  
  // Intelligent prompt selection based on context
  if (completionPercentage < 20) {
    // Early stage - ask about app type and basic features
    if (!askedQuestions.some(q => q.includes('type of app'))) {
      return getUnaskedQuestion('app_type');
    }
    return getUnaskedQuestion('features');
  } else if (completionPercentage < 40) {
    // Mid-early - focus on features and user flow
    if (mentionsDesign) {
      return getUnaskedQuestion('design');
    }
    if (mentionsUserFlow) {
      return getUnaskedQuestion('user_flow');
    }
    return getUnaskedQuestion('features');
  } else if (completionPercentage < 60) {
    // Mid stage - design and user flow
    if (!askedQuestions.some(q => q.includes('design style'))) {
      return getUnaskedQuestion('design');
    }
    if (!askedQuestions.some(q => q.includes('user journey'))) {
      return getUnaskedQuestion('user_flow');
    }
    return getUnaskedQuestion('content');
  } else if (completionPercentage < 80) {
    // Late-mid - technical details and content
    if (mentionsTechnical) {
      return getUnaskedQuestion('technical');
    }
    if (mentionsContent) {
      return getUnaskedQuestion('content');
    }
    return getUnaskedQuestion('details');
  } else {
    // Almost done - ask for final details
    return getUnaskedQuestion('details');
  }
};
