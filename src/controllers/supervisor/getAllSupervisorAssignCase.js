const getAllSupervisorAssignCase = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "" } = req.query;
    // Building the search query
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { getAllSupervisorAssignCase };
