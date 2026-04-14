const mongoose = require('mongoose');

// Define the schema (structure) for a User document in MongoDB
const userSchema = new mongoose.Schema({
  // Full name of the user
  name: { type: String, required: true },
  
  // User's email address. 'unique: true' ensures no two users can register with the same email.
  email: { type: String, required: true, unique: true },
  
  // Never store plain text passwords! We store the securely hashed version of the password.
  passwordHash: { type: String, required: true },
  
  // Global attendance target the user wants to maintain (defaults to 75%)
  targetAttendance: { type: Number, default: 75 }
}, { 
  // Automatically adds 'createdAt' and 'updatedAt' timestamp fields
  timestamps: true 
});

// Export the compiled User model
module.exports = mongoose.model('User', userSchema);
