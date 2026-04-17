const { Router } = require("express");
const logInController = require("../controllers/logInController");

const logInRouter = Router();

logInRouter.get("/", logInController.getLogIn);
logInRouter.post(
  "/",
  logInController.loginValidation,
  logInController.postLogin,
);

module.exports = logInRouter;
