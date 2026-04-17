const { Router } = require("express");
const signUpController = require("../controllers/signUpController");

const signUpRouter = Router();

signUpRouter.get("/", signUpController.getSignUp);
signUpRouter.post(
  "/",
  signUpController.signUpValidation,
  signUpController.postSignUp,
);

module.exports = signUpRouter;
