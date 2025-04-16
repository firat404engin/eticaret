import { NextResponse } from 'next/server';
import supabase from '../../../../src/utils/supabase';

// Tüm mesajları getiren endpoint
export async function GET() {
  try {
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
    const { id, is_read } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Mesaj ID\'si belirtilmedi' },
        { status: 400 }
      );
    }
    
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
