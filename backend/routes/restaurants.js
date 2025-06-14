const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine, search, sortBy } = req.query;
    let query = {};

    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    let restaurants = Restaurant.find(query);

    if (sortBy === 'rating') {
      restaurants = restaurants.sort({ rating: -1 });
    } else if (sortBy === 'deliveryTime') {
      restaurants = restaurants.sort({ 'deliveryTime.min': 1 });
    } else {
      restaurants = restaurants.sort({ createdAt: -1 });
    }

    const result = await restaurants.populate('owner', 'name email');
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant menu
router.get('/:id/menu', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { restaurant: req.params.id };

    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;