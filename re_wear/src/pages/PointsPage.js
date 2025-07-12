import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  Gift, 
  Target, 
  History, 
  Plus, 
  Minus, 
  Star,
  Award,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  Zap,
  Users,
  Package,
  MessageSquare,
  Heart,
  Share2,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  Trophy,
  Crown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const PointsPage = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [pointsData, setPointsData] = useState({
    currentBalance: 450,
    totalEarned: 1200,
    totalSpent: 750,
    monthlyEarned: 180,
    monthlyGoal: 300,
    level: 3,
    nextLevelPoints: 200,
    streak: 7
  });

  const [rewards, setRewards] = useState([
    {
      id: 1,
      title: "Premium Badge",
      description: "Exclusive badge for top contributors",
      pointsCost: 500,
      category: "Badge",
      available: true,
      image: "🏆"
    },
    {
      id: 2,
      title: "Priority Listing",
      description: "Your items appear first in search results",
      pointsCost: 200,
      category: "Feature",
      available: true,
      image: "⭐"
    },
    {
      id: 3,
      title: "Extended Swap Window",
      description: "Keep items listed for 30 days instead of 14",
      pointsCost: 150,
      category: "Feature",
      available: true,
      image: "⏰"
    },
    {
      id: 4,
      title: "Custom Profile Theme",
      description: "Unlock exclusive profile customization",
      pointsCost: 300,
      category: "Customization",
      available: false,
      image: "🎨"
    }
  ]);

  const [pointsHistory, setPointsHistory] = useState([
    {
      id: 1,
      type: 'earned',
      amount: 150,
      description: 'Completed swap: Vintage Denim Jacket',
      date: '2024-01-20T10:30:00Z',
      category: 'swap'
    },
    {
      id: 2,
      type: 'spent',
      amount: -200,
      description: 'Purchased: Priority Listing',
      date: '2024-01-19T15:45:00Z',
      category: 'reward'
    },
    {
      id: 3,
      type: 'earned',
      amount: 50,
      description: 'Listed new item: Organic Cotton Dress',
      date: '2024-01-18T09:15:00Z',
      category: 'listing'
    },
    {
      id: 4,
      type: 'earned',
      amount: 10,
      description: 'Daily login streak',
      date: '2024-01-17T08:00:00Z',
      category: 'daily'
    },
    {
      id: 5,
      type: 'earned',
      amount: 100,
      description: 'Completed swap: Sustainable Sneakers',
      date: '2024-01-16T14:20:00Z',
      category: 'swap'
    }
  ]);

  const [earningOpportunities, setEarningOpportunities] = useState([
    {
      id: 1,
      title: "List New Item",
      description: "Earn points for listing sustainable items",
      points: 50,
      type: "action",
      completed: false,
      icon: Package
    },
    {
      id: 2,
      title: "Complete Swap",
      description: "Earn points when you complete a swap",
      points: 100,
      type: "action",
      completed: false,
      icon: RefreshCw
    },
    {
      id: 3,
      title: "Daily Login",
      description: "Log in daily to maintain your streak",
      points: 10,
      type: "daily",
      completed: true,
      icon: Calendar
    },
    {
      id: 4,
      title: "Refer a Friend",
      description: "Invite friends to join ReWear",
      points: 200,
      type: "referral",
      completed: false,
      icon: Users
    },
    {
      id: 5,
      title: "Leave Review",
      description: "Help the community with your feedback",
      points: 25,
      type: "action",
      completed: false,
      icon: Star
    },
    {
      id: 6,
      title: "Share on Social",
      description: "Spread the word about sustainable fashion",
      points: 30,
      type: "social",
      completed: false,
      icon: Share2
    }
  ]);



  // Listen for real-time points updates
  useEffect(() => {
    if (!socket) return;

    socket.on('points-earned', (data) => {
      setPointsData(prev => ({
        ...prev,
        currentBalance: prev.currentBalance + data.amount,
        totalEarned: prev.totalEarned + data.amount,
        monthlyEarned: prev.monthlyEarned + data.amount
      }));
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        type: 'earned',
        amount: data.amount,
        description: data.description,
        date: new Date().toISOString(),
        category: data.category
      };
      
      setPointsHistory(prev => [newEntry, ...prev]);
      toast.success(`Earned ${data.amount} points!`);
    });

    socket.on('points-spent', (data) => {
      setPointsData(prev => ({
        ...prev,
        currentBalance: prev.currentBalance - data.amount,
        totalSpent: prev.totalSpent + data.amount
      }));
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        type: 'spent',
        amount: -data.amount,
        description: data.description,
        date: new Date().toISOString(),
        category: data.category
      };
      
      setPointsHistory(prev => [newEntry, ...prev]);
      toast.success(`Purchased: ${data.description}`);
    });

    socket.on('level-up', (data) => {
      setPointsData(prev => ({
        ...prev,
        level: data.newLevel,
        nextLevelPoints: data.nextLevelPoints
      }));
      toast.success(`🎉 Level up! You're now level ${data.newLevel}!`);
    });

    socket.on('action-completed', (data) => {
      // Update opportunity status if it's the same action
      setEarningOpportunities(prev => 
        prev.map(opp => 
          opp.id === data.actionId 
            ? { ...opp, completed: true }
            : opp
        )
      );
      
      // Show notification for action completed on other devices
      toast.success(`🎉 ${data.title} completed on another device!`, {
        duration: 3000
      });
    });

    return () => {
      socket.off('points-earned');
      socket.off('points-spent');
      socket.off('level-up');
      socket.off('action-completed');
    };
  }, [socket]);

  // Load initial data
  useEffect(() => {
    const loadPointsData = async () => {
      try {
        const [summaryResponse, opportunitiesResponse, rewardsResponse] = await Promise.all([
          apiService.getPointsSummary(),
          apiService.getEarningOpportunities(),
          apiService.getRewards()
        ]);

        setPointsData(summaryResponse.pointsSummary);
        setEarningOpportunities(opportunitiesResponse.opportunities);
        setRewards(rewardsResponse.rewards);
      } catch (error) {
        console.error('Failed to load points data:', error);
        // Fallback to demo data
        setPointsData({
          currentBalance: 450,
          totalEarned: 1200,
          totalSpent: 750,
          monthlyEarned: 180,
          monthlyGoal: 300,
          level: 3,
          nextLevelPoints: 200,
          streak: 7
        });
      }
    };

    loadPointsData();
  }, []);

  const handleRewardPurchase = async (reward) => {
    if (pointsData.currentBalance < reward.pointsCost) {
      toast.error('Insufficient points for this reward');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.purchaseReward(reward.id);
      
      // Update local state
      setPointsData(prev => ({
        ...prev,
        currentBalance: response.newBalance
      }));
      
      toast.success(`Successfully purchased: ${reward.title}!`);
      setShowRewardModal(false);
      setSelectedReward(null);
    } catch (error) {
      toast.error(error.message || 'Failed to purchase reward');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEarningAction = async (opportunity) => {
    setIsLoading(true);
    
    // Add visual feedback immediately
    toast.loading(`Completing ${opportunity.title}...`, {
      id: `action-${opportunity.id}`,
      duration: Infinity
    });
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiService.completeAction(opportunity.id);
      
      // Update local state with animation
      setPointsData(prev => ({
        ...prev,
        currentBalance: response.newBalance
      }));
      
      // Mark as completed with animation
      setEarningOpportunities(prev => 
        prev.map(opp => 
          opp.id === opportunity.id 
            ? { ...opp, completed: true }
            : opp
        )
      );
      
      // Dismiss loading toast and show success
      toast.dismiss(`action-${opportunity.id}`);
      toast.success(`🎉 Earned ${opportunity.points} points for ${opportunity.title}!`, {
        duration: 4000,
        icon: '💰'
      });
      
      // Emit real-time event for other connected devices
      socket?.emit('action-completed', {
        actionId: opportunity.id,
        points: opportunity.points,
        title: opportunity.title
      });
      
      // Add to points history
      const newEntry = {
        id: Date.now(),
        type: 'earned',
        amount: opportunity.points,
        description: opportunity.title,
        date: new Date().toISOString(),
        category: opportunity.type
      };
      
      setPointsHistory(prev => [newEntry, ...prev]);
      
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(`action-${opportunity.id}`);
      toast.error(`❌ Failed to complete ${opportunity.title}: ${error.message || 'Unknown error'}`, {
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportPointsHistory = () => {
    const data = {
      user: user?.firstName + ' ' + user?.lastName,
      pointsData,
      history: pointsHistory,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `points-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Points history exported successfully!');
  };

  const renderPointsOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div 
        className="card p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-navy-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mb-2">{pointsData.currentBalance}</h3>
          <p className="text-navy-600 font-medium">Current Balance</p>
        </div>
      </motion.div>

      <motion.div 
        className="card p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-navy-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mb-2">{pointsData.level}</h3>
          <p className="text-navy-600 font-medium">Current Level</p>
        </div>
      </motion.div>

      <motion.div 
        className="card p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mb-2">{pointsData.streak}</h3>
          <p className="text-navy-600 font-medium">Day Streak</p>
        </div>
      </motion.div>
    </div>
  );

  const renderProgress = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Monthly Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-sm text-navy-600 mb-3">
              <span className="font-medium">Monthly Goal</span>
              <span className="font-semibold">{pointsData.monthlyEarned}/{pointsData.monthlyGoal} points</span>
            </div>
            <div className="w-full bg-navy-200 rounded-full h-4 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-navy-500 to-accent-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((pointsData.monthlyEarned / pointsData.monthlyGoal) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-navy-500 mt-2">
              <span>0</span>
              <span>{pointsData.monthlyGoal}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center text-sm text-navy-600 mb-3">
              <span className="font-medium">Next Level</span>
              <span className="font-semibold">{pointsData.currentBalance}/{pointsData.nextLevelPoints} points</span>
            </div>
            <div className="w-full bg-navy-200 rounded-full h-4 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((pointsData.currentBalance / pointsData.nextLevelPoints) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-navy-500 mt-2">
              <span>Level {pointsData.level}</span>
              <span>Level {pointsData.level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-navy-100">
            <span className="text-navy-600">Login Streak</span>
            <span className="font-semibold text-navy-900">{pointsData.streak} days</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-navy-100">
            <span className="text-navy-600">Total Spent</span>
            <span className="font-semibold text-navy-900">{pointsData.totalSpent}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-navy-600">Net Points</span>
            <span className="font-semibold text-navy-900">{pointsData.totalEarned - pointsData.totalSpent}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEarningOpportunities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-navy-900">Earning Opportunities</h3>
          <div className="flex items-center space-x-2 text-sm text-navy-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Updates</span>
          </div>
        </div>
        <div className="text-sm text-navy-600">
          Available: <span className="font-semibold text-navy-900">{earningOpportunities.filter(o => !o.completed).length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {earningOpportunities.map((opportunity) => (
          <motion.div
            key={opportunity.id}
            className={`card-hover p-6 relative overflow-hidden ${
              opportunity.completed ? 'opacity-75' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Shimmer effect for available opportunities */}
            {!opportunity.completed && (
              <div className="shimmer-effect absolute inset-0 pointer-events-none" />
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${
                opportunity.completed 
                  ? 'from-green-500 to-green-600' 
                  : 'from-navy-500 to-accent-500'
              } rounded-lg flex items-center justify-center`}>
                <opportunity.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-navy-600">{opportunity.points} pts</span>
                {opportunity.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </motion.div>
                )}
              </div>
            </div>
            
            <h4 className="font-semibold text-navy-900 mb-2">{opportunity.title}</h4>
            <p className="text-sm text-navy-600 mb-4">{opportunity.description}</p>
            
            {/* Progress indicator for certain opportunities */}
            {opportunity.type === 'daily' && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-navy-500 mb-1">
                  <span>Daily Progress</span>
                  <span>{opportunity.completed ? 'Completed' : 'Available'}</span>
                </div>
                <div className="w-full bg-navy-200 rounded-full h-2">
                  <motion.div 
                    className={`h-2 rounded-full ${
                      opportunity.completed ? 'bg-green-500' : 'bg-gradient-to-r from-navy-500 to-accent-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: opportunity.completed ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
            
            <motion.button
              onClick={() => handleEarningAction(opportunity)}
              disabled={opportunity.completed || isLoading}
              className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                opportunity.completed
                  ? 'bg-green-100 text-green-800 cursor-not-allowed border border-green-200'
                  : isLoading
                  ? 'bg-navy-200 text-navy-700 cursor-not-allowed'
                  : 'btn-primary hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
              whileHover={!opportunity.completed && !isLoading ? { scale: 1.02 } : {}}
              whileTap={!opportunity.completed && !isLoading ? { scale: 0.98 } : {}}
              animate={!opportunity.completed && !isLoading ? {
                background: ['#475569', '#3b82f6', '#475569'],
                transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              } : {}}
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    <span>Processing...</span>
                  </>
                ) : opportunity.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        transition: { duration: 2, repeat: Infinity }
                      }}
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                    <span>Complete Action</span>
                  </>
                )}
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-navy-900">Available Rewards</h3>
        <div className="text-sm text-navy-600">
          Balance: <span className="font-semibold text-navy-900">{pointsData.currentBalance} points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <motion.div
            key={reward.id}
            className={`card-hover p-6 ${!reward.available ? 'opacity-50' : ''}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-center mb-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${
                reward.available 
                  ? 'from-navy-500 to-accent-500' 
                  : 'from-navy-300 to-navy-400'
              } rounded-full flex items-center justify-center mx-auto mb-3`}>
                <reward.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-navy-900 mb-2">{reward.title}</h4>
              <p className="text-sm text-navy-600 mb-4">{reward.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-navy-500">Cost</span>
                <span className="font-semibold text-navy-900">{reward.pointsCost} points</span>
              </div>
            </div>
            
            <motion.button
              onClick={() => handleRewardPurchase(reward)}
              disabled={!reward.available || pointsData.currentBalance < reward.pointsCost}
              className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                reward.available && pointsData.currentBalance >= reward.pointsCost
                  ? 'btn-accent hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-navy-100 text-navy-400 cursor-not-allowed'
              }`}
              whileHover={reward.available && pointsData.currentBalance >= reward.pointsCost ? { scale: 1.02 } : {}}
              whileTap={reward.available && pointsData.currentBalance >= reward.pointsCost ? { scale: 0.98 } : {}}
            >
              {reward.available && pointsData.currentBalance >= reward.pointsCost ? (
                <div className="flex items-center justify-center space-x-2">
                  <Gift className="w-4 h-4" />
                  <span>Redeem Reward</span>
                </div>
              ) : (
                <span>
                  {pointsData.currentBalance < reward.pointsCost ? 'Insufficient Points' : 'Unavailable'}
                </span>
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-earth-900">Points History</h3>
        <div className="flex space-x-2">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={exportPointsHistory}
            className="btn-outline flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="space-y-4">
            {pointsHistory.map((entry) => (
              <motion.div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-earth-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    entry.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {entry.type === 'earned' ? (
                      <Plus className="w-5 h-5 text-green-600" />
                    ) : (
                      <Minus className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-earth-900">{entry.description}</p>
                    <p className="text-sm text-earth-600">
                      {new Date(entry.date).toLocaleDateString()} • {entry.category}
                    </p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  entry.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {entry.type === 'earned' ? '+' : ''}{entry.amount}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'earning', name: 'Earning', icon: TrendingUp },
    { id: 'rewards', name: 'Rewards', icon: Gift },
    { id: 'history', name: 'History', icon: History }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderPointsOverview();
      case 'earning':
        return renderEarningOpportunities();
      case 'rewards':
        return renderRewards();
      case 'history':
        return renderHistory();
      default:
        return renderPointsOverview();
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-earth-900 mb-2">Points Management</h1>
          <p className="text-earth-600">Track your points, earn rewards, and level up your sustainable fashion journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-earth-600 hover:text-primary-600'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
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

        {/* Reward Purchase Modal */}
        <AnimatePresence>
          {showRewardModal && selectedReward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedReward.image}</div>
                  <h3 className="text-xl font-semibold text-earth-900 mb-2">{selectedReward.title}</h3>
                  <p className="text-earth-600 mb-4">{selectedReward.description}</p>
                  <div className="flex justify-center items-center space-x-4">
                    <span className="text-sm text-earth-600">Cost:</span>
                    <span className="font-semibold text-earth-900">{selectedReward.pointsCost} points</span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleRewardPurchase(selectedReward)}
                    disabled={isLoading}
                    className="btn-primary flex items-center flex-1"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Purchasing...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Purchase Reward
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowRewardModal(false);
                      setSelectedReward(null);
                    }}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PointsPage; 