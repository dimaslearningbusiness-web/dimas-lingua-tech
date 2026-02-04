import { createClient } from '@supabase/supabase-js';

// Substitui pelos teus dados do painel do Supabase (Settings > API)
const supabaseUrl = 'https://teu-projeto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
