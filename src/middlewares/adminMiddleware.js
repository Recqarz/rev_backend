/**
 * Admin Role Middleware
 * 
 * This middleware checks if the user has an "admin" role. It assumes that the
 * user object has been populated in the `req.user` object (typically by
 * authentication middleware). If the user has the "admin" role, the request
 * is allowed to proceed to the next middleware or route handler. If not, an
 * "Access Denied" response is sent.
 */
const adminMiddleware = (req, res, next) => {
    // Check if the user is an admin
    if (req.user && req.user.role === "admin") {
      // If the user is an admin, proceed to the next middleware or route handler
      return next();
    } else {
      // If the user is not an admin, return "Access Denied"
      return res.status(403).json({ message: "Access Denied. Admins only." });
    }
  };
  
  module.exports = adminMiddleware;
  