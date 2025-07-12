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

// Get all items (with filters)
router.get('/', async (req, res) => {
  try {
    const {
      category,
      size,
      condition,
      status = 'Active',
      search,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const filter = { status };
    
    if (category && category !== 'all') filter.category = category;
    if (size && size !== 'all') filter.size = size;
    if (condition && condition !== 'all') filter.condition = condition;
    
    if (search) {
      filter.$text = { $search: search };
    }

    const sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'oldest':
        sortOptions.createdAt = 1;
        break;
      case 'points-low':
        sortOptions.points = 1;
        break;
      case 'points-high':
        sortOptions.points = -1;
        break;
      case 'popular':
        sortOptions.likes = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * limit;
    
    const items = await Item.find(filter)
      .populate('owner', 'firstName lastName location')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'firstName lastName location bio')
      .populate('swapRequests.user', 'firstName lastName');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increment views
    await item.incrementViews();

    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new item
router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories']).withMessage('Invalid category'),
  body('size').notEmpty().withMessage('Size is required'),
  body('condition').isIn(['Like New', 'Excellent', 'Good', 'Fair']).withMessage('Invalid condition'),
  body('points').isInt({ min: 0 }).withMessage('Points must be a positive number'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, size, condition, points, images, tags } = req.body;

    const item = new Item({
      title,
      description,
      category,
      size,
      condition,
      points,
      images,
      tags: tags || [],
      owner: req.user._id,
      location: req.user.location
    });

    await item.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.itemsListed': 1 }
    });

    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, category, size, condition, points, images, tags } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (size) item.size = size;
    if (condition) item.condition = condition;
    if (points) item.points = points;
    if (images) item.images = images;
    if (tags) item.tags = tags;

    await item.save();

    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request swap
router.post('/:id/swap-request', auth, [
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot request swap for your own item' });
    }

    if (item.status !== 'Active') {
      return res.status(400).json({ message: 'Item is not available for swap' });
    }

    // Check if user already has a pending request
    const existingRequest = item.swapRequests.find(
      request => request.user.toString() === req.user._id.toString() && request.status === 'Pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this item' });
    }

    await item.addSwapRequest(req.user._id, req.body.message);

    res.json({ message: 'Swap request sent successfully' });
  } catch (error) {
    console.error('Swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's items
router.get('/user/me', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 