const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");
const { uploadFileToS3 } = require("../../utils/aws");
const fs = require("fs");
const updateFieldExecutiveForm = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { files } = req;

    if (!id) {
      return res.status(400).send({ error: "Please provide form-id" });
    }

    const consolidatedData = {};

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

    // If File is available then upload the file

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
        return res
          .status(400)
          .send({ error: `File upload failed. ${error.message}` });
      }
    }

    // Update the form in the database
    const updatedForm = await PropertyDetailsModel.findByIdAndUpdate(
      id,
      consolidatedData,
      { new: true }
    );
    // Send consolidated data as a response
    return res.status(200).send({
      message: "Updated successfully!",
      updatedForm,
    });
  } catch (error) {
    // Catch unexpected errors
    return res
      .status(500)
      .send({ error: "Internal server error: " + error.message });
  }
};

module.exports = { updateFieldExecutiveForm };
