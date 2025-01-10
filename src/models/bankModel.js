const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    IFSC: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    address: {
      street: {
        type: String,
        default: "",
      },
      pinCode: {
        type: Number,
        default: null,
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "India",
      },
    },
  },
  { timestamps: true }
);

const BankModel = mongoose.model("banks", bankSchema);

module.exports = BankModel;
