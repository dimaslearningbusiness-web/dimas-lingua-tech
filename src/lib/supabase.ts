import { createClient } from '@supabase/supabase-js';

// Estas linhas garantem que o site usa as chaves que puseste nos Secrets do GitHub
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

