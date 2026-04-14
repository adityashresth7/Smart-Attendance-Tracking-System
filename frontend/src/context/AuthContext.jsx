import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a Context object to hold our global authentication state
export const AuthContext = createContext();

// AuthProvider component wraps our entire application to give all components access to 'user' data
export const AuthProvider = ({ children }) => {
  // state variable that stores the currently logged-in user profile data
  const [user, setUser] = useState(null);
  // state variable representing if the app is currently fetching auth statuses (prevents flickering)
  const [loading, setLoading] = useState(true);
  // state variable for the JWT token, initialized from browser's local storage
  const [token, setToken] = useState(localStorage.getItem('token'));

  // useEffect Hook: Run this block whenever the 'token' changes (e.g. after login or logout)
  useEffect(() => {
    if (token) {
      // If a token exists, globally attach it to all future axios HTTP requests as an Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch the full user profile data from the backend since we only have the token
      fetchUser();
    } else {
      // If there is no token (not logged in), stop loading and render the app
      setLoading(false);
    }
  }, [token]);

  // Function to request the user profile using the attached token
  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/me');
      setUser(res.data); // Save the returned user info to our state
    } catch (err) {
      console.error(err);
      // If the request fails (e.g., token expired/invalid), wipe the local storage and state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      // Regardless of success or failure, mark loading as finished
      setLoading(false);
    }
  };

  // Function to log in a user given their email and password
  const login = async (email, password) => {
    // Send standard POST request to backend
    const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
    // Save to local storage for persistence across reloads
    localStorage.setItem('token', res.data.token);
    // Update React State
    setToken(res.data.token);
    setUser(res.data.user);
  };

  // Function to register a new user
  const register = async (name, email, password) => {
    // Similar to login POST
    const res = await axios.post('http://localhost:5001/api/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  // Function to explicitly log out, wiping local storage and removing API headers
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    // The Provider component shares all these variables/functions with its {children} (the rest of the app)
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
