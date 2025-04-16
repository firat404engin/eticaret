import { NextResponse } from 'next/server';
import supabase from '../../../../src/utils/supabase';

export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    // Ürün detayını al
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Ürün alınırken hata oluştu:', error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Ürün bulunamadı.' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Ürün alınırken bir hata oluştu.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ product: data });
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const productData = await request.json();
    
    // Ürünün gerekli alanlarını doğrula
    if (!productData.name || !productData.price || isNaN(Number(productData.price))) {
      return NextResponse.json(
        { error: 'Geçersiz ürün verileri. Ad ve geçerli bir fiyat gereklidir.' },
        { status: 400 }
      );
    }
    
    // Ürünü güncelle
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description || '',
        price: Number(productData.price),
        stock: Number(productData.stock) || 0,
        image_url: productData.image_url || '',
        video_url: productData.video_url || ''
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Ürün güncellenirken hata oluştu:', error);
      return NextResponse.json(
        { error: 'Ürün güncellenirken bir hata oluştu.' },
        { status: 500 }
      );
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Ürün başarıyla güncellendi', product: data[0] }
    );
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    // Ürünü sil
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Ürün silinirken hata oluştu:', error);
      return NextResponse.json(
        { error: 'Ürün silinirken bir hata oluştu.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Ürün başarıyla silindi' }
    );
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 