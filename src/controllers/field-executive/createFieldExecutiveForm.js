const CaseModel = require("../../models/caseModel");
const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");
const { uploadFileToS3 } = require("../../utils/aws");
const fs = require("fs");
const createFieldExecutiveForm = async (req, res) => {
  try {
    const caseId = req.params.id;
    const data = req.body;
    const { files } = req;

    if (!files?.images) {
      return res.status(400).send({
        error: "Please provide Property images",
      });
    }
    if (!files?.fieldExecutiveSpotImage) {
      return res.status(400).send({
        error: "Please provide field executive spot image",
      });
    }

    if (!caseId) {
      return res.status(400).send({
        error: "Please Provide case-id",
      });
    }

    const isAlreadyAvailabeFormData = await PropertyDetailsModel.findOne({
      caseId,
    });
    if (isAlreadyAvailabeFormData) {
      fs.unlinkSync(files?.fieldExecutiveSpotImage[0].path);
      files?.images?.map((ele) => {
        fs.unlinkSync(ele.path); // Remove file after upload
      });
      return res.status(400).send({
        error: "Already you have filled the form data!",
      });
    }

    // Initialize a single consolidated object for all parsed data
    const consolidatedData = { caseId };

    // Parse each field and consolidate the parsed data
    for (const key of Object.keys(data)) {
      const value = data[key];

      if (
        typeof value === "string" &&
        (value.startsWith("{") || value.startsWith("["))
      ) {
        try {
          consolidatedData[key] = JSON.parse(value);
        } catch (error) {
          // Collect the error and break the loop
          return res.status(400).send({
            error: `Error parsing value for key '${key}': ${value}`,
          });
        }
      } else {
        consolidatedData[key] = value;
      }
    }

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

    if (files?.images.length > 0) {
      const uploadPromises = files?.images.map(async (ele) => {
        try {
          const s3URL = await uploadFileToS3(ele.path, ele.originalname);

          fs.unlinkSync(ele.path); // Remove file after upload
          return s3URL.Location;
        } catch (error) {
          console.error("Error uploading file:", error);
          throw error;
        }
      });

      try {
        const s3URLs = await Promise.all(uploadPromises);
        consolidatedData.images = s3URLs; // Add all URLs to the images array
      } catch (error) {
        return res.status(400).send({ error: "File upload failed." });
      }
    }

    // Save the consolidated data to the database
    const newData = await PropertyDetailsModel.create(consolidatedData);
    await newData.save();

    const updatedCase = await CaseModel.findByIdAndUpdate(
      caseId,
      {
        "verifiedBy.fieldExecutive": true,
      },
      { new: true }
    );
    if (!updatedCase) {
      return res.status(404).send({ error: "Case not found or not updated" });
    }


    return res.status(200).send({ message: "success", data: newData });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
};

module.exports = { createFieldExecutiveForm };
