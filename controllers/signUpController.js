const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const { getUserByEmail, createUser } = require("../database/queries.js");

const signUpValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("Last Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

async function getSignUp(req, res) {
  res.render("signUp");
}

async function postSignUp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // We will check if user already exists
  const user = await getUserByEmail(req.body.email);

  // If user variable is different from null we will send an error because it means an user tried to create an account with an email that is already used.
  if (user) {
    return res.status(409).json({
      errors: [
        {
          msg: "An account already exist with this email, log in or use a different one",
          path: "email",
        },
      ],
    });
  }

  // If user variable is null it means we can create a new account with the email the user provided
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { name, lastName, email } = req.body;
    await createUser(name, lastName, email, hashedPassword);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
  }
}

module.exports = {
  getSignUp,
  postSignUp,
  signUpValidation,
};
