const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + orderData.deliveryFee + tax;

    const order = new Order({
      ...orderData,
      subtotal,
      tax,
      total
    });

    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address contact')
      .populate('items.menuItem', 'name price image');

    res.status(201).json(populatedOrder);
  } catch (error) {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name email phone')
     .populate('restaurant', 'name address contact');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;