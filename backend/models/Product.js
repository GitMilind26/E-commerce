const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String, required: true }],
  category: { type: String, required: true, index: true },
  subCategory: { type: String, required: true },
  sizes: [{ type: String }],
  bestseller: { type: Boolean, default: false },
  stock: { type: Number, required: true, min: 0, default: 0 },
  ratings: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ price: 1 });

module.exports = mongoose.model('Product', ProductSchema);
