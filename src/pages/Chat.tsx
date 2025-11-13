import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Message, Conversation } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Send, FileDown, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { botPrompts, getSmartBotPrompt } from '@/data/botPrompts';

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
  }, [user, navigate]);

  // Subscribe after conversation is loaded - Using Broadcast (Free Tier)
  useEffect(() => {
    if (!conversation) return;
    
    console.log('🔴 Setting up realtime broadcast for conversation:', conversation.id);
    
    const channel = supabase
      .channel(`room-${conversation.id}`)
      .on('broadcast', { event: 'new_message' }, (payload) => {
        console.log('✅ Broadcast message received:', payload.payload);
        const newMessage = payload.payload as Message;
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      })
      .on('broadcast', { event: 'conversation_update' }, (payload) => {
        console.log('✅ Broadcast conversation update:', payload.payload);
        setConversation(payload.payload as Conversation);
      })
      .subscribe((status) => {
        console.log('📡 Broadcast status:', status);
      });

    return () => {
      console.log('🔴 Unsubscribing from broadcast');
      supabase.removeChannel(channel);
    };
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const broadcastMessage = async (message: Message) => {
    if (!conversation) return;
    try {
      await supabase.channel(`room-${conversation.id}`).send({
        type: 'broadcast',
        event: 'new_message',
        payload: message,
      });
    } catch (error) {
      console.error('Broadcast error:', error);
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

    const welcomePrompts = botPrompts.find(p => p.category === 'welcome');
    const welcomeMsg = welcomePrompts?.questions[0] || "Hey! I'm your app builder";

    const { data, error: error1 } = await supabase.from('messages').insert([{
      conversation_id: conversationId,
      sender_type: 'bot',
      content: welcomeMsg,
    }]).select();
    
    if (error1) {
      console.error('Error sending welcome message:', error1);
      return;
    }
    if (data && data[0]) await broadcastMessage(data[0]);

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsTyping(false);

    const startPrompts = botPrompts.find(p => p.category === 'start');
    const startMsg = startPrompts?.questions[0] || "Please start describing your app";

    const { data: data2, error: error2 } = await supabase.from('messages').insert([{
      conversation_id: conversationId,
      sender_type: 'bot',
      content: startMsg,
    }]).select();
    
    if (error2) console.error('Error sending start message:', error2);
    if (data2 && data2[0]) await broadcastMessage(data2[0]);

    setShowWelcome(false);
  };

  const analyzeMessage = (message: string): { shouldUpdate: boolean; increment: number; shouldAskMore: boolean } => {
    const wordCount = message.trim().split(/\s+/).length;
    const hasDetails = /\b(app|application|feature|user|button|screen|page|data|color|design|login|payment|notification|upload|chat|profile|search|filter|dashboard)\b/i.test(message);
    const hasNumbers = /\d/.test(message);
    const hasPunctuation = /[.!?]/.test(message);
    const hasSpecificDetails = /\b(will|should|can|need|want|must|allow|enable|include)\b/i.test(message);

    let score = 0;
    if (wordCount > 10) score += 3;
    if (wordCount > 25) score += 3;
    if (wordCount > 50) score += 4;
    if (hasDetails) score += 3;
    if (hasNumbers) score += 1;
    if (hasPunctuation) score += 1;
    if (hasSpecificDetails) score += 2;

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
      const { data: insertedMsg, error: msgError } = await supabase.from('messages').insert([
        {
          conversation_id: conversation.id,
          sender_type: 'user',
          content: messageText,
        },
      ]).select();

      if (msgError) throw msgError;
      if (insertedMsg && insertedMsg[0]) await broadcastMessage(insertedMsg[0]);

      const analysis = analyzeMessage(messageText);
      console.log('Message analysis:', analysis);

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

          const smartPrompt = getSmartBotPrompt(messageText, newPercentage, messages);

          console.log('Sending smart bot prompt:', smartPrompt);
          
          const { data, error } = await supabase.from('messages').insert([
            {
              conversation_id: conversation.id,
              sender_type: 'bot',
              content: smartPrompt,
            },
          ]).select();
          
          if (error) {
            console.error('Failed to insert bot message:', error);
          } else if (data && data[0]) {
            await broadcastMessage(data[0]);
          }
        } else if (newPercentage >= 100) {
          setIsTyping(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setIsTyping(false);

          const completionPrompts = botPrompts.find(p => p.category === 'completion');
          const completionMsg = completionPrompts?.questions[0] || "Perfect! I have all the information I need. Click 'Build Now' to start building your app!";
          
          const { data, error } = await supabase.from('messages').insert([
            {
              conversation_id: conversation.id,
              sender_type: 'bot',
              content: completionMsg,
            },
          ]).select();
          
          if (error) {
            console.error('Failed to insert completion message:', error);
          } else if (data && data[0]) {
            await broadcastMessage(data[0]);
          }
        }
      } else {
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsTyping(false);

        const needMorePrompts = botPrompts.find(p => p.category === 'need_more_details');
        const needMoreMsg = needMorePrompts?.questions[Math.floor(Math.random() * needMorePrompts.questions.length)] || "Please describe your app more deeply for better results.";
        
        const { data, error } = await supabase.from('messages').insert([
          {
            conversation_id: conversation.id,
            sender_type: 'bot',
            content: needMoreMsg,
          },
        ]).select();
        
        if (error) {
          console.error('Failed to insert feedback message:', error);
        } else if (data && data[0]) {
          await broadcastMessage(data[0]);
        }
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

      const { data, error: msgError } = await supabase.from('messages').insert([
        {
          conversation_id: conversation.id,
          sender_type: 'bot',
          content: "Great! Your app is now being built. Our admin will start working on it and keep you updated!",
        },
      ]).select();
      
      if (!msgError && data && data[0]) await broadcastMessage(data[0]);
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
                <span className="text-neon-purple font-medium">Build Progress</span>
                <span className="text-white">{conversation.build_percentage}%</span>
              </div>
              <Progress value={conversation.build_percentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                Your app is being built. The admin will keep you updated!
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
                className="h-[60px] w-[60px] bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-cyan/80 hover:to-neon-blue/80 text-white"
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
