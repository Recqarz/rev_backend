const UserModel = require("../../models/userModel");
const { checkPasswordRegex } = require("../../utils/checkPasswordRegex");
const { hashData } = require("../../utils/hasData");

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

    // check password regex for uper, lower, number, special char and min langth 8
    if (!checkPasswordRegex(password)) {
      return res.status(400).send({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long",
      });
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

module.exports = { resetPassword };
