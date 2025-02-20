const {
  RekognitionClient,
  CompareFacesCommand,
} = require("@aws-sdk/client-rekognition");
const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION, // Replace with your region
  //   credentials: fromIni({ profile: "your-profile" }), // Optional: if you're using AWS CLI profile for credentials
});
const UserModel = require("../../models/userModel");
const { uploadFileToS3 } = require("../../utils/aws");
const fs = require("fs");

const verifyFace = async (req, res) => {
  const { file } = req; // Assuming the uploaded file is coming in the request
  try {
    const userId = req.user._id;
    if (!file) {
      return res
        .status(404)
        .send({ message: "Please send the image to verify!" });
    }

    if (!userId) {
      return res.status(404).send({ error: "User ID is missing!" });
    }

    // Retrieve the current avatar URL stored in the user's profile
    const user = await UserModel.findById(userId).select("avatar");
    const storedAvatarURL = user?.avatar;

    if (!storedAvatarURL) {
      return res.status(404).send({ error: "User avatar not found!" });
    }

    // Upload the new image to S3 for face comparison
    const s3URL = await uploadFileToS3(file?.path, file?.originalname);
    if (!s3URL) {
      return res.status(404).send({
        error: "Something went wrong uploading the image to AWS S3",
      });
    }
    // console.log("=====s3URL===", s3URL);
    // Perform face comparison using AWS Rekognition
    const params = {
      SourceImage: {
        S3Object: {
          Bucket: process.env.AWS_S3_BUCKET_NAME, // Replace with your S3 bucket name
          Name: storedAvatarURL.split("/").pop(), // Extract file name from the avatar URL
        },
      },
      TargetImage: {
        S3Object: {
          Bucket: process.env.AWS_S3_BUCKET_NAME, // Replace with your S3 bucket name
          Name: s3URL.Location.split("/").pop(), // Extract file name from the uploaded image URL
        },
      },
      SimilarityThreshold: 80, // Set threshold for face matching
    };

    const command = new CompareFacesCommand(params);
    const response = await rekognitionClient.send(command);

    if (response.FaceMatches.length > 0) {
      // Faces matched successfully
      fs.unlinkSync(file?.path); // Use async unlink
      return res.status(200).send({
        message: "Face verification successful! Faces matched.",
      });
    } else {
      fs.unlinkSync(file?.path); // Use async unlink
      return res.status(400).send({
        error: "Face verification failed. No matching faces found.",
      });
    }
  } catch (error) {
    fs.unlinkSync(file?.path); // Use async unlink
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { verifyFace };
