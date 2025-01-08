const express = require("express");

const adminRoute = express.Router();

adminRoute.get("/", async (req, res) => {
  try {
    return res.status(200).send({ message: "admin Route has been called!" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = adminRoute;
