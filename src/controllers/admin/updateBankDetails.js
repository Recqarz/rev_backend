const BankModel = require("../../models/bankModel");

const updateBankDetails = async (req, res) => {
  try {
    const bankId = req.params.id;
    if (!bankId) {
      return res.status(404).send({ error: "Oops! Please provide bank-id" });
    }
    // const { bankName, branchName, IFSC, address } = req.body;
    const data = req.body;

    if (data?.IFSC) {
      const isAlreadyRegesteredBankWithIFSC = await BankModel.findOne({
        IFSC: data?.IFSC,
      });
      if (isAlreadyRegesteredBankWithIFSC) {
        return res
          .status(400)
          .send({ error: "Oops! Already Bank registred with this IFSC" });
      }
    }

    const updateBank = await BankModel.findByIdAndUpdate(bankId, data, {
      new: true,
    });

    if (!updateBank) {
      return res.status(404).send({
        error: "Oops! Somthing went wrong while updating bank details!",
      });
    }

    // console.log(updateBank);

    return res.status(200).send({
      message: "Bank has been updated",
      data: {
        bankdetails: updateBank,
      },
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { updateBankDetails };
