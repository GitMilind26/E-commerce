const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create new review or update existing one
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed the product
    let review = await Review.findOne({ product: productId, user: req.user._id });

    if (review) {
      // Update review
      review.rating = Number(rating);
      review.comment = comment;
      await review.save();
      // Recalculate average
      await Review.calculateAverageRating(productId);

      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review
      });
    } else {
      // Create new review
      review = await Review.create({
        user: req.user._id,
        product: productId,
        name: req.user.name,
        rating: Number(rating),
        comment
      });

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        review
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};
