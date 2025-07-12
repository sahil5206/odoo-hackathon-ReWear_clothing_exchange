const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories']
  },
  size: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Excellent', 'Good', 'Fair']
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Swapped', 'Removed'],
    default: 'Pending'
  },
  location: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  swapRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  swappedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  swappedAt: Date
}, {
  timestamps: true
});

// Index for search
itemSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual for availability
itemSchema.virtual('isAvailable').get(function() {
  return this.status === 'Active';
});

// Method to increment views
itemSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add swap request
itemSchema.methods.addSwapRequest = function(userId, message) {
  this.swapRequests.push({
    user: userId,
    message: message
  });
  return this.save();
};

// Method to approve item
itemSchema.methods.approve = function(adminId) {
  this.status = 'Active';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  return this.save();
};

// Method to mark as swapped
itemSchema.methods.markAsSwapped = function(swappedItemId) {
  this.status = 'Swapped';
  this.swappedWith = swappedItemId;
  this.swappedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Item', itemSchema); 