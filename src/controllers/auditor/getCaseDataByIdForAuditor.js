const CaseModel = require("../../models/caseModel");
const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");

const getCaseDataByIdForAuditor = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await CaseModel.findById(caseId).populate([
      { path: "bankId", select: "bankName branchName IFSC" },
      { path: "zone", select: "name" },
      { path: "district", select: "name" },
      { path: "state", select: "name" },
      {
        path: "fieldExecutiveId",
        select: "firstName lastName mobile email role",
      },
    ]);
    if (!caseData) {
      return res.status(404).send({ error: "Case not found" });
    }

    // Get field executive form data by case-id
    const PropertyDetails = await PropertyDetailsModel.findOne({
      caseId,
    });

    if (!PropertyDetails) {
      return res.status(404).send({ error: "Property details not found" });
    }

    return res.status(200).send({
      message: "Data fetched successfully",
      caseData,
      PropertyDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};


module.exports = {getCaseDataByIdForAuditor};


