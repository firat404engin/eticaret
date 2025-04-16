import { NextResponse } from 'next/server';
import supabase from '../../../../src/utils/supabase';

// Tüm mesajları getiren endpoint
export async function GET() {
  try {
    console.log('API: GET /api/admin/messages çağrıldı');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Tüm mesajları getir, en yeniler en üstte olacak şekilde
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Mesajlar alınırken hata:', error);
      return NextResponse.json(
        { error: `Mesajlar alınamadı: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log(`Toplam ${data?.length || 0} mesaj alındı`);
    return NextResponse.json({ messages: data }, { status: 200 });
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: `İstek işlenirken bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
}

// Mesajın okundu durumunu güncelleyen endpoint
export async function PUT(request) {
  try {
    console.log('API: PUT /api/admin/messages çağrıldı');
    
    // İstek verilerini kontrol et
    const body = await request.text();
    if (!body) {
      console.error('Boş istek gövdesi');
      return NextResponse.json(
        { error: 'Geçersiz istek: Boş gövde' },
        { status: 400 }
      );
    }
    
    // JSON parse hatalarını yakala
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      console.error('JSON parse hatası:', e, 'Alınan veri:', body);
      return NextResponse.json(
        { error: 'Geçersiz JSON formatı' },
        { status: 400 }
      );
    }
    
    const { id, is_read } = payload;
    
    if (!id) {
      console.error('ID bilgisi eksik');
      return NextResponse.json(
        { error: 'Mesaj ID\'si belirtilmedi' },
        { status: 400 }
      );
    }
    
    console.log(`Mesaj güncelleniyor - ID: ${id}, Okundu: ${is_read}`);
    
    // Mesajın okundu durumunu güncelle
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: is_read })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Mesaj güncellenirken hata:', error);
      return NextResponse.json(
        { error: `Mesaj güncellenemedi: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log('Mesaj başarıyla güncellendi');
    return NextResponse.json(
      { success: true, message: 'Mesaj güncellendi', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: `İstek işlenirken bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
}
