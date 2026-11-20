const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    let calculatedItemsPrice = 0;
    const verifiedOrderItems = [];

    // Retrieve database products to verify price and stock authenticity
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.name}` });
      }

      // Re-calculate price and items totals using authoritative DB values
      calculatedItemsPrice += product.price * item.qty;

      verifiedOrderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.images?.[0] || 'placeholder.png',
        price: product.price, // Database source of truth
        product: product._id
      });
    }

    const shippingPrice = calculatedItemsPrice > 150 ? 0 : 10;
    const totalPrice = calculatedItemsPrice + shippingPrice;

    // Initialize tracking update list
    const initialTracking = [
      {
        status: 'Processing',
        description: 'Order has been placed and is being processed by the merchant.',
        timestamp: new Date()
      }
    ];

    const order = new Order({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: calculatedItemsPrice,
      taxPrice: 0,
      shippingPrice,
      totalPrice,
      status: 'Processing',
      trackingUpdates: initialTracking,
      isPaid: paymentMethod === 'COD' ? false : true, // Mock payment paid for cards
      paidAt: paymentMethod === 'COD' ? null : new Date()
    });

    const createdOrder = await order.save();

    // Optimize stock decrementing using parallel updates
    await Promise.all(
      verifiedOrderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty }
        });
      })
    );

    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow the order owner or an admin to fetch it
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { status, description } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    order.status = status;
    order.trackingUpdates.push({
      status,
      description: description || `Order status updated to ${status}`,
      timestamp: new Date()
    });

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'COD') {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    const updatedOrder = await order.save();

    // Emit live update over WebSockets
    const io = req.app.get('io');
    if (io) {
      io.to(order._id.toString()).emit('orderStatusUpdate', {
        orderId: order._id,
        status: updatedOrder.status,
        trackingUpdates: updatedOrder.trackingUpdates
      });
      console.log(`Socket update emitted for order: ${order._id} status: ${status}`);
    }

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
