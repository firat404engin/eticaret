"use client";
import { useEffect, useState } from "react";
import supabase from "../../../src/utils/supabase";

const STATUS_OPTIONS = [
  "Beklemede",
  "Hazırlanıyor",
  "Kargoda",
  "Teslim Edildi"
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("date", { ascending: false });
    if (error) setError(error.message);
    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    setUpdatingId(id);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    setUpdatingId(null);
    if (error) {
      alert("Durum güncellenemedi: " + error.message);
    } else {
      setOrders(orders =>
        orders.map(o => (o.id === id ? { ...o, status: newStatus } : o))
      );
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Siparişler</h1>
      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "red" }}>Hata: {error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
        <thead>
          <tr>
            <th>Müşteri</th>
            <th>Telefon</th>
            <th>E-posta</th>
            <th>Adres</th>
            <th>Ürünler</th>
            <th>Not</th>
            <th>Tarih</th>
            <th>Toplam</th>
            <th>Durum</th>
            <th>Güncelle</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{order.customer_name}</td>
              <td>{order.phone}</td>
              <td>{order.email}</td>
              <td>{order.address}</td>
              <td>{
                typeof order.items === 'string'
                  ? order.items
                  : Array.isArray(order.items)
                    ? order.items.map(i => `${i.product_name}, ${i.quantity}`).join(' | ')
                    : ''
              }</td>
              <td>{order.note}</td>
              <td>{new Date(order.date).toLocaleString()}</td>
              <td>{order.total} ₺</td>
              <td>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  disabled={updatingId === order.id}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              <td>
                {updatingId === order.id && <span>Kaydediliyor...</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && !loading && <p>Hiç sipariş yok.</p>}
    </div>
  );
}
