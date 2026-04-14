const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const auth = require('../middleware/auth'); // Import our JWT authentication middleware

// --- GET ALL SUBJECTS ---
// @route   GET /api/subjects
// @desc    Get all subjects belonging to the currently logged-in user
// @access  Private (auth middleware enforces login)
router.get('/', auth, async (req, res) => {
  try {
    // Find all 'Subject' documents where the 'userId' matches the ID from the verified token
    // .sort({ createdAt: -1 }) ensures the newest subjects appear first
    const subjects = await Subject.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(subjects); // Send the array back to the frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADD A NEW SUBJECT ---
// @route   POST /api/subjects
// @desc    Create a new subject to track
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, totalClasses, attendedClasses } = req.body;
    
    // Create a new Mongoose document using the provided data
    const subject = new Subject({
      userId: req.user.id, // Securely tied to the logged-in user so nobody else can see it
      name,
      totalClasses: totalClasses || 0,
      attendedClasses: attendedClasses || 0
    });
    
    // Save to MongoDB
    await subject.save();
    res.json(subject); // Return the newly created object (including its generated _id)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MARK ATTENDANCE ---
// @route   PUT /api/subjects/:id/attendance
// @desc    Increment the total classes and (optionally) the attended classes count
// @access  Private
router.put('/:id/attendance', auth, async (req, res) => {
  try {
    const { status } = req.body; // Expects 'present' or 'absent' from the frontend
    
    // Find the specific subject. Including userId in the query ensures security
    // (a user cannot modify another user's subject even if they guess the ID)
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!subject) return res.status(404).json({ msg: 'Subject not found' });
    
    // Regardless of presence or absence, a class happened, so increase total
    subject.totalClasses += 1;
    
    // Only increase attended classes if they were actually present
    if (status === 'present') {
      subject.attendedClasses += 1;
    }
    
    // Save the updated numbers back to the database
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DELETE A SUBJECT ---
// @route   DELETE /api/subjects/:id
// @desc    Permanently delete a subject and its tracking data
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find and immediately delete the subject, ensuring it belongs to the active user
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!subject) return res.status(404).json({ msg: 'Subject not found' });
    
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
