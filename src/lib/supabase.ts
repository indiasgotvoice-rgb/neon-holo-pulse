import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  google_id: string;
  unique_user_id: number;
  is_admin: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  app_description: string;
  completion_percentage: number;
  build_percentage: number;
  status: 'describing' | 'building' | 'completed';
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'bot' | 'admin';
  content: string;
  file_url?: string;
  file_name?: string;
  is_read: boolean;
  created_at: string;
};
