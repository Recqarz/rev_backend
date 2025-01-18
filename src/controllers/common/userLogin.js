const UserModel = require("../../models/userModel"); // Import the UserModel
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const { compareHasedData } = require("../../utils/hasData");
const {
  sendOtptoEmail,
  generateOTP,
  isOTPExpired,
  sendWhatsappMessage,
} = require("../../utils/otp");

const loginAndSendOtp = async (req, res) => {
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

    // If user is not active, return an error response
    if (!user.isActive) {
      return res.status(404).send({
        error: "Oops! your account is deactivated. Please contact the admin!",
      });
    }

    // send otp
    const emailOtp = generateOTP();
    const mobileOtp = generateOTP();

    const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        otp: {
          expirationTime,
          emailOtp,
          mobileOtp,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).send({
        error: " Oops!. Somthing went wrong while storing OTP in database!",
      });
    }

    //send OTP to user mobile and email
    await sendOtptoEmail(user.email, emailOtp);
    await sendWhatsappMessage(user.mobile, mobileOtp);

    return res
      .status(200)
      .send({ message: "OTP has been sent to your email and mobile" });
  } catch (error) {
    // Handle any errors and send an error response
    return res.status(400).send({ error: error.message });
  }
};

//******************************************* */
const verifyOtpAndGenerateToken = async (req, res) => {
  try {
    const { userCode, eOtp, mOtp } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: userCode }, { mobile: userCode }, { userCode: userCode }],
    });

    if (!user) {
      return res.status(404).send({
        error:
          "Oops! Something went wrong. Please provide correct email/mobile/user-code.",
      });
    }
    const { expirationTime, emailOtp, mobileOtp } = user?.otp;

    if (isOTPExpired(expirationTime)) {
      return res
        .status(400)
        .send({ error: "Oops! your otp has expired please try again!" });
    }

    if (eOtp !== emailOtp) {
      return res.status(400).send({ error: "Oops! Invalied Email OTP." });
    }
    if (mOtp !== mobileOtp) {
      return res.status(400).send({ error: "Oops! Invalied Mobile OTP." });
    }

    await UserModel.findByIdAndUpdate(user._id, {
      otp: {
        isVerify: true,
      },
    });

    // Create a payload with user information for the JWT
    const payload = {
      userId: user._id, // User ID for identification
      email: user.email, // User email for additional context
      userCode: user.userCode, // User code for identification
      role: user.role, // User role for authorization
      isActive: user.isActive, // User status for additional context
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
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { loginAndSendOtp, verifyOtpAndGenerateToken };
