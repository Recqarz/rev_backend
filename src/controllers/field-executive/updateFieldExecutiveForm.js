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
    const parsingErrors = [];

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
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

    // If files are available, upload them
    if (files?.length > 0) {
      const uploadPromises = files.map(async (ele) => {
        try {
          const s3URL = await uploadFileToS3(ele.path, ele.originalname);
          await fs.promises.unlink(ele.path); // Use async unlink
          return s3URL.Location;
        } catch (error) {
          console.error(`Error uploading file ${ele.originalname}:`, error);
          throw error;
        }
      });

      try {
        const s3URLs = await Promise.all(uploadPromises);
        consolidatedData.images = [
          ...(Array.isArray(consolidatedData.images) ? consolidatedData.images : []),
          ...s3URLs,
        ];
      } catch (error) {
        return res.status(400).send({ error: `File upload failed. ${error.message}` });
      }
    }

    // Update the form in the database
    const updatedForm = await PropertyDetailsModel.findByIdAndUpdate(id, consolidatedData, {
      new: true,
    });

    if (!updatedForm) {
      return res.status(404).send({ error: "Form-data not found. Please check _id" });
    }

    return res.status(200).send({
      message: "Updated successfully!",
      updatedForm,
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error: " + error.message });
  }
};

module.exports = { updateFieldExecutiveForm };
