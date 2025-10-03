const mongoose = require('mongoose');

const geoPointSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  neighborhood: {
    type: String,
    required: true
  },
  geo: {
    type: geoPointSchema,
    required: true
  }
});

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  gross: {
    type: Number,
    required: true
  },
  net: {
    type: Number,
    required: true
  },
  numberOfRoom: {
    type: String,
    required: true
  },
  buildingAge: {
    type: Number,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  numberOfFloors: {
    type: Number,
    required: true
  },
  heating: {
    type: String,
    required: true
  },
  numberOfBathrooms: {
    type: Number,
    required: true
  },
  kitchen: {
    type: String,
    required: true
  },
  balcony: {
    type: Number,
    required: true
  },
  lift: {
    type: String,
    required: true
  },
  parking: {
    type: String,
    required: true
  },
  furnished: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  dues: {
    type: Number,
    required: true
  },
  eligibleForLoan: {
    type: String,
    required: true
  },
  titleDeedStatus: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  location: {
    type: locationSchema,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  listingType: {
    type: String,
    required: true
  },
  subType: {
    type: String,
    default: null
  },
  selectedFeatures: {
    type: Map,
    of: [String],
    default: {}
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
propertySchema.index({ 'location.geo': '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);