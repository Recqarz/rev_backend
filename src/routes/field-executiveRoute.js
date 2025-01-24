const express = require("express");
const {
  getFieldExecutiveAssignCase,
} = require("../controllers/field-executive/getAssignCases");
const {
  createFieldExecutiveForm,
} = require("../controllers/field-executive/createFieldExecutiveForm");
const { upload } = require("../middlewares/multer.middleware");

const fieldExecutiveRoute = express.Router();

fieldExecutiveRoute.get("/cases", getFieldExecutiveAssignCase);
fieldExecutiveRoute.post(
  "/cases/:id/property-details",
  upload.array("images"),
  createFieldExecutiveForm
);

module.exports = fieldExecutiveRoute;
