import { createClient } from '@supabase/supabase-js';

// O Vite exige o prefixo VITE_ para expor estas variáveis ao navegador
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log de depuração (aparecerá no F12 se a chave estiver vazia)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Configuração do Supabase incompleta. Verifica os Secrets no GitHub.");
}

export const supabase = createClient(
  supabaseUrl || "", 
  supabaseAnonKey || ""
);
