const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  return res.status(200).send({ message: "data fetched successfull" });
});

app.listen(PORT, () => {
  console.log(`app is listning on ${PORT}`);
});
