const express = require("express");
const {
  getFieldExecutiveAssignCase,
} = require("../controllers/field-executive/getAssignCases");
const {
  createFieldExecutiveForm,
} = require("../controllers/field-executive/createFieldExecutiveForm");

const fieldExecutiveRoute = express.Router();

fieldExecutiveRoute.get("/cases", getFieldExecutiveAssignCase);
fieldExecutiveRoute.post(
  "/cases/:id/property-details",
  createFieldExecutiveForm
);

module.exports = fieldExecutiveRoute;
