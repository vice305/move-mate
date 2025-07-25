const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/auth');

router.post('/add', protect, async (req, res) => {
  const { name, quantity, category } = req.body;
  const userId = req.user.id;

  try {
    const newItem = await Inventory.create({ userId, name, quantity, category });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item' });
  }
});

router.get('/list', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    const inventory = await Inventory.findByUserId(userId);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory' });
  }
});

module.exports = router;