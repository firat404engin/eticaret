-- Admin Kullanıcıları Tablosu
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  photo_url TEXT,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Örnek Admin Kullanıcıları
INSERT INTO admins (email, password_hash, first_name, last_name, phone, role)
VALUES
  ('admin@example.com', '$2a$10$VeriguvenlibirHashuretecek', 'Admin', 'User', '+90 555 123 4567', 'super_admin'),
  ('moderator@example.com', '$2a$10$VeriguvenlibirHashuretecek', 'Moderatör', 'Kullanıcı', '+90 555 987 6543', 'admin');

-- Password hash'i doğru şekilde saklamak için güvenlik
-- NOT: Gerçek uygulamada password hashleme Supabase Auth veya backend tarafında yapılmalıdır.
-- Bu örnekte demo amaçlı olarak doğrudan veritabanına eklenmiştir.

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_timestamp
BEFORE UPDATE ON admins
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp_column(); 