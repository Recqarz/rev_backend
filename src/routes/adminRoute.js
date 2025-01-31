const express = require("express");
const { getAllUser } = require("../controllers/admin/getAllUser");
const { createUser } = require("../controllers/admin/createUser");
const { createBank } = require("../controllers/admin/createBank");
const { getAllBank } = require("../controllers/admin/getAllBank");
const { updateBankDetails } = require("../controllers/admin/updateBankDetails");
const { updateUser } = require("../controllers/common/updateUser");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { dashboardInfo } = require("../controllers/admin/dashboard.controller");

const adminRoute = express.Router();

adminRoute.get("/bank-list", getAllBank);
adminRoute.get("/dashboard",adminMiddleware, dashboardInfo);
adminRoute.post("/create-user", adminMiddleware, createUser);
adminRoute.post("/create-bank", adminMiddleware, createBank);
adminRoute.get("/user-list", adminMiddleware, getAllUser);
adminRoute.patch("/user/update/:id", adminMiddleware, updateUser);
adminRoute.patch("/bank/update/:id", adminMiddleware, updateBankDetails);

module.exports = adminRoute;
