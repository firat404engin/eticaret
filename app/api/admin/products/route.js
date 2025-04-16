import { NextResponse } from 'next/server';
import supabase from '../../../../src/utils/supabase';

// Tüm ürünleri getir
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Kategori filtresi
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    // Arama filtresi
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Ürünler alınırken hata:', error);
      return NextResponse.json(
        { error: `Ürünler alınamadı: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ products: data }, { status: 200 });
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: `İstek işlenirken bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
}

// Yeni ürün ekle
export async function POST(request) {
  try {
    const productData = await request.json();
    
    // Gerekli alanları kontrol et
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: 'Ürün adı ve fiyat zorunludur.' },
        { status: 400 }
      );
    }
    
    // Tarih alanlarını ekle
    const now = new Date().toISOString();
    productData.created_at = now;
    productData.updated_at = now;
    
    // Default değerler
    if (productData.stock === undefined) productData.stock = 0;
    if (productData.sales === undefined) productData.sales = 0;
    if (productData.rating === undefined) productData.rating = 0;
    if (productData.reviewcount === undefined) productData.reviewcount = 0;
    if (productData.popular === undefined) productData.popular = false;
    
    // Ürünü ekle
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();
    
    if (error) {
      console.error('Ürün eklenirken hata:', error);
      return NextResponse.json(
        { error: `Ürün eklenemedi: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, product: data[0] },
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

// Ürün güncelle
export async function PUT(request) {
  try {
    const productData = await request.json();
    const { id } = productData;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Ürün ID\'si belirtilmedi' },
        { status: 400 }
      );
    }
    
    // ID'yi güncelleme verisinden çıkart
    const { id: removedId, ...updateData } = productData;
    
    // Güncellenme zamanını ekle
    updateData.updated_at = new Date().toISOString();
    
    // Ürünü güncelle
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Ürün güncellenirken hata:', error);
      return NextResponse.json(
        { error: `Ürün güncellenemedi: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, product: data[0] },
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

// Ürün sil
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Ürün ID\'si belirtilmedi' },
        { status: 400 }
      );
    }
    
    // Ürünü sil
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Ürün silinirken hata:', error);
      return NextResponse.json(
        { error: `Ürün silinemedi: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Ürün başarıyla silindi' },
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
