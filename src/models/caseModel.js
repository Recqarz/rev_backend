const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
    
});

const CaseModel = mongoose.model("cases", caseSchema);

module.exports = CaseModel;
