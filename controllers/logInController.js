const { validationResult, body } = require("express-validator");
const passport = require("passport");

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

function getLogIn(req, res) {
  res.render("logIn");
}

async function postLogin(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const errorMessage = info ? info.message : "Invalid credentials";
      return res.status(401).json({ errors: [{ msg: errorMessage }] });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
}

module.exports = {
  loginValidation,
  getLogIn,
  postLogin
};