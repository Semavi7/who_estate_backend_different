const mongoose = require('mongoose');

const clientIntakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClientIntake', clientIntakeSchema);