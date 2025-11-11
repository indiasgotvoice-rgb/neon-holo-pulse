import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Message, Conversation } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Send, FileDown, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    initializeConversation();
    subscribeToMessages();
  }, [user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    const welcomeMsg = {
      conversation_id: conversationId,
      sender_type: 'bot',
      content: "Hey! I'm your app builder",
    };

    const { error: error1 } = await supabase.from('messages').insert([welcomeMsg]);
    if (error1) {
      console.error('Error sending welcome message:', error1);
      return;
    }

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsTyping(false);

    const instructionMsg = {
      conversation_id: conversationId,
      sender_type: 'bot',
      content: 'Please start describing your app',
    };

    const { error: error2 } = await supabase.from('messages').insert([instructionMsg]);
    if (error2) console.error('Error sending instruction message:', error2);

    setShowWelcome(false);
  };

  const subscribeToMessages = () => {
    if (!user) return;

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          setConversation(payload.new as Conversation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const analyzeMessage = (message: string): { shouldUpdate: boolean; increment: number; shouldAskMore: boolean } => {
    const wordCount = message.trim().split(/\s+/).length;
    const hasDetails = /\b(app|application|feature|user|button|screen|page|data|color|design)\b/i.test(message);
    const hasNumbers = /\d/.test(message);
    const hasPunctuation = /[.!?]/.test(message);

    let score = 0;
    if (wordCount > 10) score += 3;
    if (wordCount > 25) score += 3;
    if (wordCount > 50) score += 4;
    if (hasDetails) score += 2;
    if (hasNumbers) score += 1;
    if (hasPunctuation) score += 1;

    const increment = Math.min(score, 15);
    const shouldAskMore = conversation!.completion_percentage + increment < 100;

    return { shouldUpdate: increment > 0, increment, shouldAskMore };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversation || isSending) return;

    setIsSending(true);
    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      const { error: msgError } = await supabase.from('messages').insert([
        {
          conversation_id: conversation.id,
          sender_type: 'user',
          content: messageText,
        },
      ]);

      if (msgError) throw msgError;

      const analysis = analyzeMessage(messageText);

      if (analysis.shouldUpdate) {
        const newPercentage = Math.min(conversation.completion_percentage + analysis.increment, 100);
        const updatedDescription = conversation.app_description + ' ' + messageText;

        const { error: updateError } = await supabase
          .from('conversations')
          .update({
            completion_percentage: newPercentage,
            app_description: updatedDescription,
            updated_at: new Date().toISOString(),
          })
          .eq('id', conversation.id);

        if (updateError) throw updateError;

        if (analysis.shouldAskMore && newPercentage < 100) {
          setIsTyping(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setIsTyping(false);

          const encouragementMessages = [
            "Great! Can you tell me more about the features you want?",
            "That's helpful! What kind of design style do you prefer?",
            "Good progress! Can you describe the main user flow?",
            "Nice! What colors or theme would you like?",
            "Tell me more about who will use this app and how.",
          ];

          const randomMsg = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

          await supabase.from('messages').insert([
            {
              conversation_id: conversation.id,
              sender_type: 'bot',
              content: randomMsg,
            },
          ]);
        } else if (newPercentage >= 100) {
          setIsTyping(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setIsTyping(false);

          await supabase.from('messages').insert([
            {
              conversation_id: conversation.id,
              sender_type: 'bot',
              content: "Perfect! I have all the information I need. Click 'Build Now' to start building your app!",
            },
          ]);
        }
      } else {
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsTyping(false);

        await supabase.from('messages').insert([
          {
            conversation_id: conversation.id,
            sender_type: 'bot',
            content: "Please describe your app more deeply for better results. Include details about features, design, and functionality.",
          },
        ]);
      }
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
      const { error } = await supabase
        .from('conversations')
        .update({
          status: 'building',
          is_pinned: true,
          build_percentage: 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversation.id);

      if (error) throw error;

      toast.success('Your app is now being built!');

      await supabase.from('messages').insert([
        {
          conversation_id: conversation.id,
          sender_type: 'bot',
          content: "Great! Your app is now being built. Our admin will start working on it and keep you updated!",
        },
      ]);
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
        <div className="bg-background/40 backdrop-blur-xl border-b border-neon-cyan/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center font-bold text-sm animate-neon-pulse">
              PB
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Pro Builder</h1>
              <p className="text-xs text-neon-blue/80">ID: {user.unique_user_id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-neon-cyan hover:bg-neon-cyan/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {showWelcome && (
            <div className="text-center py-12 space-y-4 animate-pulse">
              <div className="text-4xl">👋</div>
              <p className="text-neon-cyan">Initializing your builder...</p>
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

        <div className="px-6 pb-6 space-y-4">
          {conversation.status === 'describing' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neon-cyan font-medium">App Description</span>
                <span className="text-white">{conversation.completion_percentage}%</span>
              </div>
              <Progress value={conversation.completion_percentage} className="h-2" />
              {conversation.completion_percentage < 100 && (
                <p className="text-xs text-muted-foreground text-center animate-pulse">
                  Please describe your app more deeply for better results
                </p>
              )}
              {conversation.completion_percentage >= 100 && (
                <Button
                  onClick={handleBuildNow}
                  className="w-full h-12 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-cyan/80 hover:to-neon-blue/80 text-white font-bold text-lg shadow-lg shadow-neon-cyan/50 animate-pulse"
                >
                  Build Now
                </Button>
              )}
            </div>
          )}

          {conversation.status === 'building' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neon-green font-medium">Building Your App</span>
                <span className="text-white">{conversation.build_percentage}%</span>
              </div>
              <Progress value={conversation.build_percentage} className="h-2" />
              <p className="text-xs text-center text-neon-green animate-pulse">
                Our team is working on your app...
              </p>
            </div>
          )}

          {conversation.status !== 'building' && (
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
                placeholder="Describe your app..."
                className="resize-none bg-background/60 border-neon-cyan/20 focus:border-neon-cyan text-white placeholder:text-muted-foreground"
                rows={3}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isSending}
                className="h-auto bg-neon-cyan hover:bg-neon-cyan/80 text-background"
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
