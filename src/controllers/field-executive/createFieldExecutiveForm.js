const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");

const createFieldExecutiveForm = async (req, res) => {
  try {
    const caseId = req.params.id;
    const data = req.body;
    if (!caseId) {
      return res.status(400).send({
        error: "Please Provide case-id",
      });
    }

    const newData = await PropertyDetailsModel.create(data);
    await newData.save();

    return res.status(200).send({ message: "success", caseId });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
};

module.exports = { createFieldExecutiveForm };
