const getProfileDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Populate referenced fields (modify as needed)
    const populatedUser = await req.user.populate([
      { path: "workForBank", select: "bankName branchName IFSC" },
    ]);

    // Clone the data from the populated user document
    let data = { ...populatedUser._doc };

    // List of fields to remove
    const fieldsToRemove = [
      "password",
      "otp",
      "modules",
      "isActive",
      "refreshToken",
    ];

    // Remove the specified fields
    fieldsToRemove.forEach((field) => delete data[field]);

    return res.status(200).send({
      message: "User profile details fetched successfully!",
      data,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { getProfileDetails };
