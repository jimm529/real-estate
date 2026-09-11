const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'Property ID is required'],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  property_image: {
    type: String,
    required: [true, 'Property image URL is required'],
    match: [/^https?:\/\/.+/i, 'Please provide a valid image URL'],
  },
  property_price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Property price cannot be negative'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    trim: true,
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true,
  },
  developer: {
    type: String,
    required: [true, 'Developer is required'],
    trim: true,
    index: true,
  },
  project_description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
  },
  small_description: {
    type: String,
    required: [true, 'Small description is required'],
    trim: true,
  },
  property_type: {
    type: String,
    required: [true, 'Property type is required'],
    trim: true,
    index: true,
  },
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;

