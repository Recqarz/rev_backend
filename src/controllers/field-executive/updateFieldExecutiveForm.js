const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");
const { uploadFileToS3 } = require("../../utils/aws");
const fs = require("fs");

const updateFieldExecutiveForm = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { files } = req;

    // console.log("files======)", files);

    if (!id) {
      return res.status(400).send({ error: "Please provide form-id" });
    }

    const consolidatedData = {};
    const parsingErrors = [];

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (
        typeof value === "string" &&
        (value.startsWith("{") || value.startsWith("["))
      ) {
        try {
          consolidatedData[key] = JSON.parse(value);
        } catch (error) {
          parsingErrors.push(`Error parsing key '${key}': ${error.message}`);
        }
      } else {
        consolidatedData[key] = value;
      }
    });
    if (parsingErrors.length > 0) {
      return res.status(400).send({ errors: parsingErrors });
    }
    if (files?.fieldExecutiveSpotImage) {
      // uploading field-executive-spot-image;
      const s3BucketURL = await uploadFileToS3(
        files?.fieldExecutiveSpotImage[0].path,
        files?.fieldExecutiveSpotImage[0].originalname
      );
      fs.unlinkSync(files?.fieldExecutiveSpotImage[0].path); // Use async unlink

      if (!s3BucketURL) {
        return res.status(404).send({
          error:
            "Something went wrong uploading Field-executive-spot-image on AWS S3",
        });
      }
      consolidatedData.fieldExecutiveSpotImage = s3BucketURL.Location; // Add the URL to the fieldExecutiveSpotImage field
    }

    // If files are available, upload them
    if (files?.images?.length > 0) {
      const uploadPromises = files?.images.map(async (ele) => {
        try {
          const s3URL = await uploadFileToS3(ele.path, ele.originalname);
          fs.unlinkSync(ele.path); // Use async unlink
          return s3URL.Location;
        } catch (error) {
          console.error(`Error uploading file ${ele.originalname}:`, error);
          throw error;
        }
      });

      try {
        const s3URLs = await Promise.all(uploadPromises);
        consolidatedData.images = [
          ...(Array.isArray(consolidatedData.images)
            ? consolidatedData.images
            : []),
          ...s3URLs,
        ];
      } catch (error) {
        return res
          .status(400)
          .send({ error: `File upload failed. ${error.message}` });
      }
    }

    // Update the form in the database
    const updatedForm = await PropertyDetailsModel.findByIdAndUpdate(
      id,
      consolidatedData,
      {
        new: true,
      }
    );

    if (!updatedForm) {
      return res
        .status(404)
        .send({ error: "Form-data not found. Please check _id" });
    }

    return res.status(200).send({
      message: "Updated successfully!",
      updatedForm,
    });
  } catch (error) {
    // console.log("error====>",error)
    return res
      .status(500)
      .send({ error: "Internal server error: " + error.message });
  }
};

module.exports = { updateFieldExecutiveForm };
