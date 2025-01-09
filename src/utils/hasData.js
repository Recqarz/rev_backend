const bcrypt = require("bcryptjs");

// Function to hash data, making it reusable for different data types like passwords, tokens, etc.
async function hashData(data) {
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with a 10-round cost factor
    const hashedData = await bcrypt.hash(data, salt); // Hash the data using the generated salt
    return hashedData; // Return the hashed data
  } catch (error) {
    // Handle any errors during the hashing process
    throw new Error("Hashing failed: " + error.message);
  }
}

module.exports = { hashData };
