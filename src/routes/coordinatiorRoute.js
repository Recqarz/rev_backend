const express = require("express");
const { addCase } = require("../controllers/coordinatior/addCase");
const {
  fieldExecutiveList,
} = require("../controllers/coordinatior/fieldExecutiveList");
const coordinatorMiddleware = require("../middlewares/coordinatorMiddleware");
const { caseList } = require("../controllers/coordinatior/caseList");
const { updateCase } = require("../controllers/coordinatior/updateCase");
const { getCaseById } = require("../controllers/coordinatior/getCaseById");
const {
  coordinatorDashboardData,
} = require("../controllers/coordinatior/coordinator.dashboard.controller");

const coordinatorRoute = express.Router();

coordinatorRoute.post("/add-case", coordinatorMiddleware, addCase);
coordinatorRoute.patch("/update-case/:id", coordinatorMiddleware, updateCase);
coordinatorRoute.get("/case/:id", coordinatorMiddleware, getCaseById);
coordinatorRoute.get("/case-list", caseList);

coordinatorRoute.get(
  "/fieldExecutive-list",
  coordinatorMiddleware,
  fieldExecutiveList
);
coordinatorRoute.get(
  "/dashboard-data",
  coordinatorMiddleware,
  coordinatorDashboardData
);

module.exports = coordinatorRoute;
