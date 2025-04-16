# Örnek Ticaret

Bu proje, Next.js, TailwindCSS ve Supabase kullanılarak geliştirilen bir e-ticaret web sitesi örneğidir.

## Özellikler

- Responsive tasarım
- Ürün listeleme ve detay sayfaları
- Alışveriş sepeti
- Admin paneli (ürün ve sipariş yönetimi)
- İletişim formu

## Başlangıç

### Gereksinimler

- Node.js 14.0 veya üzeri
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullanici/ornekticaret.git
cd ornekticaret
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. `.env.local.example` dosyasını `.env.local` olarak kopyalayın ve Supabase bilgilerinizi ekleyin.

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
ornekticaret/
├── app/                 # Next.js App Router sayfaları
├── public/              # Statik dosyalar
├── src/
│   ├── components/      # Bileşenler
│   │   ├── Hero/        # Ana sayfa hero bileşeni
│   │   ├── About/       # Hakkımızda bileşeni
│   │   ├── Products/    # Ürünler bileşeni
│   │   ├── ...
│   └── utils/           # Yardımcı fonksiyonlar
│       └── supabase.js  # Supabase bağlantısı
├── .env.local.example   # Çevre değişkenleri örneği
└── ...
```

## Supabase Veritabanı Yapısı

### Tablolar

1. **users** - Kullanıcı bilgileri
   - id
   - email
   - password (hash)
   - created_at

2. **products** - Ürün bilgileri
   - id
   - name
   - description
   - price
   - stock
   - image_url
   - video_url
   - created_at

3. **orders** - Sipariş bilgileri
   - id
   - customer_name
   - email
   - phone
   - items (JSON)
   - total
   - status
   - created_at

4. **contacts** - İletişim formundan gelen mesajlar
   - id
   - name
   - email
   - message
   - created_at

## Lisans

[MIT](https://choosealicense.com/licenses/mit/) 