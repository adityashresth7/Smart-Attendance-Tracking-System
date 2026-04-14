const mongoose = require('mongoose');

// Define the schema (structure) for a Subject document in MongoDB
const subjectSchema = new mongoose.Schema({
  // Link this subject to a specific User. This acts like a foreign key in SQL databases.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // The name of the subject (e.g., "Mathematics")
  name: { type: String, required: true },
  
  // Track how many classes have happened in total. Defaults to 0 when first created.
  totalClasses: { type: Number, default: 0 },
  
  // Track how many of those classes the user actually attended. Defaults to 0.
  attendedClasses: { type: Number, default: 0 }
}, { 
  // Automatically adds 'createdAt' and 'updatedAt' timestamp fields to every document
  timestamps: true 
});

// Export the compiled Subject model so we can use it to query the DB in our routes
module.exports = mongoose.model('Subject', subjectSchema);
