const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Must be before routes
app.use(cors());

app.post('/test-body', (req, res) => {
  console.log('Body:', req.body);
  res.json({ received: req.body });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});