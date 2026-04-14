import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Create a Context object to hold our global subject data state
export const SubjectContext = createContext();

// SubjectProvider wraps our application and manages fetching/updating subjects
export const SubjectProvider = ({ children }) => {
  // Grab the currently logged-in user from AuthContext (we only fetch subjects if logged in)
  const { user } = useContext(AuthContext);
  
  // Array holding all subject objects
  const [subjects, setSubjects] = useState([]);
  // Boolean indicating if subjects are currently being fetched
  const [loading, setLoading] = useState(true);

  // Hook runs whenever the 'user' variable changes state (like during login/logout)
  useEffect(() => {
    if (user) {
      // If a user exists, go get their specific subjects from the DB
      fetchSubjects();
    } else {
      // If no one is logged in, wipe any cached subjects for safety and stop loading
      setSubjects([]);
      setLoading(false);
    }
  }, [user]);

  // Function to pull all subjects belonging to the user
  const fetchSubjects = async () => {
    try {
      // Uses the globally attached JWT token (from AuthContext) to authenticate
      const res = await axios.get('http://localhost:5001/api/subjects');
      setSubjects(res.data); // Populate state with backend data
    } catch (err) {
      console.error(err); // Basic error handling
    } finally {
      setLoading(false); // Stop loading regardless of success/fail
    }
  };

  // Function used in the "Add Subject" modal/page
  const addSubject = async (name, totalClasses, attendedClasses) => {
    // Sends new subject data to backend
    const res = await axios.post('http://localhost:5001/api/subjects', { name, totalClasses, attendedClasses });
    // Instead of re-fetching ALL subjects from the backend, we manually inject the new subject into our local array
    // This is faster and doesn't require an extra network request
    setSubjects([res.data, ...subjects]);
  };

  // Core logic: Updating Present/Absent stats
  const markAttendance = async (id, status) => {
    // Pass 'present' or 'absent' to the backend PUT route so the server increments the counters
    const res = await axios.put(`http://localhost:5001/api/subjects/${id}/attendance`, { status });
    // Maps over the existing array and replaces the outdated subject object with the newly returned one
    setSubjects(subjects.map(s => s._id === id ? res.data : s));
  };

  // Function to completely delete a subject
  const deleteSubject = async (id) => {
    // Tells the backend to delete
    await axios.delete(`http://localhost:5001/api/subjects/${id}`);
    // Filters out the subject locally so it disappears from the screen instantly
    setSubjects(subjects.filter(s => s._id !== id));
  };

  return (
    // Expose these state variables and functions to all child components
    <SubjectContext.Provider value={{ subjects, loading, fetchSubjects, addSubject, markAttendance, deleteSubject }}>
      {children}
    </SubjectContext.Provider>
  );
};
