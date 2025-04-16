import { NextResponse } from 'next/server';
import supabase from '../../../src/utils/supabase';

export async function GET() {
  try {
    // Tüm ürünleri al
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Ürünler alınırken hata oluştu:', error);
      return NextResponse.json(
        { error: 'Ürünler alınırken bir hata oluştu.' },
        { status: 500 }
      );
    }
    
    // Supabase'den veri gelemediyse örnek yazılım ürünleri döndür
    if (!data || data.length === 0) {
      const demoProducts = [
        {
          id: 1,
          name: "Web Site Tasarımı - Basic",
          description: "Kurumsal kimliğinizi yansıtan, modern ve responsive tasarıma sahip web sitesi çözümü. SEO dostu yapı, hızlı yükleme süresi ve mobil uyumlu tasarım.",
          price: 2500,
          stock: 999,
          image_url: "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg",
          video_url: "https://www.youtube.com/embed/qz0aGYrrlhU",
          features: ["Responsive Tasarım", "5 Sayfa İçerik", "İletişim Formu", "SEO Optimizasyonu", "1 Yıl Hosting"],
          category: "web",
          popular: true,
          screenshot_urls: [
            "https://images.pexels.com/photos/326502/pexels-photo-326502.jpeg",
            "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg",
            "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg"
          ]
        },
        {
          id: 2,
          name: "Web Site Tasarımı - Premium",
          description: "İşletmenizin tüm ihtiyaçlarını karşılayan premium web sitesi çözümü. Özel tasarım, gelişmiş fonksiyonlar, e-ticaret altyapısı ve çok dilli destek.",
          price: 6000,
          stock: 999,
          image_url: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
          video_url: "https://www.youtube.com/embed/3JluqTojuME",
          features: ["Özel Tasarım", "Sınırsız Sayfa", "E-Ticaret Altyapısı", "Çok Dilli Destek", "Admin Paneli", "2 Yıl Hosting", "SEO Paketi"],
          category: "web",
          popular: false,
          screenshot_urls: [
            "https://images.pexels.com/photos/265658/pexels-photo-265658.jpeg",
            "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg",
            "https://images.pexels.com/photos/34676/pexels-photo.jpg"
          ]
        },
        {
          id: 3,
          name: "E-Ticaret Çözümü",
          description: "Satışlarınızı internete taşıyan kapsamlı e-ticaret çözümü. Ödeme sistemleri entegrasyonu, stok yönetimi, sipariş takibi ve müşteri yönetimi.",
          price: 12000,
          stock: 999,
          image_url: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
          video_url: "https://www.youtube.com/embed/MxP-qpOM5gY",
          features: ["Stok Yönetimi", "Ödeme Sistemleri", "Mobil Uyumlu", "Ürün Varyasyonları", "Raporlama", "Müşteri Yönetimi", "API Entegrasyonu"],
          category: "web",
          popular: true,
          screenshot_urls: [
            "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
            "https://images.pexels.com/photos/38519/macbook-laptop-ipad-apple-38519.jpeg",
            "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg"
          ]
        },
        {
          id: 4,
          name: "C# Masaüstü Otomasyon",
          description: "İşletmenize özel geliştirilen masaüstü otomasyon yazılımı. Veritabanı yönetimi, raporlama, kullanıcı yetkilendirme ve özelleştirilebilir arayüz.",
          price: 8500,
          stock: 999,
          image_url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
          video_url: "https://www.youtube.com/embed/xQTktUjFU6k",
          features: ["Kullanıcı Yönetimi", "Veri Yedekleme", "Raporlama", "SQL Veritabanı", "Barkod Sistemi", "Teknik Destek"],
          category: "desktop",
          popular: true,
          screenshot_urls: [
            "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg",
            "https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg",
            "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg"
          ]
        },
        {
          id: 5,
          name: "İnsan Kaynakları Yazılımı",
          description: "Personel yönetimini kolaylaştıran kapsamlı insan kaynakları yazılımı. İzin takibi, performans değerlendirmesi, bordro yönetimi ve personel özlük bilgileri.",
          price: 7500,
          stock: 999,
          image_url: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
          video_url: "https://www.youtube.com/embed/JD9Qie08tUo",
          features: ["Personel Takibi", "İzin Yönetimi", "Performans Değerlendirmesi", "Bordro Sistemi", "Özlük Dosyaları", "Raporlama"],
          category: "desktop",
          popular: false,
          screenshot_urls: [
            "https://images.pexels.com/photos/1181615/pexels-photo-1181615.jpeg",
            "https://images.pexels.com/photos/3847622/pexels-photo-3847622.jpeg",
            "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
          ]
        },
        {
          id: 6,
          name: "Stok Takip Sistemi",
          description: "Stok ve envanter yönetimini optimize eden yazılım çözümü. Barkod entegrasyonu, minimum stok uyarısı, ürün kategorilendirme ve detaylı raporlama.",
          price: 5500,
          stock: 999,
          image_url: "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg",
          video_url: "https://www.youtube.com/embed/Urcr2tLQaOc",
          features: ["Barkod Sistemi", "Stok Uyarıları", "Detaylı Raporlama", "Kategori Yönetimi", "Tedarikçi Takibi", "Fatura Entegrasyonu"],
          category: "desktop",
          popular: false,
          screenshot_urls: [
            "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg",
            "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg",
            "https://images.pexels.com/photos/4483608/pexels-photo-4483608.jpeg"
          ]
        },
        {
          id: 7,
          name: "Mobil Uygulama Geliştirme",
          description: "Android ve iOS platformlarında çalışan özel mobil uygulama geliştirme hizmeti. Şık tasarım, hızlı performans ve sunucu entegrasyonu.",
          price: 15000,
          stock: 999,
          image_url: "https://images.pexels.com/photos/117729/pexels-photo-117729.jpeg",
          video_url: "https://www.youtube.com/embed/cxJRvQs8qls",
          features: ["iOS ve Android", "Kullanıcı Dostu Arayüz", "Push Notification", "API Entegrasyonu", "Analitik Raporlama", "Bakım ve Destek"],
          category: "mobile",
          popular: true,
          screenshot_urls: [
            "https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg",
            "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg",
            "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg"
          ]
        },
        {
          id: 8,
          name: "SEO ve Dijital Pazarlama",
          description: "Web sitenizin arama motorlarında üst sıralarda yer almasını sağlayan SEO ve dijital pazarlama hizmetleri. Google Ads, sosyal medya yönetimi ve içerik stratejisi.",
          price: 3500,
          stock: 999,
          image_url: "https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg",
          video_url: "https://www.youtube.com/embed/j1FX2XT0MKo",
          features: ["Anahtar Kelime Analizi", "Rakip Analizi", "Google Ads Yönetimi", "İçerik Stratejisi", "Sosyal Medya Yönetimi", "Aylık Raporlama"],
          category: "service",
          popular: false,
          screenshot_urls: [
            "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg",
            "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg",
            "https://images.pexels.com/photos/6440118/pexels-photo-6440118.jpeg"
          ]
        }
      ];
      
      return NextResponse.json({ products: demoProducts });
    }
    
    return NextResponse.json({ products: data });
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Yeni ürün verilerini al
    const productData = await request.json();
    
    // Ürünün gerekli alanlarını doğrula
    if (!productData.name || !productData.price || isNaN(Number(productData.price))) {
      return NextResponse.json(
        { error: 'Geçersiz ürün verileri. Ad ve geçerli bir fiyat gereklidir.' },
        { status: 400 }
      );
    }
    
    // Ürünü veritabanına ekle
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: productData.name,
          description: productData.description || '',
          price: Number(productData.price),
          stock: Number(productData.stock) || 0,
          image_url: productData.image_url || '',
          video_url: productData.video_url || '',
          features: productData.features || [],
          category: productData.category || 'web',
          popular: productData.popular || false,
          screenshot_urls: productData.screenshot_urls || []
        }
      ])
      .select();
    
    if (error) {
      console.error('Ürün kaydedilirken hata oluştu:', error);
      return NextResponse.json(
        { error: 'Ürün eklenirken bir hata oluştu.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Ürün başarıyla eklendi', product: data[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 