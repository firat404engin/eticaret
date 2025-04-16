import { createClient } from '@supabase/supabase-js';

// Supabase bilgilerinizi burada tanımlayın
// NOT: Gerçek bir uygulamada bu değerler .env.local dosyasında olmalıdır
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lldesfeuqsqwinofyzbk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZGVzZmV1cXNxd2lub2Z5emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODUwODIsImV4cCI6MjA1OTk2MTA4Mn0.bPSJWbUIOy-1PpJfGC7YG0_40sqoEzAjLh1XmwQd0gI';

// Supabase istemcisini oluşturun
// Her aramada yeni bir örnek oluşturmayı önlemek için client'i cache'leme
let supabaseInstance = null;

const getSupabase = () => {
  // Zaman damgası ekle - bağlantının her seferinde yenilenmesini sağlar
  const timestamp = new Date().getTime();
  
  // Client oluştur
  const client = createClient(
    `${supabaseUrl}?ts=${timestamp}`, 
    supabaseKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: true
      },
      global: {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Timestamp': timestamp.toString()
        }
      }
    }
  );
  
  console.log(`Supabase bağlantısı oluşturuldu: ${timestamp}, URL: ${supabaseUrl}`);
  return client;
};

// Eski bağlantı
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase bağlantısı oluşturuldu, URL:', supabaseUrl);

// Her API isteğinde temiz bağlantı oluşturmak için bu fonksiyonu export et
export const getFreshSupabase = () => getSupabase();

// Geriye uyumluluk için eski client'i da export et
export default supabase; 