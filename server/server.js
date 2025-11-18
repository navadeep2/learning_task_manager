// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Required for frontend communication
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // Task routes import
const errorMiddleware = require('./middleware/errorMiddleware'); // Error handler import

const app = express();

// --- Middleware Configuration ---
app.use(express.json()); // Body parser
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', // Allow requests from your React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Routes ---
app.use('/auth', authRoutes); // Authentication routes
app.use('/tasks', taskRoutes); // Task routes

// --- Centralized Error Handler ---
app.use(errorMiddleware); // Must be the last piece of middleware

// --- Database Connection (Promise-based) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));