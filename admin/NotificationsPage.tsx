import React, { useEffect, useState } from 'react';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';
import { Link } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = () => {
    fetchNotifications()
      .then(setItems)
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    await markNotificationRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAll = async () => {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setMessage('All notifications marked as read');
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Notifications</h1>
          <p className="text-xs text-gray-300 mt-1">Updates, reviews, and system events.</p>
        </div>
        <button onClick={markAll} className="text-xs px-3 py-1 rounded-full border border-white/20">
          Mark all read
        </button>
      </div>
      {message && <div className="text-xs text-green-300 mb-3">{message}</div>}
      {items.length === 0 ? (
        <div className="text-sm text-gray-400">No notifications yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold flex items-center gap-2">
                  {!item.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                  {item.title}
                </div>
                <div className="text-[10px] text-gray-400">{new Date(item.created_at).toLocaleString()}</div>
              </div>
              {item.body && <div className="text-xs text-gray-300 mt-2">{item.body}</div>}
              <div className="flex items-center gap-3 mt-3 text-xs">
                {item.href && (
                  <Link to={item.href} className="underline">
                    Open
                  </Link>
                )}
                {!item.is_read && (
                  <button onClick={() => markRead(item.id)} className="underline">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
