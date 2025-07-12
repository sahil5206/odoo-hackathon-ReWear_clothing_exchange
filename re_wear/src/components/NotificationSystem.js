import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for swap requests
    socket.on('swap-request', (data) => {
      addNotification({
        id: Date.now(),
        type: 'swap-request',
        title: 'New Swap Request',
        message: `${data.fromUserName} wants to swap for "${data.itemTitle}"`,
        data,
        duration: 8000
      });
    });

    // Listen for swap status updates
    socket.on('swap-status-updated', (data) => {
      const statusText = data.status === 'Accepted' ? 'accepted' : 'declined';
      addNotification({
        id: Date.now(),
        type: 'swap-status',
        title: 'Swap Request Update',
        message: `Your swap request for "${data.itemTitle}" was ${statusText}`,
        data,
        duration: 6000
      });
    });

    // Listen for swap completions
    socket.on('swap-completed', (data) => {
      addNotification({
        id: Date.now(),
        type: 'swap-completed',
        title: 'Swap Completed',
        message: `Your item was successfully swapped for "${data.swappedWithTitle}"`,
        data,
        duration: 10000
      });
    });

    // Listen for new items added
    socket.on('item-added', (item) => {
      addNotification({
        id: Date.now(),
        type: 'item-added',
        title: 'New Item Available',
        message: `"${item.title}" was just added to the community`,
        data: item,
        duration: 5000
      });
    });

    // Listen for item updates
    socket.on('item-updated', (item) => {
      addNotification({
        id: Date.now(),
        type: 'item-updated',
        title: 'Item Updated',
        message: `"${item.title}" was just updated`,
        data: item,
        duration: 5000
      });
    });

    // Listen for item deletions
    socket.on('item-deleted', (itemId) => {
      addNotification({
        id: Date.now(),
        type: 'item-deleted',
        title: 'Item Removed',
        message: 'An item was removed from the community',
        data: { itemId },
        duration: 5000
      });
    });

    // Listen for user activity
    socket.on('user-activity', (activity) => {
      addNotification({
        id: Date.now(),
        type: 'user-activity',
        title: 'Community Activity',
        message: `${activity.userName} ${activity.activity}`,
        data: activity,
        duration: 4000
      });
    });

    return () => {
      socket.off('swap-request');
      socket.off('swap-status-updated');
      socket.off('swap-completed');
      socket.off('item-added');
      socket.off('item-updated');
      socket.off('item-deleted');
      socket.off('user-activity');
    };
  }, [socket]);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'swap-request':
        return '🔄';
      case 'swap-status':
        return '✅';
      case 'swap-completed':
        return '🎉';
      case 'item-added':
        return '🆕';
      case 'item-updated':
        return '✏️';
      case 'item-deleted':
        return '🗑️';
      case 'user-activity':
        return '👤';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'swap-request':
        return 'bg-navy-500';
      case 'swap-status':
        return 'bg-accent-500';
      case 'swap-completed':
        return 'bg-green-500';
      case 'item-added':
        return 'bg-navy-600';
      case 'item-updated':
        return 'bg-accent-600';
      case 'item-deleted':
        return 'bg-red-500';
      case 'user-activity':
        return 'bg-navy-700';
      default:
        return 'bg-navy-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${getNotificationColor(notification.type)} text-white rounded-lg shadow-lg p-4 max-w-sm w-full pointer-events-auto`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{notification.message}</p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white opacity-70 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem; 