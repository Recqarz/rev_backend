const UserModel = require("../../models/userModel");
const { checkPasswordRegex } = require("../../utils/checkPasswordRegex");
const { hashData } = require("../../utils/hasData");
const { checkMobileRegex } = require("../../utils/regex");

// Controller to update user details
const updateUser = async (req, res) => {
  try {
    // Get the user ID from request parameters or the authenticated user
    const userId = req.params.id || req.user._id;
    if (!userId) {
      return res.status(404).send({ error: "Oops! user-id is missing!" });
    }

    // Create a copy of the request body to avoid modifying the original request data
    const userDetails = { ...req.body };

    // Define fields that should not be updated under any circumstances
    const protectedFields = [
      "_id",
      "userCode",
      "otpMobile",
      "otpEmail",
      "refreshToken",
    ];

    // Add additional fields to protect if the user is not an admin
    if (req.user.role !== "admin") {
      protectedFields.push(
        "workForBank",
        "modules",
        "isActive",
        "password",
        "role"
      );
    }

    // Remove protected fields from the userDetails object to prevent updating them
    protectedFields.forEach((field) => delete userDetails[field]);

    // Handle password update for admin
    if (req.user.role === "admin" && userDetails.password) {
      const user = await UserModel.findById(userId);
      if (user.password !== userDetails.password) {
        // check password regex for uper, lower, number, special char and min langth 8
        if (!checkPasswordRegex(userDetails.password)) {
          return res.status(400).send({
            error:
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long",
          });
        }

        // Hash the new password before updating the user document
        userDetails.password = await hashData(userDetails.password);
      } else {
        delete userDetails.password; // Do not update if the password is the same
      }
    }

    if (!checkMobileRegex(userDetails.mobile)) {
      return res
        .status(400)
        .send({ error: "Please enter a valid mobile number" });
    }

    // Update the user document in the database with the remaining fields
    const updatedUserDetails = await UserModel.findByIdAndUpdate(
      userId,
      userDetails,
      { new: true }
    ).select("-password"); // Exclude the password field from the response

    // Send a success response with the updated user details
    return res.status(200).send({
      message: "User has been updated!",
      data: {
        updatedUserDetails,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { updateUser };
