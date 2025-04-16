import { createClient } from '@supabase/supabase-js';

// Supabase bilgilerinizi burada tanımlayın
// NOT: Gerçek bir uygulamada bu değerler .env.local dosyasında olmalıdır
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lldesfeuqsqwinofyzbk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZGVzZmV1cXNxd2lub2Z5emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODUwODIsImV4cCI6MjA1OTk2MTA4Mn0.bPSJWbUIOy-1PpJfGC7YG0_40sqoEzAjLh1XmwQd0gI';

// Supabase istemcisini oluşturun ve konsola yazdır
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase bağlantısı oluşturuldu, URL:', supabaseUrl);

export default supabase; 