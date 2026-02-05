import { createClient } from '@supabase/supabase-js';

// ESTA É A FORMA CORRETA:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis existem para evitar erros silenciosos
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: As chaves do Supabase não foram encontradas! Verifica os Secrets do GitHub.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
