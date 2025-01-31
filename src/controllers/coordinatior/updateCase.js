const CaseModel = require("../../models/caseModel");

const updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseDetails = { ...req.body };

    // Define fields that should not be updated under any circumstances
    const protectedFields = ["_id", "caseCode", "coordinatorId", "createdAt"];

    // Remove protected fields from the userDetails object to prevent updating them
    protectedFields.forEach((field) => delete caseDetails[field]);

    if (!caseId) {
      return res.status(404).send({ error: "Please provide case id!" });
    }

    const updatedCase = await CaseModel.findByIdAndUpdate(caseId, caseDetails, {
      new: true,
    });
    if (!updatedCase) {
      return res
        .status(404)
        .send({ error: "Oops! somthing went wrong while updating case!" });
    }
    return res.status(200).send({
      message: "Case has been updated successfully!",
      updatedCase,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { updateCase };
