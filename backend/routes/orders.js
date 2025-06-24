const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;

    console.log('👉 Received Order Data:', orderData);

    // Validation
    if (!orderData.customer || !orderData.restaurant || !orderData.items || !orderData.deliveryFee) {
      return res.status(400).json({
        message: 'Missing required fields: customer, restaurant, items, or deliveryFee'
      });
    }

    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item' });
    }

    const subtotal = orderData.items.reduce((sum, item) => {
      if (!item.price || !item.quantity) {
        throw new Error('Each item must include price and quantity');
      }
      return sum + (item.price * item.quantity);
    }, 0);

    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + orderData.deliveryFee + tax).toFixed(2));

    const order = new Order({
      customer: orderData.customer,
      restaurant: orderData.restaurant,
      items: orderData.items,
      deliveryFee: orderData.deliveryFee,
      subtotal,
      tax,
      total,
      status: orderData.status || 'pending'
    });

    console.log('🛠 Saving Order:', order);

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address contact')
      .populate('items.menuItem', 'name price image');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { customer, restaurant, status } = req.query;
    let query = {};

    if (customer) query.customer = customer;
    if (restaurant) query.restaurant = restaurant;
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address contact')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address contact')
      .populate('items.menuItem', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Error fetching order by ID:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Missing status in request body' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address contact')
      .populate('items.menuItem', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
