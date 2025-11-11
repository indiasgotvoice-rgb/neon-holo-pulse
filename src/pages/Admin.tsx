import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Message, Conversation, User } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Send, Upload, LogOut, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type ConversationWithUser = Conversation & {
  user?: User;
};

const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationWithUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [buildPercentage, setBuildPercentage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!user.is_admin) {
      navigate('/chat');
      return;
    }

    loadConversations();
    subscribeToChanges();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id);
      setBuildPercentage(selectedConv.build_percentage);
    }
  }, [selectedConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const { data: convs, error: convsError } = await supabase
        .from('conversations')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (convsError) throw convsError;

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      const convsWithUsers = convs?.map((conv) => ({
        ...conv,
        user: users?.find((u) => u.id === conv.user_id),
      })) || [];

      setConversations(convsWithUsers);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('admin-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          loadConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (selectedConv && payload.new.conversation_id === selectedConv.id) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedConv) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      const { error } = await supabase.from('messages').insert([
        {
          conversation_id: selectedConv.id,
          sender_type: 'admin',
          content: messageText,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const updateBuildPercentage = async () => {
    if (!selectedConv || buildPercentage < 0 || buildPercentage > 100) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          build_percentage: buildPercentage,
          status: buildPercentage >= 100 ? 'completed' : 'building',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedConv.id);

      if (error) throw error;

      toast.success('Build percentage updated');

      if (buildPercentage >= 100) {
        await supabase.from('messages').insert([
          {
            conversation_id: selectedConv.id,
            sender_type: 'bot',
            content: "🎉 Your app is ready! The admin will send you the APK file shortly.",
          },
        ]);
      }
    } catch (error) {
      console.error('Error updating build percentage:', error);
      toast.error('Failed to update percentage');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConv) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${selectedConv.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('app-files')
        .getPublicUrl(filePath);

      const { error: msgError } = await supabase.from('messages').insert([
        {
          conversation_id: selectedConv.id,
          sender_type: 'admin',
          content: `📦 Your app is ready! Download the APK file below.`,
          file_url: publicUrl,
          file_name: file.name,
        },
      ]);

      if (msgError) throw msgError;

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const togglePin = async (convId: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_pinned: !currentPinned })
        .eq('id', convId);

      if (error) throw error;
      loadConversations();
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update pin');
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

  if (!user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      <div className="h-screen flex">
        <div className="w-80 bg-background/40 backdrop-blur-xl border-r border-neon-cyan/20 flex flex-col">
          <div className="px-6 py-4 border-b border-neon-cyan/20 flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-neon-cyan hover:bg-neon-cyan/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedConv?.id === conv.id
                      ? 'bg-neon-cyan/20 border border-neon-cyan/40'
                      : 'bg-background/60 border border-neon-blue/20 hover:border-neon-cyan/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          ID: {conv.user?.unique_user_id}
                        </span>
                        {conv.is_pinned && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.user?.email}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neon-cyan">
                            {conv.status === 'describing' ? 'Describing' : conv.status === 'building' ? 'Building' : 'Completed'}
                          </span>
                          <span className="text-xs text-white">
                            {conv.status === 'describing' ? conv.completion_percentage : conv.build_percentage}%
                          </span>
                        </div>
                        <Progress
                          value={conv.status === 'describing' ? conv.completion_percentage : conv.build_percentage}
                          className="h-1"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(conv.id, conv.is_pinned);
                      }}
                      className="shrink-0 h-8 w-8"
                    >
                      <MessageSquare className={`w-4 h-4 ${conv.is_pinned ? 'text-red-500' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              <div className="bg-background/40 backdrop-blur-xl border-b border-neon-cyan/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      User ID: {selectedConv.user?.unique_user_id}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConv.user?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={buildPercentage}
                      onChange={(e) => setBuildPercentage(Number(e.target.value))}
                      className="w-20 bg-background/60 border-neon-cyan/20 text-white"
                    />
                    <Button
                      onClick={updateBuildPercentage}
                      className="bg-neon-cyan hover:bg-neon-cyan/80 text-background"
                    >
                      Update %
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 px-6 py-6">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-300`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.sender_type === 'admin'
                            ? 'bg-neon-purple/20 border border-neon-purple/40 text-white'
                            : msg.sender_type === 'user'
                            ? 'bg-neon-cyan/20 border border-neon-cyan/40 text-white'
                            : 'bg-background/60 border border-neon-blue/20 text-white'
                        }`}
                      >
                        <div className="text-xs mb-1 font-semibold">
                          {msg.sender_type === 'admin' ? 'You' : msg.sender_type === 'user' ? 'User' : 'Bot'}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.file_url && (
                          <div className="mt-2 text-xs text-neon-cyan">
                            📎 {msg.file_name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="px-6 pb-6 space-y-4">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".apk,.zip,.pdf"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="outline"
                    className="border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Send a message to the user..."
                    className="resize-none bg-background/60 border-neon-cyan/20 focus:border-neon-cyan text-white placeholder:text-muted-foreground"
                    rows={3}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    className="h-auto bg-neon-cyan hover:bg-neon-cyan/80 text-background"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-neon-cyan/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-neon-cyan" />
                </div>
                <p className="text-muted-foreground">Select a conversation to start</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
