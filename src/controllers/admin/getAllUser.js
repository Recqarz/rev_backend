const UserModel = require("../../models/userModel");

const getAllUser = async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    return res
      .status(200)
      .send({ message: "All users has been fetched!", users: allUsers });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { getAllUser };
