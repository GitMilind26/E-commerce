const mongoose = require('mongoose');
const Product = require('../models/Product');
const seedProducts = require('./products.json');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/e-commerce');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Synchronize catalog on DB connection
    console.log('Synchronizing product database catalog...');
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log('Database product catalog seeded successfully!');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

