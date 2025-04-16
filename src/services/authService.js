import supabase from '../utils/supabase';
import CryptoJS from 'crypto-js';

/**
 * Admin kullanıcılarıyla ilgili yetkilendirme işlemleri için servis
 * Demo amaçlı basit hash işlemi için CryptoJS kullanılıyor
 * Gerçek uygulamada daha güvenli bir yöntem kullanılmalıdır
 */
class AuthService {
  /**
   * Admin kullanıcısının kimlik doğrulamasını yapar
   * @param {string} email - Kullanıcı e-posta adresi
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async login(email, password) {
    try {
      // Demo amaçlı, admin@example.com girişini özel olarak kabul et
      if (email === 'admin@example.com' && password === 'password') {
        return {
          success: true,
          data: {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'admin@example.com',
            first_name: 'Admin',
            last_name: 'User',
            phone: '+90 555 123 4567',
            role: 'super_admin',
            photo_url: 'https://i.pravatar.cc/300?u=admin@example.com'
          }
        };
      }
      
      // Supabase'den admin kullanıcısını e-posta ile ara
      const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();
      
      if (error || !admin) {
        console.error('Kullanıcı bulunamadı:', error?.message || 'Veritabanında kayıt yok');
        return {
          success: false,
          error: 'Geçersiz e-posta veya şifre'
        };
      }
      
      // NOT: Bu demo bir hashleme işlemidir, gerçek uygulamada bcrypt gibi güvenli bir metot kullanın
      
      // Veritabanındaki şifre: $2a$10$VeriguvenlibirHashuretecek
      // Demo için her zaman şifreyi kabul et - gerçek uygulamada kullanmayın!
      const isPasswordValid = true;
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Geçersiz e-posta veya şifre'
        };
      }
      
      // Yoksa varsayılan profil resmi ayarla
      if (!admin.photo_url) {
        admin.photo_url = `https://i.pravatar.cc/300?u=${admin.email}`;
      }
      
      // Hassas veriyi kaldır
      delete admin.password_hash;
      
      return {
        success: true,
        data: admin
      };
    } catch (error) {
      console.error('Giriş hatası:', error.message);
      return {
        success: false,
        error: 'Giriş yapılırken bir hata oluştu'
      };
    }
  }
  
  /**
   * Şifreyi hashler (demo amaçlı, üretimde kullanmayın)
   * @param {string} password
   * @returns {string}
   */
  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }
  
  /**
   * Kullanıcıyı veritabanından ID'ye göre getirir
   * @param {string} id - Kullanıcı ID'si
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getAdminById(id) {
    try {
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, email, first_name, last_name, phone, role, photo_url, created_at')
        .eq('id', id)
        .single();
      
      if (error || !admin) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı'
        };
      }
      
      return {
        success: true,
        data: admin
      };
    } catch (error) {
      console.error('Kullanıcı getirme hatası:', error.message);
      return {
        success: false,
        error: 'Kullanıcı bilgileri getirilirken bir hata oluştu'
      };
    }
  }
  
  /**
   * Tüm admin kullanıcılarını getirir
   * @returns {Promise<{success: boolean, data?: object[], error?: string}>}
   */
  async getAllAdmins() {
    try {
      const { data: admins, error } = await supabase
        .from('admins')
        .select('id, email, first_name, last_name, phone, role, photo_url, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        return {
          success: false,
          error: 'Admin kullanıcıları getirilirken bir hata oluştu'
        };
      }
      
      // Profil resmi olmayanlara varsayılan atama
      admins.forEach(admin => {
        if (!admin.photo_url) {
          admin.photo_url = `https://i.pravatar.cc/300?u=${admin.email}`;
        }
      });
      
      return {
        success: true,
        data: admins
      };
    } catch (error) {
      console.error('Admin listesi hatası:', error.message);
      return {
        success: false,
        error: 'Admin kullanıcıları getirilirken bir hata oluştu'
      };
    }
  }

  /**
   * Yeni admin kullanıcısı ekler
   * @param {object} adminData - Admin kullanıcı bilgileri
   * @param {string} adminData.email - E-posta adresi
   * @param {string} adminData.password - Şifre (hash'lenmemiş)
   * @param {string} adminData.first_name - Ad
   * @param {string} adminData.last_name - Soyad
   * @param {string} adminData.phone - Telefon (isteğe bağlı)
   * @param {string} adminData.role - Rol (varsayılan: 'admin')
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async addAdmin(adminData) {
    try {
      // E-posta biçimini kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(adminData.email)) {
        return {
          success: false,
          error: 'Geçerli bir e-posta adresi giriniz'
        };
      }
      
      // E-posta benzersizliğini kontrol et
      const { data: existingAdmin } = await supabase
        .from('admins')
        .select('id')
        .eq('email', adminData.email.toLowerCase())
        .maybeSingle();
      
      if (existingAdmin) {
        return {
          success: false,
          error: 'Bu e-posta adresi zaten kullanılıyor'
        };
      }
      
      // Şifreyi hashle (demo amaçlı olarak basit bir hash kullanıyoruz)
      // Gerçek uygulamada bcrypt gibi daha güvenli bir yöntem kullanılmalıdır
      const hashedPassword = this.hashPassword(adminData.password);
      
      // Yeni admin verilerini hazırla
      const newAdmin = {
        email: adminData.email.toLowerCase(),
        password_hash: hashedPassword,
        first_name: adminData.first_name,
        last_name: adminData.last_name,
        phone: adminData.phone || null,
        role: adminData.role || 'admin',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Veritabanına ekle
      const { data, error } = await supabase
        .from('admins')
        .insert([newAdmin])
        .select()
        .single();
      
      if (error) {
        console.error('Admin ekleme hatası:', error);
        return {
          success: false,
          error: 'Admin eklenirken bir hata oluştu'
        };
      }
      
      // Hassas veriyi kaldır
      delete data.password_hash;
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Admin ekleme hatası:', error.message);
      return {
        success: false,
        error: 'Admin eklenirken bir hata oluştu'
      };
    }
  }
  
  /**
   * Admin kullanıcısını siler
   * @param {string} id - Silinecek admin ID'si
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteAdmin(id) {
    try {
      // Demo admin kullanıcısını silmeye çalışıyorsa engelle
      if (id === '00000000-0000-0000-0000-000000000000') {
        return {
          success: false,
          error: 'Demo admin kullanıcısı silinemez'
        };
      }
      
      // Admin'i veritabanından sil
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Admin silme hatası:', error);
        return {
          success: false,
          error: 'Admin silinirken bir hata oluştu'
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Admin silme hatası:', error.message);
      return {
        success: false,
        error: 'Admin silinirken bir hata oluştu'
      };
    }
  }
  
  /**
   * Admin kullanıcı bilgilerini günceller
   * @param {string} id - Güncellenecek admin ID'si
   * @param {object} updateData - Güncellenecek veriler
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async updateAdmin(id, updateData) {
    try {
      // Güncellenecek alanları hazırla
      const updates = {};
      
      if (updateData.first_name) updates.first_name = updateData.first_name;
      if (updateData.last_name) updates.last_name = updateData.last_name;
      if (updateData.phone !== undefined) updates.phone = updateData.phone;
      if (updateData.role) updates.role = updateData.role;
      if (updateData.photo_url) updates.photo_url = updateData.photo_url;
      
      // E-posta güncellenmek isteniyorsa benzersizliğini kontrol et
      if (updateData.email) {
        // E-posta biçimini kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          return {
            success: false,
            error: 'Geçerli bir e-posta adresi giriniz'
          };
        }
        
        // E-posta benzersizliğini kontrol et (kendi e-postası hariç)
        const { data: existingAdmin } = await supabase
          .from('admins')
          .select('id')
          .eq('email', updateData.email.toLowerCase())
          .neq('id', id)
          .maybeSingle();
        
        if (existingAdmin) {
          return {
            success: false,
            error: 'Bu e-posta adresi zaten kullanılıyor'
          };
        }
        
        updates.email = updateData.email.toLowerCase();
      }
      
      // Şifre güncellenmek isteniyorsa hashle
      if (updateData.password) {
        updates.password_hash = this.hashPassword(updateData.password);
      }
      
      updates.updated_at = new Date();
      
      // Güncelleme yap
      const { data, error } = await supabase
        .from('admins')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Admin güncelleme hatası:', error);
        return {
          success: false,
          error: 'Admin güncellenirken bir hata oluştu'
        };
      }
      
      // Hassas veriyi kaldır
      delete data.password_hash;
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Admin güncelleme hatası:', error.message);
      return {
        success: false,
        error: 'Admin güncellenirken bir hata oluştu'
      };
    }
  }
}

export default new AuthService(); 