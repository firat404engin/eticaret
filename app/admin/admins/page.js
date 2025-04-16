"use client";

import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import authService from '../../../src/services/authService';
import { requireAuth } from '../../../src/contexts/AuthContext';
import AdminAddModal from '../../components/admin/AdminAddModal';
import AdminEditModal from '../../components/admin/AdminEditModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.getAllAdmins();
      
      if (result.success) {
        setAdmins(result.data || []);
      } else {
        setError(result.error || 'Admin kullanıcıları yüklenemedi');
      }
    } catch (error) {
      setError('Bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Admin ekleme
  const handleAddAdmin = async (formData) => {
    setIsSubmitting(true);
    
    try {
      const result = await authService.addAdmin(formData);
      
      if (result.success) {
        toast.success(`${formData.first_name} ${formData.last_name} başarıyla eklendi`);
        setAdmins(prevAdmins => [result.data, ...prevAdmins]);
        setIsAddModalOpen(false);
      } else {
        toast.error(result.error || 'Admin eklenirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin silme
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await authService.deleteAdmin(selectedAdmin.id);
      
      if (result.success) {
        toast.success(`${selectedAdmin.first_name} ${selectedAdmin.last_name} başarıyla silindi`);
        setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== selectedAdmin.id));
        setIsDeleteModalOpen(false);
        setSelectedAdmin(null);
      } else {
        toast.error(result.error || 'Admin silinirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin güncelleme
  const handleUpdateAdmin = async (id, updateData) => {
    setIsSubmitting(true);
    
    try {
      const result = await authService.updateAdmin(id, updateData);
      
      if (result.success) {
        toast.success(`${result.data.first_name} ${result.data.last_name} başarıyla güncellendi`);
        
        // Güncellenen admini listede güncelle
        setAdmins(prevAdmins => prevAdmins.map(admin => 
          admin.id === id ? result.data : admin
        ));
        
        setIsEditModalOpen(false);
        setSelectedAdmin(null);
      } else {
        toast.error(result.error || 'Admin güncellenirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Silme modal'ını aç
  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  // Düzenleme modal'ını aç
  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  };

  // Arama filtrelemesi
  const filteredAdmins = admins.filter(admin => {
    const fullName = `${admin.first_name} ${admin.last_name}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           admin.email.toLowerCase().includes(searchLower) ||
           (admin.phone && admin.phone.includes(searchLower));
  });

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Admin Ekleme Modal */}
      <AdminAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAdmin}
        isLoading={isSubmitting}
      />
      
      {/* Admin Düzenleme Modal */}
      <AdminEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateAdmin}
        isLoading={isSubmitting}
        admin={selectedAdmin}
      />
      
      {/* Admin Silme Onay Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAdmin}
        isLoading={isSubmitting}
        title="Admin Kullanıcısını Sil"
        message={selectedAdmin ? `${selectedAdmin.first_name} ${selectedAdmin.last_name} adlı admin kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.` : ''}
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Kullanıcıları</h1>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Admin Ekle
        </button>
      </div>
      
      {/* Arama ve Filtreleme */}
      <div className="bg-gray-700 p-4 rounded-xl shadow-sm mb-6 border border-gray-600">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ad, e-posta veya telefon ara..."
            className="pl-10 pr-3 py-2 w-full border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-300">Admin kullanıcıları yükleniyor...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mb-6 text-red-400" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Hata</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <>
          {filteredAdmins.length === 0 ? (
            <div className="bg-gray-700 p-8 text-center rounded-xl shadow-sm border border-gray-600">
              <p className="text-gray-300 text-lg">
                {admins.length === 0 
                  ? "Henüz admin kullanıcısı bulunmuyor." 
                  : "Arama kriterlerinize uygun admin bulunamadı."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdmins.map(admin => (
                <div key={admin.id} className="bg-gray-700 rounded-xl shadow hover:shadow-md transition-shadow border border-gray-600 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        {admin.photo_url ? (
                          <img 
                            src={admin.photo_url} 
                            alt={`${admin.first_name} ${admin.last_name}`}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl">
                            {admin.first_name.charAt(0)}{admin.last_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-white">{admin.first_name} {admin.last_name}</h3>
                        <div className="flex items-center mt-1 text-gray-300 text-sm">
                          <FaUserTag className="mr-1" />
                          <span>{admin.role === 'super_admin' ? 'Süper Admin' : 'Admin'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-gray-300">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        <span className="text-sm">{admin.email}</span>
                      </div>
                      
                      {admin.phone && (
                        <div className="flex items-center text-gray-300">
                          <FaPhone className="mr-2 text-gray-400" />
                          <span className="text-sm">{admin.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-300">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span className="text-sm">
                          {new Date(admin.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 p-4 bg-gray-800 flex justify-end space-x-2">
                    <button 
                      className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
                        admin.id === '00000000-0000-0000-0000-000000000000' 
                          ? 'text-gray-500 cursor-not-allowed' 
                          : 'text-indigo-400 hover:text-indigo-300'
                      }`}
                      onClick={() => admin.id !== '00000000-0000-0000-0000-000000000000' && openEditModal(admin)}
                      disabled={admin.id === '00000000-0000-0000-0000-000000000000'}
                      title={admin.id === '00000000-0000-0000-0000-000000000000' ? 'Demo kullanıcısı düzenlenemez' : 'Düzenle'}
                    >
                      <FaEdit />
                    </button>
                    
                    <button 
                      className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
                        admin.id === '00000000-0000-0000-0000-000000000000'
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-red-400 hover:text-red-300'
                      }`}
                      onClick={() => admin.id !== '00000000-0000-0000-0000-000000000000' && openDeleteModal(admin)}
                      disabled={admin.id === '00000000-0000-0000-0000-000000000000'}
                      title={admin.id === '00000000-0000-0000-0000-000000000000' ? 'Demo kullanıcısı silinemez' : 'Sil'}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default requireAuth(AdminUsersPage); 