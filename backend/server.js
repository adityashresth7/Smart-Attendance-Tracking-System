// Load environment variables from .env file (if it exists)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express application
const app = express();

// --- MIDDLEWARE ---
// Enable CORS so our frontend (running on a different port) can make requests to this API
app.use(cors());
// Parse incoming JSON requests automatically so we can read req.body
app.use(express.json());

// --- ROUTES ---
// Route all authentication-related requests to the auth.js router
app.use('/api/auth', require('./routes/auth'));
// Route all subject-related requests to the subjects.js router
app.use('/api/subjects', require('./routes/subjects'));

// Define the port to run the server on (defaults to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;

// --- DATABASE CONNECTION ---
// Connect to MongoDB using the URI from .env or fallback to a local default
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-attendance-tracker')
  .then(() => {
    console.log('Connected to MongoDB');
    // Only start listening for incoming HTTP requests AFTER the database is successfully connected
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
