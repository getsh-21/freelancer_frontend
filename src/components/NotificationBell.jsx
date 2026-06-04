import React, { useState, useEffect } from 'react';
import { getNotificationsApi, markAllAsReadApi } from '../api/notificationApi';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotificationsApi();
      setNotifications(data);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const handleMarkAll = async () => {
    await markAllAsReadApi();
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-1">
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800">Notifications</h4>
            <button onClick={handleMarkAll} className="text-sky-500 text-xs hover:underline">Mark all read</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0
              ? <p className="text-center text-gray-400 py-6 text-sm">No notifications</p>
              : notifications.map(n => (
                <div key={n._id} className={`px-4 py-3 border-b text-sm ${!n.isRead ? 'bg-sky-50' : ''}`}>
                  <p className="text-gray-700">{n.message}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;