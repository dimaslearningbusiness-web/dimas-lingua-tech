import { createClient } from '@supabase/supabase-js';

// Tenta ler das variáveis de ambiente do GitHub Actions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as chaves faltarem, este log vai aparecer na consola do navegador (F12)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis de ambiente do Supabase não encontradas. Verifica os Secrets no GitHub.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
