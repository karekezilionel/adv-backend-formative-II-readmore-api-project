require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('node:dns').setDefaultResultOrder('ipv4first');
require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Part 0: Health-check route
app.get('/', (req, res) => {
  res.json({ message: 'ReadMore API is running' });
});

// Connect to MongoDB, THEN start the server
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
    process.exit(1); // Stop the app if the DB fails
  }
}

startServer();