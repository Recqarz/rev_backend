const UserModel = require("../../models/userModel"); // Import the UserModel
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const { compareHasedData } = require("../../utils/hasData");

const userLogin = async (req, res) => {
  try {
    // Extract userCode and password from the request body
    const { userCode, password } = req.body;

    // Check if both userCode and password are provided
    if (!userCode || !password) {
      return res
        .status(404)
        .send({ error: "Please provide user-name and password!" });
    }

    // Find the user by either email or userCode
    const user = await UserModel.findOne({
      $or: [{ email: userCode }, { userCode }],
    });

    // If user is not found, return an error response
    if (!user) {
      return res.status(404).send({
        error:
          "Oops! wrong credentials. Please login with your user-code or email and password!",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await compareHasedData(password, user.password);

    // If password does not match, return an error response
    if (!isPasswordMatch) {
      return res.status(404).send({ error: "Oops! your password is wrong!" });
    }

    // Create a payload with user information for the JWT
    const payload = {
      userId: user._id, // User ID for identification
      email: user.email, // User email for additional context
      userCode: user.userCode, // User code for identification
      role: user.role, // User role for authorization
      iat: Math.floor(Date.now() / 1000), // Issued at timestamp (current time in seconds)
      expiresIn: "1d", // Token expiration period
    };

    // Sign a JWT with the payload and secret key from environment variables
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET);

    // Send a success response with the generated access token
    return res.status(200).send({
      message: "You are logged in",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        accessToken,
      },
    });
  } catch (error) {
    // Handle any errors and send an error response
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { userLogin };
