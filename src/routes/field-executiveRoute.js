const express = require("express");
const {
  getFieldExecutiveAssignCase,
} = require("../controllers/field-executive/getAssignCases");
const {
  createFieldExecutiveForm,
} = require("../controllers/field-executive/createFieldExecutiveForm");
const { upload } = require("../middlewares/multer.middleware");
const {
  getCaseAndFieldExecutiveDetailsByCaseId,
} = require("../controllers/field-executive/getCaseAndFieldExecutiveDetailsByCaseId");
const {
  updateFieldExecutiveForm,
} = require("../controllers/field-executive/updateFieldExecutiveForm");

const fieldExecutiveRoute = express.Router();

fieldExecutiveRoute.get("/cases/list", getFieldExecutiveAssignCase);
fieldExecutiveRoute.get(
  "/case-fieldExecutive/:caseId",
  getCaseAndFieldExecutiveDetailsByCaseId
);

// create field-executive form-data
fieldExecutiveRoute.post(
  "/cases/:id/property-details/create",
  upload.array("images"),
  createFieldExecutiveForm
);
// update field-executive form-data
fieldExecutiveRoute.patch(
  "/cases/:id/property-details/update",
  upload.array("images"),
  updateFieldExecutiveForm
);

module.exports = fieldExecutiveRoute;
