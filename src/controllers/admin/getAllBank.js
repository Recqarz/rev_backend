const BankModel = require("../../models/bankModel");

const getAllBank = async (req, res) => {
  try {
    const allBanks = await BankModel.find();
    return res
      .status(200)
      .send({
        message: "All banks has been fetched!",
        data: { banks: allBanks },
      });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { getAllBank };
