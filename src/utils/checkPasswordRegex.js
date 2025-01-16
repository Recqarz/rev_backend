const checkPasswordRegex = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (passwordRegex.test(password)) {
    return true;
  } else {
    return false;
  }
};

module.exports = { checkPasswordRegex };
