const { validationResult, body } = require("express-validator");
const {
  getFolderByUser,
  postNewFolder,
  getFolderById,
} = require("../database/queries.js");

const folderValidation = [
  body("folderName").notEmpty().withMessage("Folder name is required"),
];

function checkAuth(req, res) {
  //If user is not logged In we will send them to the log in page.
  if (!req.isAuthenticated()) {
    return res.render("logIn");
  }
}

async function getFiles(req, res) {
  //If user is not logged In we will send them to the log in page.
  checkAuth(req, res);

  let folder = null;
  if (req.params.folderId !== undefined) {
    //This will return null if the owner of the folder with id req.params.folderId inst owned by req.user (current user)
    folder = await getFolderById(parseInt(req.params.folderId), req.user.id);
  }
  //We send user to their root folder if req.params.folderId is undefined or
  // requested folder isnt owned by current user
  if (!folder) {
    folder = await getFolderByUser(req.user.id, null);
  }

  return res.render("files", {
    folders: folder.subFolders,
    files: folder.files,
    mainFolderId: folder.id,
  });
}

async function postFolder(req, res) {
  //If user is not logged In we will send them to the log in page.
  checkAuth(req, res);

  //Validate folder input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Add folder to current folder
  await postNewFolder({
    name: req.body.folderName,
    userId: req.user.id,
    mainFolderId: parseInt(req.params.mainFolderId),
  });
  res.status(201).json({ message: "Folder created successfully" });
}

module.exports = {
  folderValidation,
  getFiles,
  postFolder,
};
