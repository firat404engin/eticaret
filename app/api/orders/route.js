import { NextResponse } from 'next/server';
import supabase from '../../../src/utils/supabase';

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    // Ürünleri ve siparişi doğrulama işlemleri burada yapılabilir
    
    // Sipariş verilerini Supabase'e ekle
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: orderData.customer_name,
          phone: orderData.phone,
          email: orderData.email,
          address: orderData.address,
          date: orderData.date,
          total: orderData.total,
          status: orderData.status || 'Beklemede',
          items: orderData.items,
          note: orderData.note
        }
      ])
      .select();
    
    if (error) {
      console.error('Sipariş kaydedilirken hata oluştu:', error);
      return NextResponse.json(
        { error: error.message || error.details || 'Sipariş işlenirken bir hata oluştu.', details: error },
        { status: 500 }
      );
    }
    
    // E-posta bildirimi gönderme işlemi burada yapılabilir
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Sipariş başarıyla oluşturuldu', 
        order: data[0] 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sipariş işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Sipariş listesini Supabase'den al
    // Not: Gerçek uygulamada bu sadece yöneticilere açık olmalıdır
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Siparişler alınırken hata oluştu:', error);
      return NextResponse.json(
        { error: 'Siparişler alınırken bir hata oluştu.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ orders: data });
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 