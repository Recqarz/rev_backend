const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file to S3 using @aws-sdk/lib-storage
 * @param {string} filePath - Path to the local file
 * @param {string} originalName - Original file name
 */
const uploadFileToS3 = async (filePath, originalName) => {
  const fileStream = fs.createReadStream(filePath);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_${originalName}`,
    Body: fileStream,
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params,
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
    });

    const response = await upload.done();
    console.log("File successfully uploaded:");
    // console.log("File successfully uploaded:", response);
    return response;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw err;
  }
};

module.exports = { uploadFileToS3 };
