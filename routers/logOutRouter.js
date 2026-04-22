const { Router } = require("express");
const logOutController = require("../controllers/logOutController");

const logOutRouter = Router();

logOutRouter.post("/", logOutController.logOut);

module.exports = logOutRouter;