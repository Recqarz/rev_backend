/**
 * coordinator Role Middleware
 * 
 * This middleware checks if the user has an "coordinator" role. It assumes that the
 * user object has been populated in the `req.user` object (typically by
 * authentication middleware). If the user has the "coordinator" role, the request
 * is allowed to proceed to the next middleware or route handler. If not, an
 * "Access Denied" response is sent.
 */
const coordinatorMiddleware = (req, res, next) => {
    // Check if the user is an coordinator
    if (req.user && req.user.role === "coordinator") {
      // If the user is an coordinator, proceed to the next middleware or route handler
      return next();
    } else {
      // If the user is not an coordinator, return "Access Denied"
      return res.status(403).json({ message: "Access Denied. coordinator only." });
    }
  };
  
  module.exports = coordinatorMiddleware;
  