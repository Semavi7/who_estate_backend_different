const mongoose = require('mongoose');

const featureOptionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create compound unique index
featureOptionSchema.index({ category: 1, value: 1 }, { unique: true });

module.exports = mongoose.model('FeatureOption', featureOptionSchema);