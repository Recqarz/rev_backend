const mongoose = require("mongoose");
const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");
const CaseModel = require("../../models/caseModel");

const getSupervisorCase = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status = "process",
      verifiedByFieldExecutive,
      search = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const workForBank = req.user?.workForBank || []; // Ensure it's an array

    if (!Array.isArray(workForBank) || workForBank.length === 0) {
      return res.status(400).send({ error: "No valid banks assigned to user." });
    }

    const filter = { status, bankId: { $in: workForBank } };

    // Ensure verifiedBy.fieldExecutive filtering works correctly
    if (verifiedByFieldExecutive === "true") {
      filter["verifiedBy.fieldExecutive"] = true;
    } else if (verifiedByFieldExecutive === "false") {
      filter["verifiedBy.fieldExecutive"] = false;
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
      message: "Data fetched successfully",
      pagination: {
        totalCases,
        currentPage: page,
        totalPages: Math.ceil(totalCases / limit),
      },
      cases,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { getSupervisorCase };
