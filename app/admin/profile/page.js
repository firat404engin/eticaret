'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaUserCog, FaCamera, FaUpload, FaEdit, FaSave, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../../app/components/common/LoadingSpinner';
import AuthService from '../../../src/services/authService';
import supabase from '../../../src/utils/supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    photo_url: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminData = localStorage.getItem('admin');
        if (!adminData) {
          router.push('/admin/login');
          return;
        }

        const admin = JSON.parse(adminData);
        const { success, data, error } = await AuthService.getAdminById(admin.id);
        
        if (!success) {
          console.error(error);
          localStorage.removeItem('admin');
          router.push('/admin/login');
          return;
        }

        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          photo_url: data.photo_url || ''
        });
      } catch (error) {
        console.error('Profil yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('admins')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Yerel depolamadaki admin bilgilerini güncelle
      const adminData = JSON.parse(localStorage.getItem('admin'));
      const updatedAdmin = {
        ...adminData,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      setSuccess('Profil bilgileriniz başarıyla güncellendi.');
      setProfile(prev => ({ ...prev, ...formData }));
    } catch (error) {
      console.error('Güncelleme hatası:', error.message);
      setError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Dosya boyutu 2MB\'dan küçük olmalıdır.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowedTypes.includes(fileExt.toLowerCase())) {
      setError('Yalnızca JPG, PNG ve WEBP dosya formatları desteklenmektedir.');
      return;
    }

    setPhotoLoading(true);
    setError('');
    setSuccess('');

    try {
      // Eski fotoğrafı sil (eğer varsa)
      if (profile.photo_url) {
        const oldPhotoPath = profile.photo_url.split('/').pop();
        if (oldPhotoPath) {
          await supabase.storage
            .from('profile-images')
            .remove([oldPhotoPath]);
        }
      }
      
      // Dosya adını oluştur: admin_id-timestamp.uzantı
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      
      // Dosyayı yükle
      const { error: uploadError, data } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${fileName}`;
      
      const { error: updateError } = await supabase
        .from('admins')
        .update({ photo_url: photoUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Yerel depolamadaki admin bilgilerini güncelle
      const adminData = JSON.parse(localStorage.getItem('admin'));
      const updatedAdmin = { ...adminData, photo_url: photoUrl };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      setFormData(prev => ({ ...prev, photo_url: photoUrl }));
      setProfile(prev => ({ ...prev, photo_url: photoUrl }));
      setSuccess('Profil fotoğrafınız başarıyla güncellendi.');
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error.message);
      setError('Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setPhotoLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Admin Profili</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profil Fotoğrafı */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-600">
                    <img 
                      src={profile?.photo_url || 'https://via.placeholder.com/200?text=No+Image'} 
                      alt="Profil Fotoğrafı" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label htmlFor="photoUpload" className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                    {photoLoading ? <LoadingSpinner size="sm" /> : <FaCamera />}
                  </label>
                  <input 
                    type="file" 
                    id="photoUpload" 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={photoLoading}
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{profile?.role === 'super_admin' ? 'Süper Admin' : 'Admin'}</span>
              </div>

              {/* Profil Formu */}
              <div className="flex-1">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FaUser className="inline mr-2" /> Ad
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-gray-200">{profile?.first_name || "-"}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FaUser className="inline mr-2" /> Soyad
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-gray-200">{profile?.last_name || "-"}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FaEnvelope className="inline mr-2" /> E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                      />
                      <small className="text-gray-500 dark:text-gray-400">E-posta adresi değiştirilemez</small>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FaPhone className="inline mr-2" /> Telefon
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-gray-200">{profile?.phone || "-"}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {isEditing ? (
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                      >
                        {updating ? <LoadingSpinner size="sm" /> : 'Profili Güncelle'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        <FaEdit className="mr-2" /> Düzenle
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 