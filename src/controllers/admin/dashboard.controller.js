const CaseModel = require("../../models/caseModel");
const UserModel = require("../../models/userModel");
const BankModel = require("../../models/bankModel"); // Ensure this is correctly defined

const dashboardInfo = async (req, res) => {
  try {
    // For Users
    const usersData = await UserModel.aggregate([
      {
        $group: { _id: "$role", count: { $sum: 1 } },
      },
    ]);

    const totalUsers = usersData.reduce((sum, item) => sum + item.count, 0);

    // Structure the result to include both totalUsers and role breakdown
    const users = {
      totalUsers,
      role: usersData.reduce((acc, item) => {
        acc[item._id] = item.count; // Map role name to its count
        return acc;
      }, {}),
    };

    // For Cases
    const caseData = await CaseModel.aggregate([
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ]);

    const totalCases = caseData.reduce((sum, item) => sum + item.count, 0);

    // Structure the result to include both totalUsers and role breakdown
    const cases = {
      totalCases,
      status: caseData.reduce((acc, item) => {
        acc[item._id] = item.count; // Map role name to its count
        return acc;
      }, {}),
    };

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
        users,
        cases,
        banks,
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
};

module.exports = { dashboardInfo };
