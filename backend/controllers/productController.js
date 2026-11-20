const Product = require('../models/Product');

// Get all products (with optional filtering, text search, sorting, pagination)
exports.getProducts = async (req, res, next) => {
  try {
    const { category, subCategory, search, bestseller, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    // Apply categories/subcategories filters
    if (category) {
      query.category = { $in: Array.isArray(category) ? category : category.split(',') };
    }
    if (subCategory) {
      query.subCategory = { $in: Array.isArray(subCategory) ? subCategory : subCategory.split(',') };
    }

    // Filter bestseller
    if (bestseller) {
      query.bestseller = bestseller === 'true';
    }

    // Text search or regex matching
    if (search) {
      // Atlas search index fallback text search or simple regex match
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Build Mongoose execution query
    let productQuery = Product.find(query);

    // Sorting strategies
    if (sort) {
      if (sort === 'low-high') {
        productQuery = productQuery.sort({ price: 1 });
      } else if (sort === 'high-low') {
        productQuery = productQuery.sort({ price: -1 });
      } else if (sort === 'latest') {
        productQuery = productQuery.sort({ createdAt: -1 });
      }
    } else {
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    // Pagination calculations
    const skipCount = (parseInt(page) - 1) * parseInt(limit);
    productQuery = productQuery.skip(skipCount).limit(parseInt(limit));

    const products = await productQuery;
    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, images, category, subCategory, sizes, bestseller, stock, tags } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      images: images || ['placeholder.png'],
      category,
      subCategory,
      sizes: sizes || [],
      bestseller: bestseller === true || bestseller === 'true',
      stock: stock || 0,
      tags: tags || []
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};
