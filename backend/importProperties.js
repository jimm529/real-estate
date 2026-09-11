const mongoose = require('mongoose');
const Property = require('./models/Property');
const propertyData = require('./data/property-list-data.json');
require('dotenv').config();

const importProperties = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_connection_string') {
    console.error('Error: Please provide a valid MONGODB_URI in your .env file before running the import script.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    const properties = propertyData.properties;

    if (!Array.isArray(properties) || properties.length === 0) {
      console.log('No properties found in JSON file to import.');
      await mongoose.connection.close();
      return;
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const prop of properties) {
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

    console.log('Import completed successfully!');
    console.log(`- Total in JSON: ${properties.length}`);
    console.log(`- Inserted: ${insertedCount}`);
    console.log(`- Skipped (already exists): ${skippedCount}`);
  } catch (error) {
    console.error('Error importing properties:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

importProperties();

