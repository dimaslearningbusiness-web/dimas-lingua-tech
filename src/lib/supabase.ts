import { createClient } from '@supabase/supabase-js';

// CONFIRMA SE ESTES VALORES SÃO OS DO PROJETO NOVO
const supabaseUrl = 'https://TEU_ID_NOVO.supabase.co';
const supabaseAnonKey = 'TUA_CHAVE_ANON_NOVA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'dimas-app-new-session', // Nome novo para não colidir com o antigo
    persistSession: true,
    detectSessionInUrl: false // Evita que o URL baralhe o login
  },
  global: {
    headers: { 'x-my-custom-header': 'dimas-learning' },
  },
});
