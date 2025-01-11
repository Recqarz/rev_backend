const express = require("express");
const { loginAndSendOtp,verifyOtpAndGenerateToken } = require("../controllers/common/userLogin");
const { updateUser } = require("../controllers/common/updateUser");
const authMiddleware = require("../middlewares/authMiddleware");
const { sendOTP, verifyOTP } = require("../utils/otp");
const { resetPassword } = require("../controllers/common/forgotPassword");

const commonRoute = express.Router();

commonRoute.post("/login-and-send-otp", loginAndSendOtp);
commonRoute.post("/verify-otp-and-generate-token", verifyOtpAndGenerateToken);
commonRoute.patch("/update", authMiddleware, updateUser);
commonRoute.patch("/send-otp", sendOTP);
commonRoute.patch("/verify-otp", verifyOTP);
commonRoute.patch("/forgot-password/reset-password", resetPassword);

module.exports = commonRoute;
