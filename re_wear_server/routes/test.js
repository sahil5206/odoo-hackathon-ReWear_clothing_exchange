const express = require('express');
const router = express.Router();

// Test endpoint to verify backend is running
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is running successfully!',
    timestamp: new Date().toISOString(),
    status: 'connected'
  });
});

module.exports = router; 