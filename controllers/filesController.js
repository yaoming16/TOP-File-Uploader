const { validationResult, body } = require("express-validator");
const {
  getMainFolderOfUser,
  postNewFolder,
  getFolderById,
  postNewFile,
} = require("../database/queries.js");
const { randomUUID } = require("crypto");
const { uploadToCloudinary } = require("../lib/cloudinary.js");
const path = require("path");

const folderValidation = [
  body("folderName").notEmpty().withMessage("Folder name is required"),
];

function checkAuth(req, res) {
  //If user is not logged In we will send them to the log in page.
  if (!req.isAuthenticated()) {
    res.redirect("/logIn");
    return false;
  }
  return true;
}

//Only returns the folder of id req.paras.id if current user is the owner of the requested folder.
//Otherwise returns null
async function getFolder(req) {
  let folder = null;
  if (req.params.folderId !== undefined) {
    // If user is not owner of requested folder, folder will continue to be null
    folder = await getFolderById(parseInt(req.params.folderId), req.user.id);
  } else {
    // If no folderId was requested, get their root folder
    folder = await getMainFolderOfUser(req.user.id, null);
  }
  return folder;
}

async function getFiles(req, res) {
  //If user is not logged In we will send them to the log in page.
  if (!checkAuth(req, res)) return;

  const folder = await getFolder(req);

  if (!folder) {
    // if requested folder does not exist we will get the root folder
    const rootFolder = await getMainFolderOfUser(req.user.id, null);

    // We will render the root folder and show the errors there
    return res.status(404).render("files", {
      folders: rootFolder.subFolders,
      files: rootFolder.files,
      mainFolderId: rootFolder.id,
      error:
        "The requested folder does not exist or you do not have permission to view it.",
    });
  }

  return res.render("files", {
    folders: folder.subFolders,
    files: folder.files,
    mainFolderId: folder.id,
    error: null,
  });
}

async function postFolder(req, res) {
  //If user is not logged In we will send them to the log in page.
  if (!checkAuth(req, res)) return;

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

async function postFile(req, res) {
  //If user is not logged In we will send them to the log in page.
  if (!checkAuth(req, res)) return;

  if (!req.file) {
    return res.status(400).json({
      errors: [{ msg: "Please upload a file", path: "file" }],
    });
  }

  // Use randomUUID to generate a unique name for the image
  const imgId = randomUUID();
  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  const newImgName = imgId + fileExtension;
  const uploadResult = await uploadToCloudinary(req.file.buffer, newImgName);

  const imgLink = uploadResult.secure_url;

  await postNewFile({
    name: req.file.originalname,
    link: imgLink,
    folderId: parseInt(req.params.mainFolderId),
    userId: req.user.id,
    size: req.file.size,
  });
  res.status(201).json({ message: "File created successfully" });
}

async function getOneFile(req, res) {
  //If user is not logged In we will send them to the log in page.
  checkAuth(req, res);

  //We want to download the file only if the current user is the owner of the file
}

module.exports = {
  folderValidation,
  getFiles,
  postFolder,
  postFile,
};
