import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  MessageSquare, 
  Coins, 
  User, 
  Settings, 
  Plus,
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  Heart,
  Share2
} from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import PointsPage from './PointsPage';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const [userStats, setUserStats] = useState({
    totalItems: 0,
    activeSwaps: 0,
    points: 0,
    completedSwaps: 0
  });
  
  const [loading, setLoading] = useState({
    items: false,
    requests: false,
    actions: false
  });
  
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { socket, isConnected } = useSocket();
  
  // Real-time data hooks
  const { data: realTimeUserItems, updateData: updateUserItems } = useRealTimeData([], 'user-items');
  const { data: realTimeSwapRequests, updateData: updateSwapRequests } = useRealTimeData([], 'swap-requests');
  const { data: realTimeIncomingRequests, updateData: updateIncomingRequests } = useRealTimeData([], 'incoming-requests');

  // Demo user stats (will be replaced with real data)
  const demoUserStats = {
    totalItems: 12,
    activeSwaps: 3,
    points: 450,
    completedSwaps: 8
  };

  // Demo user items (will be replaced with real data)
  const demoUserItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop",
      status: "Active",
      views: 24,
      requests: 3,
      points: 150
    },
    {
      id: 2,
      title: "Organic Cotton Dress",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop",
      status: "Pending",
      views: 12,
      requests: 1,
      points: 200
    },
    {
      id: 3,
      title: "Sustainable Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      status: "Swapped",
      views: 45,
      requests: 5,
      points: 120
    }
  ];

  // Use real-time user items if available, otherwise use demo items
  const userItems = realTimeUserItems.length > 0 ? realTimeUserItems : demoUserItems;

  // Demo swap requests
  const demoSwapRequests = [
    {
      id: 1,
      fromUser: "Sarah Johnson",
      item: "Handmade Wool Sweater",
      status: "Pending",
      date: "2 hours ago",
      message: "I love this sweater! Would you be interested in swapping for my vintage leather jacket?"
    },
    {
      id: 2,
      fromUser: "Mike Chen",
      item: "Vintage Denim Jacket",
      status: "Accepted",
      date: "1 day ago",
      message: "This jacket is exactly what I've been looking for!"
    }
  ];

  // Use real-time swap requests if available, otherwise use demo data
  const swapRequests = realTimeSwapRequests.length > 0 ? realTimeSwapRequests : demoSwapRequests;
  const incomingRequests = realTimeIncomingRequests.length > 0 ? realTimeIncomingRequests : [];

  // Update stats when user items change
  useEffect(() => {
    const activeItems = userItems.filter(item => item.status === 'Active').length;
    const swappedItems = userItems.filter(item => item.status === 'Swapped').length;
    
    setUserStats({
      totalItems: userItems.length,
      activeSwaps: activeItems,
      points: userItems.reduce((sum, item) => sum + (item.points || 0), 0),
      completedSwaps: swappedItems
    });
  }, [userItems]);

  // Load real data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading({ items: true, requests: true, actions: false });
      
      // Load user items
      const itemsResponse = await apiService.getRealTimeUserItems();
      if (itemsResponse.length > 0) {
        updateUserItems(itemsResponse);
      }
      
      // Load swap requests
      const requestsResponse = await apiService.getRealTimeSwapRequests();
      if (requestsResponse.length > 0) {
        updateSwapRequests(requestsResponse);
      }
      
      // Load incoming requests
      const incomingResponse = await apiService.getRealTimeIncomingRequests();
      if (incomingResponse.length > 0) {
        updateIncomingRequests(incomingResponse);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading({ items: false, requests: false, actions: false });
    }
  };

  // Handle swap request actions
  const handleSwapAction = async (action, itemId, userId) => {
    try {
      setActionLoading({ [`${action}-${itemId}-${userId}`]: true });
      
      if (action === 'accept') {
        await apiService.acceptSwapRequest(itemId, userId);
        setSuccessMessage('Swap request accepted successfully!');
      } else if (action === 'decline') {
        await apiService.declineSwapRequest(itemId, userId);
        setSuccessMessage('Swap request declined.');
      }
      
      // Refresh data
      await loadUserData();
      
    } catch (error) {
      console.error(`Error ${action}ing swap request:`, error);
      setError(`Failed to ${action} swap request. Please try again.`);
    } finally {
      setActionLoading({ [`${action}-${itemId}-${userId}`]: false });
    }
  };

  // Handle item actions
  const handleItemAction = async (action, itemId) => {
    try {
      setActionLoading({ [`${action}-${itemId}`]: true });
      
      if (action === 'delete') {
        await apiService.deleteItem(itemId);
        setSuccessMessage('Item deleted successfully!');
      } else if (action === 'edit') {
        // Navigate to edit page or open edit modal
        console.log('Edit item:', itemId);
      }
      
      // Refresh data
      await loadUserData();
      
    } catch (error) {
      console.error(`Error ${action}ing item:`, error);
      setError(`Failed to ${action} item. Please try again.`);
    } finally {
      setActionLoading({ [`${action}-${itemId}`]: false });
    }
  };

  // Clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('swap-request', (data) => {
      setNotifications(prev => prev + 1);
      // Refresh incoming requests
      loadUserData();
    });

    socket.on('swap-status-updated', (data) => {
      setNotifications(prev => prev + 1);
      // Refresh swap requests
      loadUserData();
    });

    socket.on('item-updated', (data) => {
      // Refresh user items
      loadUserData();
    });

    socket.on('item-deleted', (data) => {
      // Refresh user items
      loadUserData();
    });

    return () => {
      socket.off('swap-request');
      socket.off('swap-status-updated');
      socket.off('item-updated');
      socket.off('item-deleted');
    };
  }, [socket]);



  const navigation = [
    { name: 'Overview', icon: Home, id: 'overview' },
    { name: 'My Items', icon: Package, id: 'items' },
    { name: 'Swap Requests', icon: MessageSquare, id: 'requests' },
    { name: 'Points', icon: Coins, id: 'points' },
    { name: 'Profile', icon: User, id: 'profile' },
    { name: 'Settings', icon: Settings, id: 'settings' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="card-hover p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-navy-100 rounded-lg">
              <Package className="w-6 h-6 text-navy-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Total Items</p>
              <p className="text-2xl font-bold text-navy-900">{userStats.totalItems}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-hover p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-accent-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Active Swaps</p>
              <p className="text-2xl font-bold text-navy-900">{userStats.activeSwaps}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-hover p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Points Balance</p>
              <p className="text-2xl font-bold text-navy-900">{userStats.points}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-hover p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Completed Swaps</p>
              <p className="text-2xl font-bold text-navy-900">{userStats.completedSwaps}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy-900">Recent Activity</h3>
          <button 
            onClick={loadUserData}
            className="text-navy-600 hover:text-accent-600 transition-colors"
            disabled={loading.actions}
          >
            <RefreshCw className={`w-4 h-4 ${loading.actions ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <AnimatePresence>
          {loading.actions ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <RefreshCw className="w-6 h-6 text-navy-600 animate-spin" />
            </motion.div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.slice(0, 3).map((request, index) => (
                <motion.div 
                  key={`${request.itemId}-${request.requester._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-navy-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-navy-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-navy-900">
                        New swap request for "{request.itemTitle}"
                      </p>
                      <p className="text-xs text-navy-600">
                        From {request.requester.firstName} {request.requester.lastName}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('requests')}
                    className="text-navy-600 hover:text-accent-600 text-sm font-medium transition-colors"
                  >
                    View
                  </button>
                </motion.div>
              ))}
              
              {swapRequests.slice(0, 2).map((request, index) => (
                <motion.div 
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + incomingRequests.length) * 0.1 }}
                  className="flex items-center justify-between p-4 bg-accent-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-accent-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-navy-900">
                        Your request for "{request.item}" {request.status.toLowerCase()}
                      </p>
                      <p className="text-xs text-navy-600">{request.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-navy-900">My Items</h3>
        <div className="flex items-center space-x-3">
          <button 
            onClick={loadUserData}
            className="text-navy-600 hover:text-accent-600 transition-colors"
            disabled={loading.items}
          >
            <RefreshCw className={`w-4 h-4 ${loading.items ? 'animate-spin' : ''}`} />
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      <AnimatePresence>
        {loading.items ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <RefreshCw className="w-8 h-8 text-navy-600 animate-spin" />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="card-hover relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Active' ? 'bg-green-100 text-green-800' :
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-navy-100 text-navy-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  {/* Action buttons overlay */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleItemAction('edit', item.id)}
                        className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                        disabled={actionLoading[`edit-${item.id}`]}
                      >
                        <Edit className="w-3 h-3 text-navy-600" />
                      </button>
                      <button 
                        onClick={() => handleItemAction('delete', item.id)}
                        className="p-1 bg-white/90 rounded-full hover:bg-red-50 transition-colors"
                        disabled={actionLoading[`delete-${item.id}`]}
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-navy-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-navy-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-navy-500">{item.category}</span>
                    <span className="text-sm font-medium text-navy-600">{item.points} points</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-navy-500">
                    <span>Views: {item.views}</span>
                    <span>Requests: {item.requests}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-navy-900">Swap Requests</h3>
        <button 
          onClick={loadUserData}
          className="text-navy-600 hover:text-accent-600 transition-colors"
          disabled={loading.requests}
        >
          <RefreshCw className={`w-4 h-4 ${loading.requests ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incoming Requests */}
        <div className="card">
          <div className="p-6">
            <h4 className="text-md font-semibold text-navy-900 mb-4 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Incoming Requests ({incomingRequests.length})
            </h4>
            
            <AnimatePresence>
              {loading.requests ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <RefreshCw className="w-6 h-6 text-navy-600 animate-spin" />
                </motion.div>
              ) : incomingRequests.length > 0 ? (
                <div className="space-y-4">
                  {incomingRequests.map((request, index) => (
                    <motion.div 
                      key={`${request.itemId}-${request.requester._id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-navy-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={request.itemImage}
                          alt={request.itemTitle}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-navy-900">{request.itemTitle}</h5>
                          <p className="text-sm text-navy-600">
                            From {request.requester.firstName} {request.requester.lastName}
                          </p>
                          {request.message && (
                            <p className="text-xs text-navy-500 mt-1 italic">"{request.message}"</p>
                          )}
                          <p className="text-xs text-navy-400 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <button 
                          onClick={() => handleSwapAction('accept', request.itemId, request.requester._id)}
                          disabled={actionLoading[`accept-${request.itemId}-${request.requester._id}`]}
                          className="btn-primary py-1 px-3 text-sm flex items-center"
                        >
                          {actionLoading[`accept-${request.itemId}-${request.requester._id}`] ? (
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          Accept
                        </button>
                        <button 
                          onClick={() => handleSwapAction('decline', request.itemId, request.requester._id)}
                          disabled={actionLoading[`decline-${request.itemId}-${request.requester._id}`]}
                          className="btn-outline py-1 px-3 text-sm flex items-center"
                        >
                          {actionLoading[`decline-${request.itemId}-${request.requester._id}`] ? (
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <X className="w-3 h-3 mr-1" />
                          )}
                          Decline
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-navy-500"
                >
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-navy-300" />
                  <p>No incoming swap requests</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* My Requests */}
        <div className="card">
          <div className="p-6">
            <h4 className="text-md font-semibold text-navy-900 mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              My Requests ({swapRequests.length})
            </h4>
            
            <AnimatePresence>
              {loading.requests ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <RefreshCw className="w-6 h-6 text-navy-600 animate-spin" />
                </motion.div>
              ) : swapRequests.length > 0 ? (
                <div className="space-y-4">
                  {swapRequests.map((request, index) => (
                    <motion.div 
                      key={request.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-navy-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-navy-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-navy-900">{request.item}</h5>
                          <p className="text-sm text-navy-600">From {request.fromUser}</p>
                          {request.message && (
                            <p className="text-xs text-navy-500 mt-1 italic">"{request.message}"</p>
                          )}
                          <p className="text-xs text-navy-400 mt-1">{request.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'Pending' && <Clock className="w-3 h-3 inline mr-1" />}
                          {request.status}
                        </span>
                        
                        {request.status === 'Pending' && (
                          <button className="text-navy-600 hover:text-accent-600 text-sm font-medium transition-colors">
                            Cancel
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-navy-500"
                >
                  <Package className="w-12 h-12 mx-auto mb-3 text-navy-300" />
                  <p>No outgoing swap requests</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'items':
        return renderItems();
      case 'requests':
        return renderRequests();
      case 'points':
        return <PointsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg"
          >
            {successMessage}
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 glass-effect shadow-lg min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-navy-600 to-accent-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">ReWear</span>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-navy-100 text-navy-700'
                      : 'text-navy-600 hover:bg-navy-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 