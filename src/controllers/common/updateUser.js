const UserModel = require("../../models/userModel");
const { hashData } = require("../../utils/hasData");

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
    const protectedFields = ["_id", "userCode", "otpMobile", "otpEmail", "refreshToken"];

    // Add additional fields to protect if the user is not an admin
    if (req.user.role !== "admin") {
      protectedFields.push("workForBank", "modules", "isActive", "password");
    }

    // Remove protected fields from the userDetails object to prevent updating them
    protectedFields.forEach((field) => delete userDetails[field]);

    // Handle password update for admin
    if (req.user.role === "admin" && userDetails.password) {
      const user = await UserModel.findById(userId);
      if (user.password !== userDetails.password) {
        userDetails.password = await hashData(userDetails.password);
      } else {
        delete userDetails.password; // Do not update if the password is the same
      }
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
    return res
      .status(500)
      .send({ error: "An error occurred", details: error.message });
  }
};

module.exports = { updateUser };
