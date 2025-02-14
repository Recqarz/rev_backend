const UserModel = require("../../models/userModel");

const getAllUser = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      state,
      district,
      zone,
      role,
      isActive,
    } = req.query;

    // Building the filter query
    const filter = {};
    if (role) filter.role = role;
    if (state) filter.state = state;
    if (district) filter.district = district;
    if (zone) filter.zone = zone;

    if (isActive !== undefined) {
      // Only apply the isActive filter if it is explicitly specified
      if (isActive === "true") {
        filter.isActive = true;
      } else if (isActive === "false") {
        filter.isActive = false;
      }
    }

    // Building the search query
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { userCode: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Combining filter and search queries
    const query = { ...filter, ...searchQuery };

    // Fetching users with pagination, filtering, and search
    const allUsers = await UserModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Getting the total number of users for pagination
    const count = await UserModel.countDocuments(query);

    return res.status(200).send({
      message: "All users have been fetched!",
      totalUser: count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
      users: allUsers,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { getAllUser };
