import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { Users, Package, RefreshCw, Heart, Eye } from 'lucide-react';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUserActivity = (activity) => {
      const newActivity = {
        id: Date.now(),
        type: 'user-activity',
        user: activity.userName,
        action: activity.activity,
        timestamp: new Date(),
        icon: getActivityIcon(activity.activity)
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10 activities
    };

    const handleItemAdded = (item) => {
      const newActivity = {
        id: Date.now(),
        type: 'item-added',
        user: `${item.owner?.firstName} ${item.owner?.lastName}`,
        action: `added "${item.title}"`,
        timestamp: new Date(),
        icon: Package
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    const handleSwapRequest = (swapData) => {
      const newActivity = {
        id: Date.now(),
        type: 'swap-request',
        user: swapData.fromUserName,
        action: `requested swap for "${swapData.itemTitle}"`,
        timestamp: new Date(),
        icon: RefreshCw
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    const handleSwapCompleted = (swapData) => {
      const newActivity = {
        id: Date.now(),
        type: 'swap-completed',
        user: 'Community',
        action: `completed swap for "${swapData.swappedWithTitle}"`,
        timestamp: new Date(),
        icon: Heart
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    socket.on('user-activity', handleUserActivity);
    socket.on('item-added', handleItemAdded);
    socket.on('swap-request', handleSwapRequest);
    socket.on('swap-completed', handleSwapCompleted);

    return () => {
      socket.off('user-activity', handleUserActivity);
      socket.off('item-added', handleItemAdded);
      socket.off('swap-request', handleSwapRequest);
      socket.off('swap-completed', handleSwapCompleted);
    };
  }, [socket]);

  const getActivityIcon = (activity) => {
    if (activity.includes('browsing')) return Eye;
    if (activity.includes('added')) return Package;
    if (activity.includes('swapped')) return RefreshCw;
    if (activity.includes('liked')) return Heart;
    return Users;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user-activity':
        return 'bg-navy-50 border-navy-200';
      case 'item-added':
        return 'bg-accent-50 border-accent-200';
      case 'swap-request':
        return 'bg-yellow-50 border-yellow-200';
      case 'swap-completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-navy-50 border-navy-200';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-earth-900">Live Activity</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-earth-600">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <activity.icon className="w-4 h-4 text-earth-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-earth-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-xs text-earth-500 mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-earth-400 mx-auto mb-2" />
            <p className="text-sm text-earth-600">No activity yet</p>
            <p className="text-xs text-earth-500">Community activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed; 