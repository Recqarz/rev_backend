const CaseModel = require("../../models/caseModel");

const getCaseById = async (req, res) => {
  try {
    const caseId = req.params.id;
    if (!caseId) {
      return res.status(404).send({ error: "Please provide case id!" });
    }

    const caseDetails = await CaseModel.findById(caseId);
    if (!caseDetails) {
      return res.status(404).send({ error: "Case not found!" });
    }
    return res.status(200).send({ data: caseDetails });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { getCaseById };
