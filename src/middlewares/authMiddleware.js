const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

/**
 * Authentication Middleware
 *
 * This middleware checks if a valid access token is present in either the cookies
 * or the `Authorization` header of the request. It decodes the token using the
 * JWT secret and verifies the authenticity of the token. If the token is valid,
 * the associated user is fetched from the database (excluding the password field).
 * The user data is then attached to the request object (`req.user`), and the request
 * proceeds to the next middleware or route handler. If any error occurs during
 * verification or user lookup, a 401 or 404 error is sent back to the client.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Retrieve the access token from cookies or Authorization header
    const accessToken =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    // If no token is provided, return an unauthorized error
    if (!accessToken) {
      return res.status(401).json({ message: "Oops! Please login" });
    }

    // Decode the JWT token using the secret key
    const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET);

    // If decoding fails or the token is invalid, return an unauthorized error
    if (!decoded) {
      return res.status(401).json({
        error:
          "Oops! Invalid access token, please login with your credentials!",
      });
    }

    // Look up the user in the database based on the decoded userId from the token
    const user = await UserModel.findById(decoded.userId).select("-password");

    // If no user is found or the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({
        error: "Oops! Invalid access token or user not found",
      });
    }

    // Attach the user object to the request so it can be used in subsequent middleware/handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging purposes in development
    console.error(error);

    // Handle specific JWT errors
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ message: "Invalid or expired access token" });
    }

    // General error handling for other unexpected errors
    return res
      .status(500)
      .json({ message: "An error occurred during authentication" });
  }
};

module.exports = authMiddleware;
