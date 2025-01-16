const BankModel = require("../../models/bankModel");

const getAllBank = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Building the search query
    const searchQuery = search
      ? {
          $or: [
            { bankName: { $regex: search, $options: "i" } },
            { branchName: { $regex: search, $options: "i" } },
            { IFSC: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const allBanks = await BankModel.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Getting the total number of bank for pagination
    const count = await BankModel.countDocuments(searchQuery);

    return res.status(200).send({
      message: "All banks has been fetched!",
      totalBank: count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
      banks: allBanks,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { getAllBank };
