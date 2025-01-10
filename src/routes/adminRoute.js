const express = require("express");
const { getAllUser } = require("../controllers/admin/getAllUser");
const { createUser } = require("../controllers/admin/createUser");
const { createBank } = require("../controllers/admin/createBank");
const { getAllBank } = require("../controllers/admin/getAllBank");
const { updateBankDetails } = require("../controllers/admin/updateBankDetails");
const { updateUser } = require("../controllers/common/updateUser");

const adminRoute = express.Router();

adminRoute.post("/create-user", createUser);
adminRoute.post("/create-bank", createBank);
adminRoute.get("/bank-list", getAllBank);
adminRoute.get("/user-list", getAllUser);
adminRoute.patch("/user/update/:id", updateUser);
adminRoute.patch("/bank/update/:id", updateBankDetails);

module.exports = adminRoute;
