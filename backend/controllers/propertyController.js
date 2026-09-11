const Property = require('../models/Property');

// GET /api/properties - Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ id: 1 });

    return res.status(200).json({
      success: true,
      message: 'Properties fetched successfully.',
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch properties.',
      errors: error.message,
    });
  }
};

// GET /api/properties/:id - Get single property by numeric ID
const getPropertyById = async (req, res) => {
  try {
    const numericId = Number(req.params.id);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
        errors: null,
      });
    }

    const property = await Property.findOne({ id: numericId });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
        errors: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Property fetched successfully.',
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch property.',
      errors: error.message,
    });
  }
};

// POST /api/properties/import - Import properties avoiding duplicates
const importProperties = async (req, res) => {
  try {
    const propertyList = Array.isArray(req.body)
      ? req.body
      : req.body?.properties;

    if (!Array.isArray(propertyList) || propertyList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data. Please provide an array of properties.',
        errors: null,
      });
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const prop of propertyList) {
      const existingProperty = await Property.findOne({
        $or: [{ id: prop.id }, { slug: prop.slug }],
      });

      if (!existingProperty) {
        await Property.create(prop);
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Properties imported successfully.',
      data: {
        totalReceived: propertyList.length,
        insertedCount,
        skippedCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to import properties.',
      errors: error.message,
    });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  importProperties,
};

