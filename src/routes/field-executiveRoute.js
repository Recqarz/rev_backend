const express = require("express");
const {
  getFieldExecutiveAssignCase,
} = require("../controllers/field-executive/getAssignCases");

const fieldExecutiveRoute = express.Router();

fieldExecutiveRoute.get("/cases", getFieldExecutiveAssignCase);

module.exports = fieldExecutiveRoute;
