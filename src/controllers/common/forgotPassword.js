const UserModel = require("../../models/userModel");
const { hashData } = require("../../utils/hasData");
const { generateOTP, isOTPExpired } = require("../../utils/otp");

// sending OTP
const sendOTP = async (req, res) => {
  try {
    const { userData } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: userData }, { mobile: userData }, { userCode: userData }],
    });

    if (!user) {
      return res.status(404).send({
        error:
          "Oops! Something went wrong. Please provide correct email/mobile/user-code.",
      });
    }

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
        error: " Oops!. Somthing went wrong while storing OTP in data base!",
      });
    }

    // Send the OTP on mail and mobile

    return res.status(200).send({ updatedUser });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(400).send({ error: error.message });
  }
};

// Verifing OTP
const verifyOTP = async (req, res) => {
  try {
    const { userData, eOtp, mOtp } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: userData }, { mobile: userData }, { userCode: userData }],
    });

    if (!user) {
      return res.status(404).send({
        error:
          "Oops! Something went wrong. Please provide correct email/mobile/user-code.",
      });
    }
    const { expirationTime, emailOtp, mobileOtp } = user.otp;

    if (isOTPExpired(expirationTime)) {
      return res
        .status(400)
        .send({ error: "Oops! your otp has expired please try again!" });
    }

    const isOtpMatched = eOtp === emailOtp && mOtp === mobileOtp;

    if (!isOtpMatched) {
      return res.status(200).send({ error: "Oops! Invalied OTP." });
    }

    await UserModel.findByIdAndUpdate(user._id, {
      otp: {
        isVerify: true,
      },
    });

    return res.status(200).send({ message: "your Otp has been matched!" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(400).send({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userData, password } = req.body;

    if (!password) {
      return res.status(400).send({ error: "Oops! password is required!" });
    }

    const user = await UserModel.findOne({
      $or: [{ email: userData }, { mobile: userData }, { userCode: userData }],
    });

    if (!user) {
      return res.status(404).send({
        error:
          "Oops! Something went wrong. Please provide correct email/mobile/user-code.",
      });
    }

    const isOtpVerified = user.otp.isVerify;

    if (!isOtpVerified) {
      return res
        .status(400)
        .send({ error: "Oops! please verify with your OTP first!" });
    }

    const hasPassword = await hashData(password);

    await UserModel.findByIdAndUpdate(user._id, {
      password: hasPassword,
      otp: {
        isVerify: false,
      },
    });

    return res
      .status(200)
      .send({ message: "Your password has been changed successfully!" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { sendOTP, verifyOTP, resetPassword };
