const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numOfReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    const Product = mongoose.model('Product');
    if (result.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        numOfReviews: result[0].numOfReviews,
        ratings: Math.round(result[0].averageRating * 10) / 10
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        numOfReviews: 0,
        ratings: 0
      });
    }
  } catch (error) {
    console.error(`Error updating ratings: ${error}`);
  }
};

ReviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
