const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  // Item being requested
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  
  // Requester (user making the request)
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Receiver Details
  receiverDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'United States',
      trim: true
    }
  },
  
  // Preferences
  preferences: {
    contactMethod: {
      type: String,
      enum: ['email', 'phone', 'both'],
      default: 'email'
    },
    specialInstructions: {
      type: String,
      trim: true
    },
    preferredDate: {
      type: Date
    },
    preferredTime: {
      type: String
    }
  },
  
  // Item Details (what the requester wants to swap)
  itemDetails: {
    condition: {
      type: String,
      required: true,
      enum: ['Like New', 'Excellent', 'Good', 'Fair']
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    images: [{
      type: String
    }]
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Accepted', 'Declined', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  
  // Admin/owner actions
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  
  // Swap completion
  completedAt: Date,
  swapChatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapChat'
  },
  
  // Real-time tracking
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['status_change', 'message', 'reminder']
    },
    message: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
swapRequestSchema.index({ itemId: 1, requester: 1 });
swapRequestSchema.index({ status: 1 });
swapRequestSchema.index({ createdAt: -1 });
swapRequestSchema.index({ 'receiverDetails.email': 1 });

// Virtual for full address
swapRequestSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for requester name
swapRequestSchema.virtual('requesterName').get(function() {
  return this.receiverDetails.name;
});

// Method to update status
swapRequestSchema.methods.updateStatus = function(newStatus, reviewedBy = null, notes = '') {
  this.status = newStatus;
  this.lastUpdated = new Date();
  
  if (reviewedBy) {
    this.reviewedBy = reviewedBy;
    this.reviewedAt = new Date();
    this.reviewNotes = notes;
  }
  
  // Add notification
  this.notifications.push({
    type: 'status_change',
    message: `Swap request status updated to ${newStatus}`,
    sentAt: new Date()
  });
  
  return this.save();
};

// Method to add notification
swapRequestSchema.methods.addNotification = function(type, message) {
  this.notifications.push({
    type,
    message,
    sentAt: new Date()
  });
  return this.save();
};

// Method to mark notifications as read
swapRequestSchema.methods.markNotificationsAsRead = function() {
  this.notifications.forEach(notification => {
    notification.read = true;
  });
  return this.save();
};

// Pre-save middleware to update lastUpdated
swapRequestSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema); 