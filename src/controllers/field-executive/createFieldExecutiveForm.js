const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");
const { uploadFileToS3 } = require("../../utils/aws");
const fs = require("fs");
const createFieldExecutiveForm = async (req, res) => {
  try {
    const caseId = req.params.id;
    const data = req.body;
    const { file, files } = req;

    if (!caseId) {
      return res.status(400).send({
        error: "Please Provide case-id",
      });
    }

    // Initialize a single consolidated object for all parsed data
    const consolidatedData = { caseId };

    // Parse each field and consolidate the parsed data
    Object.keys(data).forEach((key) => {
      let value = data[key];

      // Check if the value is a stringified JSON object or array
      if (
        typeof value === "string" &&
        (value.startsWith("{") || value.startsWith("["))
      ) {
        try {
          // Parse the stringified JSON
          consolidatedData[key] = JSON.parse(value);
        } catch (error) {
          console.error(`Error parsing value for key ${key}: ${value}`);
          // If parsing fails, keep the original value
          consolidatedData[key] = value;
        }
      } else {
        // If it's not a JSON string, add it directly
        consolidatedData[key] = value;
      }
    });

    // Log the consolidated data object
    // console.log("Consolidated Data:", consolidatedData);

    // console.log("file=", file, "files=", files);

    if (files.length > 0) {
      const uploadPromises = files.map(async (ele) => {
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

    return res.status(200).send({ message: "success", data: newData });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
};

module.exports = { createFieldExecutiveForm };
