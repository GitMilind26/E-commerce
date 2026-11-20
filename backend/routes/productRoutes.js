const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { addProductReview, getProductReviews } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Reviews routes
router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(protect, addProductReview);

module.exports = router;

