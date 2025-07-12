import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Camera, 
  MapPin, 
  Calendar, 
  Award, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Package, 
  Coins, 
  Star,
  Share2,
  Settings,
  Bell,
  Shield,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  Users,
  Activity,
  Zap,
  Target,
  Trophy,
  Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { socket, isConnected } = useSocket();
  const { data: userActivity } = useRealTimeData([], 'user-activity');
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    itemsListed: 0,
    itemsSwapped: 0,
    totalPoints: 0,
    memberSince: new Date(),
    profileViews: 0,
    swapSuccessRate: 0,
    favorites: 0,
    reviews: 0,
    streak: 0
  });

  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    preferences: user?.preferences || {
      categories: [],
      sizes: [],
      notifications: {
        email: true,
        push: true
      }
    }
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Demo achievements with real-time data
  const demoAchievements = [
    {
      id: 1,
      title: "First Swap",
      description: "Completed your first clothing swap",
      icon: "🔄",
      iconComponent: RefreshCw,
      earned: true,
      date: "2024-01-15",
      progress: 100,
      target: 1
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Listed 10 sustainable items",
      icon: "🌱",
      iconComponent: Award,
      earned: true,
      date: "2024-01-20",
      progress: 100,
      target: 10
    },
    {
      id: 3,
      title: "Community Builder",
      description: "Received 5 positive reviews",
      icon: "⭐",
      iconComponent: Star,
      earned: false,
      progress: 3,
      target: 5
    },
    {
      id: 4,
      title: "Points Master",
      description: "Earned 1000 points",
      icon: "💰",
      iconComponent: Coins,
      earned: false,
      progress: 450,
      target: 1000
    },
    {
      id: 5,
      title: "Streak Master",
      description: "Maintain 7-day login streak",
      icon: "🔥",
      iconComponent: Zap,
      earned: false,
      progress: 3,
      target: 7
    },
    {
      id: 6,
      title: "Top Trader",
      description: "Complete 20 successful swaps",
      icon: "🏆",
      iconComponent: Trophy,
      earned: false,
      progress: 8,
      target: 20
    }
  ];

  // Demo activity feed with real-time timestamps
  const demoActivity = [
    {
      id: 1,
      type: 'swap',
      message: 'Successfully swapped "Vintage Denim Jacket" with Sarah',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: '🔄',
      iconComponent: RefreshCw,
      points: 150
    },
    {
      id: 2,
      type: 'item',
      message: 'Listed new item "Organic Cotton Dress"',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      icon: '📦',
      iconComponent: Package,
      points: 50
    },
    {
      id: 3,
      type: 'points',
      message: 'Earned 150 points for completed swap',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: '💰',
      iconComponent: Coins,
      points: 150
    },
    {
      id: 4,
      type: 'review',
      message: 'Received 5-star review from Mike',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: '⭐',
      iconComponent: Star,
      points: 25
    }
  ];

  useEffect(() => {
    setAchievements(demoAchievements);
    setStats({
      itemsListed: 12,
      itemsSwapped: 8,
      totalPoints: 450,
      memberSince: new Date('2024-01-01'),
      profileViews: 24,
      swapSuccessRate: 85,
      favorites: 15,
      reviews: 12,
      streak: 5
    });
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('profile-view', (data) => {
      setStats(prev => ({
        ...prev,
        profileViews: prev.profileViews + 1
      }));
    });

    socket.on('achievement-earned', (data) => {
      setAchievements(prev => 
        prev.map(achievement => 
          achievement.id === data.achievementId 
            ? { ...achievement, earned: true, date: new Date().toISOString() }
            : achievement
        )
      );
      toast.success(`Achievement unlocked: ${data.title}!`);
    });

    socket.on('activity-update', (data) => {
      // Update activity feed in real-time
      toast.success('New activity on your profile!');
    });

    socket.on('stats-updated', (data) => {
      setStats(prev => ({
        ...prev,
        ...data
      }));
    });

    return () => {
      socket.off('profile-view');
      socket.off('achievement-earned');
      socket.off('activity-update');
      socket.off('stats-updated');
    };
  }, [socket]);

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Simulate file upload with progress
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const avatarUrl = URL.createObjectURL(file);
      await updateProfile({ avatar: avatarUrl });
      
      toast.success('Avatar updated successfully!');
      setShowAvatarMenu(false);
    } catch (error) {
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied to clipboard!');
  };

  const formatTimeAgo = (timestamp) => {
    const now = currentTime;
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div 
        className="card p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative inline-block mb-6">
          <motion.div
            className="w-32 h-32 bg-gradient-to-r from-navy-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-16 h-16 text-white" />
            )}
            
            {/* Upload overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.05 }}
            >
              {isUploading ? (
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-white" />
              )}
            </motion.div>
          </motion.div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-2 text-center">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-navy-600 mb-2 text-center">{user?.bio || 'No bio yet'}</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-navy-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{user?.location || 'Location not set'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Member since {stats.memberSince.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </motion.button>
          <motion.button
            onClick={handleShareProfile}
            className="btn-outline flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
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
              <p className="text-sm font-medium text-navy-600">Items Listed</p>
              <p className="text-2xl font-bold text-navy-900">{stats.itemsListed}</p>
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
              <RefreshCw className="w-6 h-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Items Swapped</p>
              <p className="text-2xl font-bold text-navy-900">{stats.itemsSwapped}</p>
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
              <p className="text-sm font-medium text-navy-600">Total Points</p>
              <p className="text-2xl font-bold text-navy-900">{stats.totalPoints}</p>
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
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Success Rate</p>
              <p className="text-2xl font-bold text-navy-900">{stats.swapSuccessRate}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="card-hover p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Profile Views</p>
              <p className="text-2xl font-bold text-navy-900">{stats.profileViews}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-hover p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Reviews</p>
              <p className="text-2xl font-bold text-navy-900">{stats.reviews}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-hover p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-600">Day Streak</p>
              <p className="text-2xl font-bold text-navy-900">{stats.streak}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-navy-900">Recent Activity</h3>
          <div className="flex items-center space-x-2 text-sm text-navy-500">
            <Clock className="w-4 h-4" />
            <span>Live Updates</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {demoActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="flex items-center space-x-4 p-4 bg-navy-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                {activity.iconComponent ? (
                  <activity.iconComponent className="w-5 h-5 text-navy-600" />
                ) : (
                  <span className="text-lg">{activity.icon}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-900">{activity.message}</p>
                <p className="text-xs text-navy-500">{formatTimeAgo(activity.timestamp)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-navy-400">+{activity.points} pts</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-navy-900">Achievements</h3>
        <div className="flex items-center space-x-2 text-sm text-navy-500">
          <Trophy className="w-4 h-4" />
          <span>{achievements.filter(a => a.earned).length}/{achievements.length} Unlocked</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`card-hover p-6 relative overflow-hidden ${
              achievement.earned ? 'border-green-200 bg-green-50' : 'border-navy-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Progress overlay for unearned achievements */}
            {!achievement.earned && (
              <div className="absolute top-0 left-0 w-full h-1 bg-navy-200">
                <div 
                  className="h-full bg-gradient-to-r from-navy-500 to-accent-500 transition-all duration-500"
                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                achievement.earned ? 'bg-green-100' : 'bg-navy-100'
              }`}>
                {achievement.iconComponent ? (
                  <achievement.iconComponent className={`w-6 h-6 ${
                    achievement.earned ? 'text-green-600' : 'text-navy-600'
                  }`} />
                ) : (
                  <span className="text-2xl">{achievement.icon}</span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-navy-900 mb-1">{achievement.title}</h4>
                <p className="text-sm text-navy-600 mb-2">{achievement.description}</p>
                {achievement.earned ? (
                  <p className="text-xs text-green-600">
                    Earned {new Date(achievement.date).toLocaleDateString()}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-navy-500">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-navy-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-navy-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {achievement.earned && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderEditForm = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-6">Edit Profile</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={editForm.firstName}
              onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
              className="input-field w-full"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={editForm.lastName}
              onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
              className="input-field w-full"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Bio
          </label>
          <textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
            rows={4}
            className="input-field w-full"
            placeholder="Tell us about yourself and your sustainable fashion journey..."
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={editForm.location}
            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
            className="input-field w-full"
            placeholder="City, Country"
          />
        </div>

        <div className="mt-8 flex space-x-4">
          <motion.button
            onClick={handleProfileUpdate}
            className="btn-primary flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Changes
          </motion.button>
          <motion.button
            onClick={() => setIsEditing(false)}
            className="btn-outline flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </motion.button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'edit', name: 'Edit Profile', icon: Edit3 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'achievements':
        return renderAchievements();
      case 'edit':
        return renderEditForm();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">My Profile</h1>
              <p className="text-navy-600">Manage your profile and track your sustainable fashion journey</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-navy-500">Current Time</p>
              <p className="text-lg font-semibold text-navy-900">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-navy-100 text-navy-700'
                    : 'text-navy-600 hover:text-navy-700 hover:bg-navy-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage; 