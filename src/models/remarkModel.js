const mongoose = require("mongoose");

const remarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: true,
  },
  caseId: {
    type: mongoose.Schema.ObjectId,
    ref: "cases",
    required: true,
  },
});

const RemarkModel = mongoose.model("remarks", remarkSchema);

module.exports = remarkSchema;
