const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  tokenHash: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  usedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Create TTL index for automatic expiration
resetTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ResetToken', resetTokenSchema);