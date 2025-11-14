import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Message, Conversation } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Send, FileDown, LogOut, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// 🧠 IMPORT ALL INTELLIGENCE SYSTEMS
import { detectAppTypeAdvanced } from '@/data/appTypes';
import { 
  analyzeIntent, 
  extractEntities, 
  updateContext, 
  ConversationContext,
  calculateConversationCompleteness 
} from '@/data/contextUnderstanding';
import { scoreMessage, isValidMessage } from '@/data/scoringSystem';
import {
  determineConversationStage,
  updateConversationState,
  initializeConversationState,
  ConversationState,
  isOffTopic,
  getRedirectionMessage,
  getStageGuidance
} from '@/data/conversationFlow';
import { generateSmartQuestion } from '@/data/questionGenerator';

const Chat = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef<number>(0);

  // 🧠 INTELLIGENCE STATE
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    mentionedFeatures: [],
    mentionedDesignPrefs: [],
    mentionedPlatforms: [],
    techStack: [],
    currentFocus: 'initial'
  });
  const [conversationState, setConversationState] = useState<ConversationState>(
    initializeConversationState()
  );

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    initializeConversation();
  }, [user, navigate]);

  // Auto-refresh polling
  useEffect(() => {
    if (!conversation) return;
    console.log('🔄 Starting auto-refresh polling...');
    
    pollingIntervalRef.current = setInterval(async () => {
      await refreshMessages(true);
    }, 2000);

    return () => {
      console.log('🛑 Stopping auto-refresh polling');
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const refreshMessages = async (silent = false) => {
    if (!conversation) return;
    
    try {
      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const newMessageCount = msgs?.length || 0;
      
      if (newMessageCount !== lastMessageCountRef.current) {
        console.log('✅ New messages detected:', newMessageCount - lastMessageCountRef.current);
        setMessages(msgs || []);
        lastMessageCountRef.current = newMessageCount;
        
        if (!silent) {
          toast.success('Messages refreshed');
        }
      }

      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversation.id)
        .single();

      if (!convError && conv) {
        setConversation(conv);
      }
    } catch (error) {
      console.error('Error refreshing:', error);
      if (!silent) {
        toast.error('Failed to refresh messages');
      }
    }
  };

  const initializeConversation = async () => {
    if (!user) return;

    try {
      let { data: existingConv, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingConv) {
        const { data: newConv, error: insertError } = await supabase
          .from('conversations')
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (insertError) throw insertError;
        existingConv = newConv;

        setTimeout(() => sendWelcomeMessages(newConv.id), 1000);
      } else {
        const { data: msgs, error: msgsError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', existingConv.id)
          .order('created_at', { ascending: true });

        if (msgsError) throw msgsError;
        setMessages(msgs || []);
        lastMessageCountRef.current = msgs?.length || 0;
        setShowWelcome(false);
      }

      setConversation(existingConv);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error('Failed to load conversation');
    }
  };

  const sendWelcomeMessages = async (conversationId: string) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsTyping(false);

    await supabase.from('messages').insert([{
      conversation_id: conversationId,
      sender_type: 'bot',
      content: "Hey! I'm your Pro Builder AI 👋 Ready to turn your app idea into reality?",
    }]);

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setIsTyping(false);

    await supabase.from('messages').insert([{
      conversation_id: conversationId,
      sender_type: 'bot',
      content: "Tell me about the app you want to build. What type of app is it? (For example: shopping, social media, fitness, productivity, etc.)",
    }]);

    setShowWelcome(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversation || isSending) return;

    setIsSending(true);
    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      // Insert user message
      await supabase.from('messages').insert([{
        conversation_id: conversation.id,
        sender_type: 'user',
        content: messageText,
      }]);

      console.log('💬 User said:', messageText);

      // 🧠 STEP 1: Validate message
      const validation = isValidMessage(messageText);
      if (!validation.valid) {
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsTyping(false);

        await supabase.from('messages').insert([{
          conversation_id: conversation.id,
          sender_type: 'bot',
          content: validation.reason || "Please provide a meaningful description of your app.",
        }]);

        setTimeout(() => refreshMessages(true), 500);
        setIsSending(false);
        return;
      }

      // 🧠 STEP 2: Detect app type
      const detectedAppType = detectAppTypeAdvanced(messageText);
      if (detectedAppType && !conversationContext.appType) {
        console.log('🎯 Detected app type:', detectedAppType);
        setConversationContext(prev => ({ ...prev, appType: detectedAppType.type }));
      }

      // 🧠 STEP 3: Extract entities (features, platforms, etc.)
      const entities = extractEntities(messageText);
      console.log('📦 Extracted entities:', entities);

      // 🧠 STEP 4: Analyze intent
      const intent = analyzeIntent(messageText, conversationContext);
      console.log('🎯 Intent Analysis:', intent);

      // 🧠 STEP 5: Update context
      const updatedContext = updateContext(conversationContext, messageText, intent);
      setConversationContext(updatedContext);
      console.log('📊 Updated Context:', updatedContext);

      // 🧠 STEP 6: Score message
      const messageScore = scoreMessage(messageText, intent, updatedContext, messages);
      console.log('⭐ Message Score:', messageScore);

      // 🧠 STEP 7: Update conversation state
      const updatedState = updateConversationState(
        conversationState,
        messageScore,
        updatedContext
      );
      setConversationState(updatedState);
      console.log('🔄 Updated State:', updatedState);

      // 🧠 STEP 8: Calculate new completion percentage
      const contextCompleteness = calculateConversationCompleteness(updatedContext);
      const newPercentage = Math.max(
        conversation.completion_percentage + messageScore.progressIncrement,
        contextCompleteness
      );
      const finalPercentage = Math.min(newPercentage, 100);

      console.log(`📈 Progress: ${conversation.completion_percentage}% → ${finalPercentage}%`);
      console.log(`📊 Context Completeness: ${contextCompleteness}%`);
      console.log(`➕ Progress Increment: +${messageScore.progressIncrement}%`);

      // Update database
      await supabase
        .from('conversations')
        .update({
          completion_percentage: finalPercentage,
          app_description: conversation.app_description + ' ' + messageText,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversation.id);

      // 🧠 STEP 9: Generate smart response
      if (finalPercentage < 100) {
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsTyping(false);

        const smartQuestion = generateSmartQuestion(
          messageText,
          updatedContext,
          updatedState,
          conversationState.questionsAsked
        );

        console.log('🤖 Smart Question:', smartQuestion);

        await supabase.from('messages').insert([{
          conversation_id: conversation.id,
          sender_type: 'bot',
          content: smartQuestion.question,
        }]);

        // Update state with asked question
        setConversationState(prev => ({
          ...prev,
          questionsAsked: [...prev.questionsAsked, smartQuestion.question]
        }));

      } else {
        // Completion reached
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsTyping(false);

        await supabase.from('messages').insert([{
          conversation_id: conversation.id,
          sender_type: 'bot',
          content: "🎉 Perfect! I have everything I need. Your app description is complete! Click 'Build Now' to start building your dream app!",
        }]);
      }

      setTimeout(() => refreshMessages(true), 500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleBuildNow = async () => {
    if (!conversation || conversation.completion_percentage < 100) return;

    try {
      await supabase
        .from('conversations')
        .update({
          status: 'building',
          is_pinned: true,
          build_percentage: 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversation.id);

      toast.success('Your app is now being built!');

      await supabase.from('messages').insert([{
        conversation_id: conversation.id,
        sender_type: 'bot',
        content: "🚀 Awesome! Your app is now in the build queue. Our admin will start working on it and keep you updated with progress!",
      }]);

      setTimeout(() => refreshMessages(true), 500);
    } catch (error) {
      console.error('Error starting build:', error);
      toast.error('Failed to start build');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user || !conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-background/40 backdrop-blur-xl border-b border-neon-cyan/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center font-bold text-sm animate-neon-pulse">
              PB
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Pro Builder AI</h1>
              <p className="text-xs text-neon-blue/80">
                {conversationContext.appType 
                  ? `App Type: ${conversationContext.appType.replace('_', ' ')}`
                  : 'Discovering your app...'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refreshMessages(false)}
              className="text-neon-cyan hover:bg-neon-cyan/10"
              title="Refresh messages"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-neon-cyan hover:bg-neon-cyan/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {showWelcome && (
            <div className="text-center py-12 space-y-4 animate-pulse">
              <div className="text-4xl">🤖</div>
              <p className="text-neon-cyan">Initializing Pro Builder AI...</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-300`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender_type === 'user'
                    ? 'bg-neon-cyan/20 border border-neon-cyan/40 text-white'
                    : msg.sender_type === 'admin'
                    ? 'bg-neon-purple/20 border border-neon-purple/40 text-white'
                    : 'bg-background/60 border border-neon-blue/20 text-white'
                }`}
              >
                {msg.sender_type === 'admin' && (
                  <div className="text-xs text-neon-purple mb-1 font-semibold">Admin</div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.file_url && (
                  <a
                    href={msg.file_url}
                    download={msg.file_name}
                    className="flex items-center gap-2 mt-2 text-xs text-neon-cyan hover:text-neon-blue transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    {msg.file_name}
                  </a>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-background/60 border border-neon-blue/20 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Progress & Input */}
        <div className="px-6 pb-6 space-y-4">
          {conversation.status === 'describing' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neon-cyan font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  App Description Progress
                </span>
                <span className="text-white font-bold">{conversation.completion_percentage}%</span>
              </div>
              <Progress value={conversation.completion_percentage} className="h-2" />
              {conversationContext.mentionedFeatures.length > 0 && (
                <p className="text-xs text-neon-blue/60">
                  Features detected: {conversationContext.mentionedFeatures.slice(0, 3).join(', ')}
                  {conversationContext.mentionedFeatures.length > 3 && '...'}
                </p>
              )}
              {conversation.completion_percentage >= 100 && (
                <Button
                  onClick={handleBuildNow}
                  className="w-full h-12 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-cyan/80 hover:to-neon-blue/80 text-white font-bold text-lg shadow-lg shadow-neon-cyan/50 animate-pulse"
                >
                  🚀 Build Now
                </Button>
              )}
            </div>
          )}

          {conversation.status === 'building' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neon-purple font-medium">Build Progress</span>
                <span className="text-white font-bold">{conversation.build_percentage}%</span>
              </div>
              <Progress value={conversation.build_percentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                🔨 Your app is being built. The admin will keep you updated!
              </p>
            </div>
          )}

          {conversation.status === 'completed' && (
            <div className="text-center space-y-4 p-6 bg-neon-green/10 border border-neon-green/20 rounded-2xl">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold text-neon-green">Your App is Ready!</h3>
              <p className="text-sm text-muted-foreground">
                Check the messages above for your APK download link
              </p>
            </div>
          )}

          {conversation.status === 'describing' && (
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Describe your app in detail..."
                className="flex-1 min-h-[60px] bg-background/60 border-neon-cyan/20 focus:border-neon-cyan text-white placeholder:text-muted-foreground resize-none"
                disabled={isSending}
              />
              <Button
                onClick={sendMessage}
                disabled={isSending || !inputMessage.trim()}
                className="h-[60px] w-[60px] bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-cyan/80 hover:to-neon-blue/80 text-white disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
