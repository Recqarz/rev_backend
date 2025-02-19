const mongoose = require("mongoose");
const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");

const getSupervisorCase = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "" } = req.query;
    const workForBank = req.user.workForBank; // Array of allowed bankIds

    const data = await PropertyDetailsModel.aggregate([
      // Populate caseId to get bankId
      {
        $lookup: {
          from: "cases", // Ensure this is the correct collection name
          localField: "caseId",
          foreignField: "_id",
          as: "caseData",
        },
      },
      { $unwind: "$caseData" }, // Convert caseData array to an object

      // Filter cases where bankId is in workForBank
      {
        $match: {
          "caseData.bankId": { $in: workForBank },
        },
      },

      // Project case and full property details
      {
        $project: {
          case: "$caseData", // Include full case data
          propertyDetails: "$$ROOT", // Include all property details
        },
      },

      // Pagination
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).send({ message: "Data fetched successfully", data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { getSupervisorCase };
