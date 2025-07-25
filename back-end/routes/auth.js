const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ username, email });
    if (!user || !await User.matchPassword(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;