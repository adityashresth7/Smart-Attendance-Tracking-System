const jwt = require('jsonwebtoken');

/**
 * Middleware function to protect private API routes.
 * It checks if the incoming request has a valid JSON Web Token (JWT).
 * If valid, it allows the request to proceed. If missing or invalid, it blocks the request.
 */
function auth(req, res, next) {
  // Extract the token from the 'Authorization: Bearer <token>' HTTP header
  const token = req.header('Authorization')?.split(' ')[1];
  
  // If no token is provided, reject the request immediately with a 401 Unauthorized status
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Attempt to cryptographically verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    
    // If valid, attach the decoded user info (like the user ID) to the request object
    // so subsequent route handlers know exactly WHICH user made the request
    req.user = decoded;
    
    // Pass control to the next middleware or the specific route handler
    next();
  } catch (ex) {
    // If verification fails (e.g., token expired or tampered with), reject the request
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
