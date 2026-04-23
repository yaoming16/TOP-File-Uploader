const { Router } = require("express");
const filesController = require("../controllers/filesController");
const multer = require("multer");

const filesRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

filesRouter.get("/", filesController.getFiles);
filesRouter.get("/:folderId/folder", filesController.getFiles);
filesRouter.post(
  "/add/:mainFolderId/folder",
  filesController.folderValidation,
  filesController.postFolder,
);
filesRouter.post(
  "/add/:mainFolderId/file",
  upload.single("file"),
  filesController.postFile,
);
filesRouter.get("/:fileId/file", filesController.getOneFile);

module.exports = filesRouter;
