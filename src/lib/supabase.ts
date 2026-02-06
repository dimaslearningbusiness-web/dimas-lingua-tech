import { createClient } from '@supabase/supabase-js';

// CONFIRMA SE ESTES VALORES SÃO OS DO PROJETO NOVO
const supabaseUrl = 'https://tockiucmhkoxvauytzfq.supabase.co';
const supabaseAnonKey = 'sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD';

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
