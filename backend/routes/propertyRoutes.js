const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  importProperties,
} = require('../controllers/propertyController');

// Routes for /api/properties
router.get('/', getAllProperties);
router.post('/import', importProperties);
router.get('/:id', getPropertyById);

module.exports = router;

