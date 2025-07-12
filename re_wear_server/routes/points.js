const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Item = require('../models/Item');

// Get user points summary
router.get('/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const pointsSummary = {
      currentBalance: user.points,
      totalEarned: user.stats.totalPointsEarned,
      totalSpent: user.stats.totalPointsEarned - user.points,
      monthlyEarned: 0, // Calculate from history
      monthlyGoal: 300,
      level: Math.floor(user.points / 100) + 1,
      nextLevelPoints: (Math.floor(user.points / 100) + 1) * 100,
      streak: user.stats.loginStreak || 0
    };

    res.json({ pointsSummary });
  } catch (error) {
    console.error('Get points summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get points history
router.get('/history', auth, async (req, res) => {
  try {
    const { period = 'all', limit = 50 } = req.query;
    
    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'year') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
    }

    // In a real app, you'd have a separate PointsTransaction model
    // For now, we'll simulate history based on user stats
    const history = [
      {
        id: 1,
        type: 'earned',
        amount: 150,
        description: 'Completed swap: Vintage Denim Jacket',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        category: 'swap'
      },
      {
        id: 2,
        type: 'spent',
        amount: -200,
        description: 'Purchased: Priority Listing',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        category: 'reward'
      },
      {
        id: 3,
        type: 'earned',
        amount: 50,
        description: 'Listed new item: Organic Cotton Dress',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        category: 'listing'
      }
    ];

    res.json({ history });
  } catch (error) {
    console.error('Get points history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Earn points
router.post('/earn', auth, [
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive number'),
  body('description').trim().isLength({ min: 3 }).withMessage('Description is required'),
  body('category').isIn(['swap', 'listing', 'daily', 'referral', 'review', 'social']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, description, category } = req.body;

    // Update user points
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { 
          points: amount,
          'stats.totalPointsEarned': amount
        }
      },
      { new: true }
    );

    // Emit real-time event
    const io = req.app.get('io');
    io.to(`user-${req.user._id}`).emit('points-earned', {
      amount,
      description,
      category
    });

    // Check for level up
    const newLevel = Math.floor(user.points / 100) + 1;
    const oldLevel = Math.floor((user.points - amount) / 100) + 1;
    
    if (newLevel > oldLevel) {
      io.to(`user-${req.user._id}`).emit('level-up', {
        newLevel,
        nextLevelPoints: newLevel * 100
      });
    }

    res.json({
      message: 'Points earned successfully',
      newBalance: user.points,
      earned: amount
    });
  } catch (error) {
    console.error('Earn points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Spend points
router.post('/spend', auth, [
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive number'),
  body('description').trim().isLength({ min: 3 }).withMessage('Description is required'),
  body('category').isIn(['reward', 'feature', 'badge']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, description, category } = req.body;

    // Check if user has enough points
    const user = await User.findById(req.user._id);
    if (user.points < amount) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Update user points
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: -amount }
      },
      { new: true }
    );

    // Emit real-time event
    const io = req.app.get('io');
    io.to(`user-${req.user._id}`).emit('points-spent', {
      amount,
      description,
      category
    });

    res.json({
      message: 'Points spent successfully',
      newBalance: updatedUser.points,
      spent: amount
    });
  } catch (error) {
    console.error('Spend points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get earning opportunities
router.get('/opportunities', auth, async (req, res) => {
  try {
    const opportunities = [
      {
        id: 1,
        title: "List New Item",
        description: "Earn points for listing sustainable items",
        points: 50,
        type: "action",
        completed: false,
        icon: "Package"
      },
      {
        id: 2,
        title: "Complete Swap",
        description: "Earn points when you complete a swap",
        points: 100,
        type: "action",
        completed: false,
        icon: "RefreshCw"
      },
      {
        id: 3,
        title: "Daily Login",
        description: "Log in daily to maintain your streak",
        points: 10,
        type: "daily",
        completed: true,
        icon: "Calendar"
      },
      {
        id: 4,
        title: "Refer a Friend",
        description: "Invite friends to join ReWear",
        points: 200,
        type: "referral",
        completed: false,
        icon: "Users"
      },
      {
        id: 5,
        title: "Leave Review",
        description: "Help the community with your feedback",
        points: 25,
        type: "action",
        completed: false,
        icon: "Star"
      },
      {
        id: 6,
        title: "Share on Social",
        description: "Spread the word about sustainable fashion",
        points: 30,
        type: "social",
        completed: false,
        icon: "Share2"
      }
    ];

    res.json({ opportunities });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available rewards
router.get('/rewards', auth, async (req, res) => {
  try {
    const rewards = [
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
    ];

    res.json({ rewards });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase reward
router.post('/rewards/:rewardId/purchase', auth, async (req, res) => {
  try {
    const { rewardId } = req.params;
    
    // In a real app, you'd fetch reward details from database
    const reward = {
      id: parseInt(rewardId),
      title: "Priority Listing",
      description: "Your items appear first in search results",
      pointsCost: 200,
      category: "Feature",
      available: true
    };

    if (!reward.available) {
      return res.status(400).json({ message: 'Reward not available' });
    }

    // Check if user has enough points
    const user = await User.findById(req.user._id);
    if (user.points < reward.pointsCost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: -reward.pointsCost }
      },
      { new: true }
    );

    // Emit real-time event
    const io = req.app.get('io');
    io.to(`user-${req.user._id}`).emit('points-spent', {
      amount: reward.pointsCost,
      description: `Purchased: ${reward.title}`,
      category: 'reward'
    });

    res.json({
      message: 'Reward purchased successfully',
      newBalance: updatedUser.points,
      reward: reward.title
    });
  } catch (error) {
    console.error('Purchase reward error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete earning action
router.post('/actions/:actionId/complete', auth, async (req, res) => {
  try {
    const { actionId } = req.params;
    
    // In a real app, you'd fetch action details from database
    const action = {
      id: parseInt(actionId),
      title: "List New Item",
      description: "Earn points for listing sustainable items",
      points: 50,
      type: "action"
    };

    // Add points
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { 
          points: action.points,
          'stats.totalPointsEarned': action.points
        }
      },
      { new: true }
    );

    // Emit real-time event
    const io = req.app.get('io');
    io.to(`user-${req.user._id}`).emit('points-earned', {
      amount: action.points,
      description: action.title,
      category: action.type
    });

    res.json({
      message: 'Action completed successfully',
      newBalance: user.points,
      earned: action.points
    });
  } catch (error) {
    console.error('Complete action error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 