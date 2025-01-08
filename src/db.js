const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

module.exports = connectionDB;
