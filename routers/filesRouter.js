const { Router } = require("express");
const filesController = require("../controllers/filesController");

const filesRouter = Router();

filesRouter.get("/", filesController.getFiles);

module.exports = filesRouter;