// Generate a random 6-digit number and return it as a string
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const isOTPExpired = (expirationTime) => {
  const currentTime = new Date().getTime();
  return currentTime > expirationTime;
};

module.exports = { generateOTP, isOTPExpired };
