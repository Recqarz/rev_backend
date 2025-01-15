const UserModel = require("../../models/userModel");

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
    const first3CharFromRole = role.toString().slice(0, 3).toUpperCase();

    let userCode;
    let isUnique = false;

    // Loop to ensure userCode is unique
    while (!isUnique) {
      // Generate 4 random digits
      const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

      // Combine role characters and random digits to form userCode
      userCode = `${first3CharFromRole}${randomDigits}`;

      // Check if the generated userCode already exists in the database
      const existingUser = await UserModel.findOne({ userCode });

      if (!existingUser) {
        // If no user with the generated userCode exists, it's unique
        isUnique = true;
      }
    }

    // Auto-generate password using the last 4 digits of the mobile number
    const password = `rev@${mobile.toString().slice(-4)}`;

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
