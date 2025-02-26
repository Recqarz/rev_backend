const CaseModel = require("../../models/caseModel");

const getAllAuditorCases = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status = "process",
      verifiedByFieldExecutive,
      verifiedBySupervisor,
      search = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const workForBank = req.user?.workForBank || []; // Ensure it's an array

    if (!Array.isArray(workForBank) || workForBank.length === 0) {
      return res
        .status(400)
        .send({ error: "No valid banks assigned to user." });
    }

    const filter = { bankId: { $in: workForBank } };
    if (status) filter.status = status;

    // Ensure verifiedBy.fieldExecutive filtering works correctly
    if (verifiedByFieldExecutive === "true") {
      filter["verifiedBy.fieldExecutive"] = true;
    } else if (verifiedByFieldExecutive === "false") {
      filter["verifiedBy.fieldExecutive"] = false;
    }

    if (verifiedBySupervisor === "true") {
      filter["verifiedBy.supervisor"] = true;
    } else if (verifiedBySupervisor === "false") {
      filter["verifiedBy.supervisor"] = false;
    }

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

    // Query to find matching cases
    const cases = await CaseModel.find({
      ...filter,
      ...searchQuery,
    })
      .populate([
        { path: "bankId", select: "bankName branchName IFSC" },
        { path: "zone", select: "name" },
        { path: "district", select: "name" },
        { path: "state", select: "name" },
        {
          path: "fieldExecutiveId",
          select: "firstName lastName mobile email role",
        },
      ])
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ "verifiedBy.fieldExecutive": -1 });

    const totalCases = await CaseModel.countDocuments({
      ...filter,
      ...searchQuery,
    });

    res.status(200).send({
      message: "All data fetched successfully",
      pagination: {
        totalCases,
        currentPage: page,
        totalPages: Math.ceil(totalCases / limit),
      },
      cases,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAllAuditorCases };
