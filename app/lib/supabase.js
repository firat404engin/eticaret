import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase client'ı oluştur
export const supabase = createClient(supabaseUrl, supabaseKey); 