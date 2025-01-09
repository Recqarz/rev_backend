const express = require("express");
const connectionDB = require("./src/db");
const adminRoute = require("./src/routes/adminRoute");
const commonRoute = require("./src/routes/commonRoute");
const authMiddleware = require("./src/middlewares/authMiddleware");
const adminMiddleware = require("./src/middlewares/adminMiddleware");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

// app.get("/", async (req, res) => {
//   try {
//     return res.status(200).send({ message: "data fetched successfull" });
//   } catch (error) {
//     return res.status(400).send({ error: error.message });
//   }
// });

/** ROUTE CONFIG */
app.use("/api/v1/user", commonRoute);
app.use("/api/v1/admin", authMiddleware, adminMiddleware, adminRoute);

app.listen(PORT, async () => {
  try {
    await connectionDB();
    console.log(`app is listning on ${PORT}`);
    console.log(`mongoDB has been connected!`);
  } catch (error) {
    console.log(error.message);
  }
});
