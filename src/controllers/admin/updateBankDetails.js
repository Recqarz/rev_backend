const BankModel = require("../../models/bankModel");

const updateBankDetails = async (req, res) => {
  try {
    const bankId = req.params.id;
    if (!bankId) {
      return res.status(404).send({ error: "Oops! Please provide bank-id" });
    }

    const data = req.body;

    if (data?.IFSC) {
      const isAlreadyRegesteredBankWithIFSC = await BankModel.findOne({
        IFSC: data?.IFSC,
        _id: { $ne: bankId },  // Exclude the current bank from the search
      });
      if (isAlreadyRegesteredBankWithIFSC) {
        return res
          .status(400)
          .send({ error: "Oops! Already Bank registered with this IFSC" });
      }
    }

    const updateBank = await BankModel.findByIdAndUpdate(bankId, data, {
      new: true,
    });

    if (!updateBank) {
      return res.status(404).send({
        error: "Oops! Something went wrong while updating bank details!",
      });
    }

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
