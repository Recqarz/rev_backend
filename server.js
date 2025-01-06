const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    return res.status(200).send({message:"data fetched successfull"})
});

app.listen(PORT, () => {
  console.log(`app is listning on ${PORT}`);
});
