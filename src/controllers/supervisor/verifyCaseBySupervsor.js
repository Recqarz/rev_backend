const CaseModel = require("../../models/caseModel");

const verifyCaseBySupervsor = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const { caseId } = req.params;
    if (!userId) {
      return res.status(400).send({ error: "Please provide user-id" });
    }
    if (!caseId) {
      return res.status(400).send({ error: "Please provide case-id" });
    }

    const updatedCase = await CaseModel.findByIdAndUpdate(
      caseId,
      {
        supervisorId: userId,
        "verifiedBy.supervisor": true,
      },
      { new: true }
    );
    if (!updatedCase) {
      return res.status(404).send({ error: "Case not found or not updated" });
    }
    return res
      .status(200)
      .send({ message: "Case updated successfully!", updatedCase });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = verifyCaseBySupervsor;
