const CaseModel = require("../../models/caseModel");

const addCase = async (req, res) => {
  try {
    const {
      bankId,
      bankRefNo,
      clientName,
      BOV_ReportNo,
      clientAddress,
      zone,
      contactNo,
      visitDate,
    } = req.body;

    if (
      !bankId ||
      !bankRefNo ||
      !clientName ||
      !BOV_ReportNo ||
      !clientAddress ||
      !zone ||
      !contactNo ||
      !visitDate
    ) {
      return res
        .status(400)
        .send({ error: "Oops! Please fill all required fields!" });
    }

    // Case code creation
    const allCase = await CaseModel.find();
    const newCaseNumber = allCase.length
      ? Number(allCase[allCase.length - 1].caseCode.split("_")[1]) + 1
      : 1;
    const caseCode = `CS_${String(newCaseNumber).padStart(4, "0")}`;

    const data = {
      bankId,
      bankRefNo,
      clientName,
      BOV_ReportNo,
      clientAddress,
      zone,
      contactNo,
      visitDate,
      caseCode,
      coordinatorId: req.user._id,
    };

    const newCase = await CaseModel.create(data);
    if (!newCase) {
      return res.status(400).send({ error: "Oops. Case not created!" });
    }
    await newCase.save();
    return res.status(200).send({ message: "Case created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error?.message });
  }
};

module.exports = { addCase };
