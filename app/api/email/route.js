import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// SendGrid API anahtarını ayarla
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Tarih formatını Türkçe olarak ayarla
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export async function POST(request) {
  try {
    console.log("E-posta API çağrısı alındı");
    const { email, name, productName, orderData } = await request.json();
    
    // E-posta geçerliliğini kontrol et
    if (!email || !email.includes('@')) {
      console.error("Geçersiz e-posta adresi:", email);
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girilmelidir.' },
        { status: 400 }
      );
    }

    // SendGrid API anahtarını kontrol et
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SendGrid API anahtarı tanımlanmamış");
      return NextResponse.json(
        { error: 'E-posta servisi yapılandırılmamış. Lütfen SENDGRID_API_KEY çevre değişkenini ayarlayın.' },
        { status: 500 }
      );
    }

    // Sipariş numarası oluştur
    const orderNumber = `SP-${Date.now().toString().slice(-6)}`;
    const orderDate = formatDate(new Date());
    
    // Ürünlerin HTML tablosu
    let productsHTML = '';
    let totalAmount = 0;
    
    if (orderData && orderData.items) {
      productsHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Ürün</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">Miktar</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Birim Fiyat</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Toplam</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      orderData.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        productsHTML += `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${item.price.toLocaleString('tr-TR')} TL</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${itemTotal.toLocaleString('tr-TR')} TL</td>
          </tr>
        `;
      });
      
      productsHTML += `
          </tbody>
          <tfoot>
            <tr style="background-color: #f8fafc;">
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Ara Toplam:</td>
              <td style="padding: 10px; text-align: right;">${totalAmount.toLocaleString('tr-TR')} TL</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Kargo:</td>
              <td style="padding: 10px; text-align: right; color: #10b981;">Ücretsiz</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Toplam:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">${totalAmount.toLocaleString('tr-TR')} TL</td>
            </tr>
          </tfoot>
        </table>
      `;
    } else {
      // Basit ürün gösterimi (orderData olmadığında)
      productsHTML = `<p style="color: #4a5568; font-size: 16px;">Sipariş ettiğiniz ürün: ${productName}</p>`;
      totalAmount = orderData?.total || 0;
    }
    
    // E-posta HTML içeriği
    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6; margin-bottom: 0;">Siparişiniz Alındı</h1>
          <p style="color: #64748b; font-size: 14px;">Sipariş No: ${orderNumber} | Tarih: ${orderDate}</p>
        </div>
        
        <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Merhaba ${name},</h2>
          <p style="color: #4a5568; font-size: 16px;">Siparişiniz başarıyla alındı. Siparişinizle ilgili detaylar aşağıdadır:</p>
          
          ${productsHTML}
          
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <p style="color: #1e40af; font-size: 15px; margin: 0;">
              <strong>Not:</strong> Siparişiniz en kısa sürede hazırlanıp gönderilecektir. Siparişiniz kargoya verildiğinde size bilgilendirme yapılacaktır.
            </p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #4a5568; margin-top: 0;">Teslimat Bilgileri</h3>
          <p style="color: #4a5568; font-size: 15px; margin-bottom: 5px;">
            <strong>Ad Soyad:</strong> ${orderData?.customer_name || name}
          </p>
          <p style="color: #4a5568; font-size: 15px; margin-bottom: 5px;">
            <strong>Adres:</strong> ${orderData?.address || "Hesabınızda kayıtlı adrese gönderilecektir."}
          </p>
          <p style="color: #4a5568; font-size: 15px; margin-bottom: 0;">
            <strong>Telefon:</strong> ${orderData?.phone || "Belirtilmedi"}
          </p>
        </div>
        
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="color: #4a5568; font-size: 15px;">Herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin.</p>
          <p style="color: #4a5568; font-size: 15px; margin-bottom: 5px;">Email: info@aicodessolutions.com</p>
          <p style="color: #4a5568; font-size: 15px; margin-bottom: 20px;">Tel: +90 555 123 4567</p>
          
          <p style="color: #718096; font-size: 14px; font-weight: bold;">Fırat Engin</p>
          <p style="color: #718096; font-size: 14px;">AI Codes Solutions</p>
        </div>
      </div>
    `;
    
    // E-posta yapılandırması
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@aicodessolutions.com',
        name: 'AI Codes Solutions'
      },
      replyTo: 'firatengin73@gmail.com', // Müşteri cevapları bu adrese gider
      subject: 'Siparişiniz Alındı - Sipariş #' + orderNumber,
      html: htmlContent,
    };
    
    console.log("E-posta göndermeye hazırlanıyor...");
    
    // E-posta gönderimi
    try {
      await sgMail.send(msg);
      console.log("E-posta başarıyla gönderildi");
      
      return NextResponse.json({
        success: true,
        message: 'E-posta başarıyla gönderildi',
        orderNumber: orderNumber
      });
    } catch (sendError) {
      console.error("SendGrid e-posta gönderme hatası:", sendError);
      
      // Hata detaylarını almak için
      let errorDetails = sendError.toString();
      if (sendError.response && sendError.response.body) {
        errorDetails = JSON.stringify(sendError.response.body);
      }
      
      return NextResponse.json(
        { 
          error: `E-posta gönderme hatası: ${sendError.message}`,
          details: errorDetails
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Genel hata:', error);
    return NextResponse.json(
      { error: `E-posta gönderilirken bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
} 