const express = require("express");
const {
  loginAndSendOtp,
  verifyOtpAndGenerateToken,
} = require("../controllers/common/userLogin");
const { updateUser } = require("../controllers/common/updateUser");
const authMiddleware = require("../middlewares/authMiddleware");
const { sendOTP, verifyOTP } = require("../utils/otp");
const { resetPassword } = require("../controllers/common/forgotPassword");
const {
  getProfileDetails,
} = require("../controllers/common/getProfileDetails");
const {
  updateProfilePicture,
} = require("../controllers/common/updateProfilePicture");
const { upload } = require("../middlewares/multer.middleware");

const commonRoute = express.Router();

commonRoute.get("/details", authMiddleware, getProfileDetails);
commonRoute.post("/login-and-send-otp", loginAndSendOtp);
commonRoute.post("/verify-otp-and-generate-token", verifyOtpAndGenerateToken);
commonRoute.patch("/update", authMiddleware, updateUser);
commonRoute.patch(
  "/update-profile-picture",
  authMiddleware,
  upload.single("avatar"),
  updateProfilePicture
);
commonRoute.post("/send-otp", sendOTP);
commonRoute.post("/verify-otp", verifyOTP);
commonRoute.patch("/forgot-password/reset-password", resetPassword);

module.exports = commonRoute;
