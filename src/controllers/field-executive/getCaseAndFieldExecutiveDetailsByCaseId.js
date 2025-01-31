const CaseModel = require("../../models/caseModel");
const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");

const getCaseAndFieldExecutiveDetailsByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!caseId) {
      return res.status(400).send({ error: "Please provide case-id" });
    }

    const caseData = await CaseModel.findById(caseId);
    if (!caseData) {
      return res
        .status(400)
        .send({ error: "Oops! case is not availabe with this case-id" });
    }
    const fieldExecutiveData =
      (await PropertyDetailsModel.findOne({ caseId })) || null;

    return res.status(200).send({
      message: "fetched case field executive!",
      data: {
        caseData,
        fieldExecutiveData,
      },
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};
module.exports = { getCaseAndFieldExecutiveDetailsByCaseId };
