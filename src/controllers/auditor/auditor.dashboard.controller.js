const CaseModel = require("../../models/caseModel");
const UserModel = require("../../models/userModel");

const auditorDashboard = async (req, res) => {
  try {
    const auditorId = req?.user?._id;

    const auditor = await UserModel.findOne(
      { _id: auditorId },
      { workForBank: 1, _id: 0 }
    );

    if (!auditor || !auditor.workForBank.length) {
      return res.status(404).json({ message: "No associated banks found" });
    }


    // Fetch total field executives
    const userData = await UserModel.aggregate([
      { $match: { role: "fieldExecutive" } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    const totalFieldExecutive = userData.length ? userData[0].count : 0;

    // Fetch Cases where bankId matches auditor's workForBank
    const caseData = await CaseModel.aggregate([
      {
        $match: { bankId: { $in: auditor.workForBank } } // Filter cases linked to banks auditor works for
      },
      {
        $project: {
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$verifiedBy.auditor", true] }, then: "completed" },
                {
                  case: {
                    $and: [
                      { $eq: ["$verifiedBy.auditor", false] },
                      { $eq: ["$verifiedBy.fieldExecutive", true] }
                    ]
                  },
                  then: "process"
                }
              ],
              default: "pending"
            }
          }
        }
      },
      {
        $group: { _id: "$status", count: { $sum: 1 } }
      }
    ]);

    // Calculate total cases
    const totalCases = caseData.reduce((sum, item) => sum + item.count, 0);
    console.log("totalCases===>", totalCases);

    // Structure output
    const cases = {
      totalCases,
      status: caseData.reduce(
        (acc, item) => {
          acc[item._id] = item.count;
          return acc;
        },
        { pending: 0, process: 0, completed: 0 } // Default structure
      ),
    };

    return res.status(200).send({
      message: "Auditor dashboard data fetched!",
      data: {
        totalFieldExecutive,
        cases,
      },
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports = { auditorDashboard };
