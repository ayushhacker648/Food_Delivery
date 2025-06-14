const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { restaurant, category, search } = req.query;
    let query = {};

    if (restaurant) {
      query.restaurant = restaurant;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    const menuItems = await MenuItem.find(query)
      .populate('restaurant', 'name rating deliveryTime')
      .sort({ category: 1, name: 1 });

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('restaurant', 'name rating deliveryTime address');
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;