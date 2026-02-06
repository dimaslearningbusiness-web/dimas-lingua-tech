import { createClient } from '@supabase/supabase-js';

// NOTA: Se criaste um projeto novo, confirma se o URL começa por letras diferentes de "ptjn..."
const supabaseUrl = 'https://TEU_NOVO_ID.supabase.co'; 
const supabaseAnonKey = 'TUA_NOVA_ANON_KEY_AQUI';

if (supabaseAnonKey.includes('VITE_')) {
  console.error("ERRO: Estás a tentar usar o nome da variável em vez da chave real!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);;
