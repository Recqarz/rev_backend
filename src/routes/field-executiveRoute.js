const express = require("express");
const {
  getFieldExecutiveAssignCase,
} = require("../controllers/field-executive/getAssignCases");
const {
  createFieldExecutiveForm,
} = require("../controllers/field-executive/createFieldExecutiveForm");
const { upload } = require("../middlewares/multer.middleware");
const { getCaseAndFieldExecutiveDetailsByCaseId } = require("../controllers/field-executive/getCaseAndFieldExecutiveDetailsByCaseId");

const fieldExecutiveRoute = express.Router();

fieldExecutiveRoute.get("/cases/list", getFieldExecutiveAssignCase);
fieldExecutiveRoute.get("/case-fieldExecutive/:caseId", getCaseAndFieldExecutiveDetailsByCaseId);


fieldExecutiveRoute.post(
  "/cases/:id/property-details/create",
  upload.array("images"),
  createFieldExecutiveForm
);

module.exports = fieldExecutiveRoute;
