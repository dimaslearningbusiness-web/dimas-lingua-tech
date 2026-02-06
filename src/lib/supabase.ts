import { createClient } from '@supabase/supabase-js';

// NOTA: Usa as tuas chaves reais aqui entre as aspas
const supabaseUrl = 'https://tockiucmhkoxvauytzfq.supabase.co';
const supabaseAnonKey = 'sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
