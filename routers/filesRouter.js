const { Router } = require("express");
const filesController = require("../controllers/filesController");

const filesRouter = Router();

filesRouter.get("/", filesController.getFiles);
filesRouter.get("/:folderId", filesController.getFiles);
filesRouter.post(
  "/add/:mainFolderId/folder",
  filesController.folderValidation,
  filesController.postFolder,
);

module.exports = filesRouter;
