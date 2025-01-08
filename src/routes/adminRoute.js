const express = require("express");
const { getAllUser } = require("../controllers/admin/getAllUser");
const { createUser } = require("../controllers/admin/createUser");
const { createBank } = require("../controllers/admin/createBank");

const adminRoute = express.Router();

adminRoute.get("/users", getAllUser);
adminRoute.post("/create-user", createUser);
adminRoute.post("/create-bank", createBank);

module.exports = adminRoute;
