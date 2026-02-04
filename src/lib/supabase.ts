import { createClient } from '@supabase/supabase-js';

// Substitui pelos teus dados do painel do Supabase (Settings > API)
const supabaseUrl = 'https://teu-projeto.supabase.co';
const supabaseAnonKey = 'tua-chave-anon-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
