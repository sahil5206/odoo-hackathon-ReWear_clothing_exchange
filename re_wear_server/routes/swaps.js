const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get user's swap requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const items = await Item.find({
      'swapRequests.user': req.user._id
    }).populate('owner', 'firstName lastName');

    const requests = [];
    items.forEach(item => {
      const userRequest = item.swapRequests.find(
        request => request.user.toString() === req.user._id.toString()
      );
      if (userRequest) {
        requests.push({
          itemId: item._id,
          itemTitle: item.title,
          itemImage: item.images[0],
          owner: item.owner,
          status: userRequest.status,
          message: userRequest.message,
          createdAt: userRequest.createdAt
        });
      }
    });

    res.json({ requests });
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get incoming swap requests (for item owners)
router.get('/incoming', auth, async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
      'swapRequests.status': 'Pending'
    }).populate('swapRequests.user', 'firstName lastName');

    const incomingRequests = [];
    items.forEach(item => {
      const pendingRequests = item.swapRequests.filter(
        request => request.status === 'Pending'
      );
      pendingRequests.forEach(request => {
        incomingRequests.push({
          itemId: item._id,
          itemTitle: item.title,
          itemImage: item.images[0],
          requester: request.user,
          message: request.message,
          createdAt: request.createdAt
        });
      });
    });

    res.json({ requests: incomingRequests });
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept swap request
router.put('/accept/:itemId/:userId', auth, async (req, res) => {
  try {
    const { itemId, userId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the specific request
    const request = item.swapRequests.find(
      req => req.user.toString() === userId && req.status === 'Pending'
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status
    request.status = 'Accepted';
    await item.save();

    res.json({ message: 'Swap request accepted' });
  } catch (error) {
    console.error('Accept swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decline swap request
router.put('/decline/:itemId/:userId', auth, async (req, res) => {
  try {
    const { itemId, userId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the specific request
    const request = item.swapRequests.find(
      req => req.user.toString() === userId && req.status === 'Pending'
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status
    request.status = 'Declined';
    await item.save();

    res.json({ message: 'Swap request declined' });
  } catch (error) {
    console.error('Decline swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete swap (mark items as swapped)
router.post('/complete', auth, [
  body('item1Id').notEmpty().withMessage('Item 1 ID is required'),
  body('item2Id').notEmpty().withMessage('Item 2 ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { item1Id, item2Id } = req.body;

    const item1 = await Item.findById(item1Id);
    const item2 = await Item.findById(item2Id);

    if (!item1 || !item2) {
      return res.status(404).json({ message: 'One or both items not found' });
    }

    // Check if user owns one of the items
    if (item1.owner.toString() !== req.user._id.toString() && 
        item2.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark items as swapped
    await item1.markAsSwapped(item2Id);
    await item2.markAsSwapped(item1Id);

    // Update user stats
    await User.findByIdAndUpdate(item1.owner, {
      $inc: { 'stats.itemsSwapped': 1 }
    });
    await User.findByIdAndUpdate(item2.owner, {
      $inc: { 'stats.itemsSwapped': 1 }
    });

    res.json({ message: 'Swap completed successfully' });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 