const BankModel = require("../../models/bankModel");
const CaseModel = require("../../models/caseModel");
const UserModel = require("../../models/userModel");

const coordinatorDashboardData = async (req, res) => {
  try {
    // For Users
    const usersData = await UserModel.aggregate([
      {
        $match: { role: "fieldExecutive" }, // Filter only "fieldExecutive" users
      },
      {
        $group: {
          _id: null, // Group all fieldExecutives together
          count: { $sum: 1 }, // Count total fieldExecutives
        },
      },
    ]);

    const totalFieldExecutive = usersData.reduce(
      (sum, item) => sum + item.count,
      0
    );

    // For Cases
    const caseData = await CaseModel.aggregate([
      {
        $match: { coordinatorId: req?.user?._id }, // Filter only "fieldExecutive" users
      },
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ]);

    const totalCases = caseData.reduce((sum, item) => sum + item.count, 0);

    // Structure the result to include both totalUsers and role breakdown
    const cases = {
      totalCases,
      status: caseData.reduce(
        (acc, item) => {
          acc[item._id] = item.count; // Map role name to its count
          return acc;
        },
        { pending: 0, completed: 0, rejected: 0 }
      ),
    };

    //For Bank

    // For Bank
    const bankData = await BankModel.aggregate([
      {
        $group: { _id: "$_id", count: { $sum: 1 } },
      },
    ]);
    const totalBanks = bankData.reduce((sum, item) => sum + item.count, 0);
    const banks = {
      totalBanks,
    };

    return res.status(200).send({
      message: "Dashboard data fetched!",
      data: {
        totalFieldExecutive,
        cases,
        banks,
      },
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { coordinatorDashboardData };
