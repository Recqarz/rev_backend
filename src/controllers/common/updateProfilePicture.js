const UserModel = require("../../models/userModel");
const { uploadFileToS3 } = require("../../utils/aws");
const fs = require("fs");
const updateProfilePicture = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(404).send({ message: "Please send profile picture!" });
    }

    const userId = req.user._id;
    if (!userId) {
      return res.status(404).send({ error: "user-id is missing!" });
    }

    // upload profile picture on AWS S3 bucket!
    const s3URL = await uploadFileToS3(file.path, file.originalname);
    fs.unlinkSync(file.path); // Use async unlink

    if (!s3URL) {
      return res.status(404).send({
        error: "Something went wrong uploading profile picture on AWS S3",
      });
    }

    // console.log(s3URL.Location);

    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: s3URL?.Location,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).send({
        error: "Oops! Somthing went wrong while updating user profile picture!",
      });
    }
    return res.status(200).send({
      message: "User profile picture has been updated successfully!",
      avatar: s3URL?.Location,
    });
  } catch (error) {
    return res.status(404).send({ error: error?.message });
  }
};

module.exports = { updateProfilePicture };
