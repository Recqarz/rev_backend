const mongoose = require("mongoose");

const propertyDetailsSchema = new mongoose.Schema({
    
});

const PropertyDetailsModel = mongoose.model(
  "propertyDetails",
  propertyDetailsSchema
);

module.exports = PropertyDetailsModel;
