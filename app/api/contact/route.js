import { NextResponse } from 'next/server';
import supabase from '../../../src/utils/supabase';

export async function POST(request) {
  try {
    const contactData = await request.json();
    console.log('Alınan form verileri:', contactData);
    
    // İletişim formu verilerini doğrula
    if (!contactData.firstName || !contactData.email || !contactData.message) {
      console.log('Doğrulama hatası: Eksik alanlar', {
        firstName: !!contactData.firstName,
        email: !!contactData.email,
        message: !!contactData.message
      });
      
      return NextResponse.json(
        { error: 'Ad, e-posta ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }
    
    // Ad ve soyad birleştirme
    const fullName = contactData.lastName 
      ? `${contactData.firstName} ${contactData.lastName}`
      : contactData.firstName;
    
    console.log('Supabase\'e kaydedilecek:', {
      name: fullName,
      email: contactData.email,
      phone: contactData.phone || null,
      message: contactData.message,
      is_read: false
    });
    
    // Verileri Supabase'e ekle
    console.log('Supabase tablo adı kontrol ediliyor...');
    
    // Tabloların listesini alıp tablo varlığını kontrol et
    const { data: tableList, error: tableError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('Tablo erişim hatası:', tableError);
      return NextResponse.json(
        { error: `Veritabanı erişiminde hata: ${tableError.message}` },
        { status: 500 }
      );
    }
    
    console.log('Tablo erişimi başarılı, ekleme yapılıyor...');
    
    // Verileri ekle
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: fullName,
          email: contactData.email,
          phone: contactData.phone || null,
          message: contactData.message,
          is_read: false
        }
      ])
      .select();
    
    if (error) {
      console.error('Supabase hatası:', error);
      return NextResponse.json(
        { error: `Mesajınız kaydedilirken hata oluştu: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log('İletişim mesajı başarıyla kaydedildi');
    return NextResponse.json(
      { success: true, message: 'Mesajınız başarıyla gönderildi' },
      { status: 201 }
    );
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: `İstek işlenirken bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
} 