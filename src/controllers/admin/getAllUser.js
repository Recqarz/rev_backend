const getAllUser = async (req, res) => {
  try {
    return res.status(200).send({ message: "All users has been fetched!" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};


module.exports={getAllUser}