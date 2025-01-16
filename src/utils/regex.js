const checkPasswordRegex = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (passwordRegex.test(password)) {
    return true;
  } else {
    return false;
  }
};

const checkMobileRegex = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/; // Example for Indian mobile numbers
  if (mobileRegex.test(mobile)) {
    return true;
  } else {
    return false;
  }
};

module.exports = { checkPasswordRegex,checkMobileRegex };
