const { validationResult, body } = require("express-validator");
const {
  getMainFolderOfUser,
  postNewFolder,
  getFolderById,
  postNewFile
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
    folder = await getMainFolderOfUser(req.user.id, null);
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

async function postFile(req, res) {
  //If user is not logged In we will send them to the log in page.
  checkAuth(req, res);

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

module.exports = {
  folderValidation,
  getFiles,
  postFolder,
  postFile,
};
