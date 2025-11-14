// src/data/intelligenceEngine.ts
// Master intelligence engine - combines all AI systems

import { parseMessage, ParsedMessage } from './nlpEngine';
import { generateResponse, GeneratedResponse } from './responseGenerator';
import { ConversationContext } from './contextUnderstanding';
import { ConversationState } from './conversationFlow';

export interface IntelligentAnalysis {
  parsed: ParsedMessage;
  response: GeneratedResponse;
  updatedContext: ConversationContext;
  progressIncrement: number;
  shouldRespond: boolean;
}

// Main function - analyzes message and generates response
export const analyzeAndRespond = (
  userMessage: string,
  context: ConversationContext,
  state: ConversationState,
  conversationHistory: Array<{ content: string; sender_type: string }>
): IntelligentAnalysis => {
  
  console.log('🧠 Starting intelligent analysis...');
  
  // Step 1: Parse message with NLP
  const parsed = parseMessage(userMessage, conversationHistory);
  console.log('📝 Parsed:', {
    intent: parsed.intent,
    isAgreement: parsed.isAgreement,
    isDisagreement: parsed.isDisagreement,
    isReference: parsed.isReference,
    isVague: parsed.isVague,
    sentiment: parsed.sentiment,
    confidence: parsed.confidence
  });
  
  // Step 2: Update context with extracted entities
  const updatedContext: ConversationContext = {
    ...context,
    appType: parsed.entities.appTypes[0] || context.appType,
    mentionedFeatures: [...new Set([...context.mentionedFeatures, ...parsed.entities.features])],
    mentionedDesignPrefs: [...new Set([...context.mentionedDesignPrefs, ...parsed.entities.designStyles])],
    mentionedPlatforms: [...new Set([...context.mentionedPlatforms, ...parsed.entities.platforms])],
    techStack: [...new Set([...context.techStack, ...parsed.entities.technologies])],
    currentFocus: parsed.intent
  };
  
  console.log('📊 Updated context:', {
    appType: updatedContext.appType,
    features: updatedContext.mentionedFeatures.length,
    design: updatedContext.mentionedDesignPrefs.length
  });
  
  // Step 3: Get last bot question for context
  const lastBotQuestion = conversationHistory
    .slice()
    .reverse()
    .find(m => m.sender_type === 'bot')?.content || '';
  
  // Step 4: Generate intelligent response
  const response = generateResponse(
    parsed,
    updatedContext,
    state,
    lastBotQuestion
  );
  
  console.log('💬 Generated response:', {
    message: response.message,
    progressIncrement: response.progressIncrement,
    category: response.category
  });
  
  return {
    parsed,
    response,
    updatedContext,
    progressIncrement: response.progressIncrement,
    shouldRespond: true
  };
};

// Validate if message is acceptable
export const validateMessage = (message: string): { valid: boolean; reason?: string } => {
  const trimmed = message.trim();
  
  // Too short
  if (trimmed.length < 2) {
    return { valid: false, reason: 'Message is too short. Please describe your app idea.' };
  }
  
  // Only numbers or symbols
  if (/^[0-9!@#$%^&*()_+=\-{}\[\]:;"'<>,.?\/\\|`~\s]+$/.test(trimmed)) {
    return { valid: false, reason: 'Please use words to describe your app.' };
  }
  
  // No vowels (keyboard mashing)
  if (!/[aeiou]/i.test(trimmed) && trimmed.length > 3) {
    return { valid: false, reason: 'Please provide a meaningful description.' };
  }
  
  // Single character repeated
  if (/^(.)\1+$/.test(trimmed)) {
    return { valid: false, reason: 'Please describe your app idea properly.' };
  }
  
  return { valid: true };
};

// Generate completion message
export const generateCompletionMessage = (context: ConversationContext): string => {
  const messages = [
    `🎉 Perfect! Your ${context.appType?.replace('_', ' ') || 'app'} description is complete! Click 'Build Now' to start building!`,
    `🚀 Awesome! I have everything I need for your ${context.appType?.replace('_', ' ') || 'app'}. Ready to build when you are!`,
    `✨ Amazing! Your app idea is fully described. Click 'Build Now' to bring it to life!`,
    `🎊 Excellent! All details collected for your ${context.appType?.replace('_', ' ') || 'app'}. Let's build it!`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};
