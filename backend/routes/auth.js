const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// --- REGISTER A NEW USER ---
// @route   POST /api/auth/register
// @desc    Register a new user, hash their password, and return a JWT
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Generate a cryptographic salt (complexity 10) to mix with the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password combined with the salt. This is what gets saved to the DB.
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user object
    user = new User({ name, email, passwordHash });
    await user.save(); // Save to MongoDB

    // Create a JSON Web Token (JWT) encapsulating the user ID. Valid for 7 days.
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    
    // Return the token and basic user info (DO NOT return the password hash!)
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, targetAttendance: user.targetAttendance } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN EXISTING USER ---
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare the plaintext password from the request with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // If passwords match, generate a new JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, targetAttendance: user.targetAttendance } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GET LOGGED-IN USER INFO ---
// @route   GET /api/auth/me
// @desc    Get user data using token
// @access  Private
// Notice the 'auth' middleware passed as the second argument. It forces the request to specify a valid JWT.
router.get('/me', auth, async (req, res) => {
  try {
    // Find the user by the ID injected into req.user by the auth middleware.
    // .select('-passwordHash') ensures we NEVER send the password hash back to the frontend.
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- UPDATE TARGET ATTENDANCE ---
// @route   PUT /api/auth/target
// @desc    Update the user's target attendance goal (e.g. changing from 75% to 80%)
// @access  Private
router.put('/target', auth, async (req, res) => {
  try {
    const { targetAttendance } = req.body;
    // Find the user and update the field. { new: true } returns the updated document instead of the old one.
    const user = await User.findByIdAndUpdate(req.user.id, { targetAttendance }, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
