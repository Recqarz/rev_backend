const UserModel = require("../../models/userModel");

const fieldExecutiveList = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Building the search query
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { userCode: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Combining filter and search queries
    const query = { role: "fieldExecutive", ...searchQuery };

    // Fetching users with pagination, filtering, and search
    const allUsers = await UserModel.find(query)
      .populate("workForBank")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Getting the total number of users for pagination
    const count = await UserModel.countDocuments(query);

    return res.status(200).send({
      message: "All fieldExecutive have been fetched!",
      totalUser: count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
      users: allUsers,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { fieldExecutiveList };
