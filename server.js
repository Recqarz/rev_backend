const express = require("express");
const connectionDB = require("./src/db");
const cors = require("cors");
const allRoutes = require("./src/routes/allRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4001;

/** Test Route */
app.get("/", async (req, res) => {
  try {
    return res.status(200).send({ message: "data fetched successfull" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

/** All routes */
app.use("/api", allRoutes);

app.listen(PORT, async () => {
  try {
    await connectionDB();
    console.log(`app is listning on ${PORT}`);
    console.log(`mongoDB has been connected!`);
  } catch (error) {
    console.log(error.message);
  }
});
