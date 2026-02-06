import { createClient } from '@supabase/supabase-js';

// SUBSTITUI PELOS VALORES QUE COPIASTE NO PASSO 1
const supabaseUrl = 'https://teu-id-novo.supabase.co';
const supabaseAnonKey = 'tua-chave-anon-public-aqui';

// Verificação de segurança para a consola
if (supabaseUrl.includes('placeholder')) {
  console.warn("⚠️ URL do Supabase ainda é o exemplo!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
