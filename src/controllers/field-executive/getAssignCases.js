const CaseModel = require("../../models/caseModel");

const getFieldExecutiveAssignCase = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "" } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Building the search query
    const searchQuery = search
      ? {
          $or: [
            { caseCode: { $regex: search, $options: "i" } },
            { zone: { $regex: search, $options: "i" } },
            { bankRefNo: { $regex: search, $options: "i" } },
            { clientName: { $regex: search, $options: "i" } },
            { BOV_ReportNo: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Combining filter and search queries
    const query = { fieldExecutiveId: req.user._id, ...filter, ...searchQuery };

    const allAssignCases = await CaseModel.find(query)
      .populate([
        {
          path: "state",
          select: "name",
        },
        {
          path: "district",
          select: "name",
        },
        {
          path: "zone",
          select: "name",
        },
      ])
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .send({ message: "fetched all cases******!", data: allAssignCases });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};
module.exports = { getFieldExecutiveAssignCase };
