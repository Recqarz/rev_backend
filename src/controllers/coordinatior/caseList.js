const CaseModel = require("../../models/caseModel");
const UserModel = require("../../models/userModel");

const caseList = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, zone, search = "" } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (zone) {
      filter.zone = zone;
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
    const query = { ...filter, ...searchQuery };

    // Fetching users with pagination, filtering, and search
    const allCases = await CaseModel.find(query)
      .populate({
        path: "bankId",
        select: "bankName branchName", // Example: Select specific fields from the populated document
      })
      .populate({
        path: "fieldExecutiveId",
        select: "firstName lastName email mobile userCode ", // Example: Select specific fields from the populated document
      })
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
