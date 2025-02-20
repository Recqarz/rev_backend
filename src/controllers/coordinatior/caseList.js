const CaseModel = require("../../models/caseModel");
const UserModel = require("../../models/userModel");

const caseList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      state,
      district,
      zone,
      search = "",
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (state) filter.state = state;
    if (district) filter.district = district;
    if (zone) filter.zone = zone;

    // Building the search query
    const searchQuery = search
      ? {
          $or: [
            { caseCode: { $regex: search, $options: "i" } },
            { bankRefNo: { $regex: search, $options: "i" } },
            { clientName: { $regex: search, $options: "i" } },
            { BOV_ReportNo: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Combining filter and search queries
    const query = { ...filter, ...searchQuery };

    // Fetching users with pagination, filtering, and search
    const allCases = await CaseModel.find(query)
      .populate([
        { path: "bankId", select: "bankName branchName" },
        {
          path: "fieldExecutiveId",
          select: "firstName lastName email mobile userCode",
        },
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
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Getting the total number of users for pagination
    const count = await CaseModel.countDocuments(query);

    return res.status(200).send({
      message: "All cases have been fetched!",
      totalCase: count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
      cases: allCases,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { caseList };
