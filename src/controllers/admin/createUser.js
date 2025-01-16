const UserModel = require("../../models/userModel");
const { checkPasswordRegex } = require("../../utils/checkPasswordRegex");
const { checkMobileRegex } = require("../../utils/regex");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, role, workForBank, address } =
      req.body;

    // Ensure all required fields are provided

    if (!firstName || !lastName || !email || !mobile || !role || !workForBank) {
      return res
        .status(404)
        .send({ error: "Oops! Please fill all required fields!" });
    }

    if (!checkMobileRegex(mobile)) {
      return res
        .status(400)
        .send({ error: "Please enter a valid mobile number" });
    }

    const user = await UserModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (user?.email == email) {
      return res
        .status(400)
        .send({ error: "Oops! This emails is already registered" });
    }
    if (user?.mobile == mobile) {
      return res
        .status(400)
        .send({ error: "Oops! This Mobile number is already registered" });
    }

    // Get the first 3 characters from the role and convert to uppercase
    const first2CharFromRole = role.toString().slice(0, 2).toUpperCase();

    // Case code creation
    const allUser = await UserModel.find();
    const newUserNumber = allUser.length
      ? Number(allUser[allUser.length - 1].userCode.split("_")[1]) + 1
      : 1;
    const userCode = `${first2CharFromRole}_${String(newUserNumber).padStart(
      4,
      "0"
    )}`;

    // Auto-generate password using the last 4 digits of the mobile number
    const password = `Rev@${mobile.toString().slice(-4)}`;

    // check password regex for uper, lower, number, special char and min langth 8
    if (!checkPasswordRegex(password)) {
      return res.status(400).send({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long",
      });
    }

    // console.log("userCode ", userCode);
    // console.log("password ", password);

    // Create a new user with the provided and generated details
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      mobile,
      role,
      workForBank,
      userCode,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success message along with the created user details
    return res.status(200).send({ message: "User has been created!" });
  } catch (error) {
    // Handle any errors and return a proper error response
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { createUser };
