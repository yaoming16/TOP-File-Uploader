const { Router } = require("express");
const filesController = require("../controllers/filesController");
const { checkAuth } = require("../middleware/auth");
const multer = require("multer");

const filesRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

filesRouter.use(checkAuth);

//Folders
filesRouter.get("/", filesController.getFiles);
filesRouter.get("/:folderId/folder", filesController.getFiles);
filesRouter.post(
  "/add/:mainFolderId/folder",
  filesController.folderValidation,
  filesController.postFolder,
);
filesRouter.delete("/delete/:folderId/folder", filesController.deleteOneFolder);
filesRouter.put(
  "/update/:folderId/folder",
  filesController.updateValidation,
  filesController.updateOneFolder,
);

// Files
filesRouter.post(
  "/add/:mainFolderId/file",
  upload.single("file"),
  filesController.postFile,
);
filesRouter.get("/:fileId/file", filesController.getOneFile);
filesRouter.delete("/delete/:fileId/file", filesController.deleteOneFile);
filesRouter.put(
  "/update/:fileId/file",
  filesController.updateValidation,
  filesController.updateOneFile,
);

module.exports = filesRouter;
