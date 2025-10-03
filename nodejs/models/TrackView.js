const mongoose = require('mongoose');

const trackViewSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrackView', trackViewSchema);