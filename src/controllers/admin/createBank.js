const BankModel = require("../../models/bankModel");

const createBank = async (req, res) => {
  try {
    const { bankName, branchName, IFSC, address } = req.body;

    if (!bankName || !branchName || !IFSC) {
      return res
        .status(404)
        .send({ error: "bank-name, branch-name and IFSC is required" });
    }

    const isAlreadyRegesteredBankWithIFSC = await BankModel.findOne({ IFSC });
    if (isAlreadyRegesteredBankWithIFSC) {
      return res
        .status(400)
        .send({ error: "Oops! Already Bank registred with this IFSC" });
    }

    const newBank = await BankModel.create({
      bankName,
      branchName,
      IFSC,
      address,
    });

    if (!newBank) {
      return res.status(400).send({
        error:
          "Oops! Somthing went wrong while creating bank please try again!",
      });
    }

    await newBank.save();

    return res.status(200).send({ message: "Your bank has been created!" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { createBank };
