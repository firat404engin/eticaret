import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export default function NotificationWidget() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let mounted = true;
    // Siparişler
    const orderChannel = supabase.channel('orders-notify-widget')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        if (!mounted) return;
        setNotifications(prev => [
          { id: `order-${payload.new.id}`, message: 'Yeni sipariş oluşturuldu!', ts: Date.now() },
          ...prev,
        ]);
      })
      .subscribe();
    // Mesajlar
    const msgChannel = supabase.channel('messages-notify-widget')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, payload => {
        if (!mounted) return;
        setNotifications(prev => [
          { id: `msg-${payload.new.id}`, message: 'Yeni mesaj alındı!', ts: Date.now() },
          ...prev,
        ]);
      })
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(msgChannel);
    };
  }, []);

  // Otomatik olarak bildirimi 7sn sonra kaldır
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 7000);
    return () => clearTimeout(timer);
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {notifications.map(n => (
        <div
          key={n.id}
          className="w-80 p-4 rounded-lg shadow-lg flex items-start gap-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <span className="text-2xl mr-2">
            {n.id.startsWith('order') ? '🛒' : '💬'}
          </span>
          <span className="flex-1">{n.message}</span>
        </div>
      ))}
    </div>
  );
}
