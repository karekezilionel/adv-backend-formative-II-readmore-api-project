require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('node:dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ReadMore API is running' });
});

const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  // Handle malformed MongoDB ObjectIds (e.g., /books/123)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({ error: 'Resource not found (invalid ID format)' });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Default fallback
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();