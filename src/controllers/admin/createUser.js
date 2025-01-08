const UserModel = require("../../models/userModel");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, role, workForBank, address } =
      req.body;
    /** 
    autoGenerate

    password
    userCode
 */

    if (!firstName || !lastName || !email || !mobile || !role || !workForBank) {
      return res
        .status(404)
        .send({ error: "Oops! Please fill all required fields!" });
    }

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      mobile,
      role,
      workForBank,
      userCode: "fw21_0978",
      password: "fw21_0978",
    });

    await newUser.save();

    return res.status(200).send({ message: "user has been created!", newUser });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { createUser };
