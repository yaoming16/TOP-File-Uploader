const { validationResult, body } = require("express-validator");
const {
  getMainFolderOfUser,
  postNewFolder,
  getFolderById,
  postNewFile,
  getFileById,
} = require("../database/queries.js");
const { randomUUID } = require("crypto");
const { uploadToCloudinary } = require("../lib/cloudinary.js");
const path = require("path");
const https = require("https");

const folderValidation = [
  body("folderName").notEmpty().withMessage("Folder name is required"),
];

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
  if (!req.file) {
    return res.status(400).json({
      errors: [{ msg: "Please upload a file", path: "file" }],
    });
  }

  // Use randomUUID to generate a unique name for the file
  const fileId = randomUUID();
  const originalName = req.file.originalname;
  const fileExtension = path.extname(originalName).toLowerCase();
  const newFileName = fileId + fileExtension;

  // If cloudinary returns an error we will send custom messages to user
  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(req.file.buffer, newFileName);
  } catch (err) {
    // error example: { message: 'Empty file', name: 'Error', http_code: 400 }
    console.error("Cloudinary Upload Failed:", err);

    //First we set the message based on the error message that cloudinary returned
    let errorMessage;
    switch (err.message) {
      case "Empty file":
        errorMessage =
          "The file you are trying to upload is empty, please try again with other file";
        break;
      default:
        errorMessage =
          "Failed to upload file. Please check the file format and try again.";
        break;
    }

    // We send the error message to the user
    return res.status(400).json({
      errors: [
        {
          msg: errorMessage,
          path: "file",
        },
      ],
    });
  }


  //We want to save the name of the file without the extension
  const nameWithoutExt = fileExtension
    ? originalName.slice(0, -fileExtension.length)
    : originalName;

  const imgLink = uploadResult.secure_url;

  await postNewFile({
    name: nameWithoutExt,
    link: imgLink,
    folderId: parseInt(req.params.mainFolderId),
    userId: req.user.id,
    size: req.file.size,
    extension: fileExtension,
  });
  res.status(201).json({ message: "File created successfully" });
}

async function getOneFile(req, res) {
  // File will be null if the file with id req.params.fileId isnt owned by current user
  const file = await getFileById(parseInt(req.params.fileId), req.user.id);
  if (!file) return res.status(403).send("Unauthorized");

  //Fetch file from Cloudinary
  https
    .get(file.link, (cloudinaryRes) => {
      // Set headers
      res.setHeader(
        "Content-Disposition", // Tells the browser to open "save as"
        `attachment; filename="${file.name}"`, //Tells the browser the suggested file name
      );
      res.setHeader("Content-Type", cloudinaryRes.headers["content-type"]); // Copy the content type cloudinary sent

      // Pipe the data directly to the user (dont wait for the server to finish the download before starting to send the file)
      cloudinaryRes.pipe(res);
    })
    .on("error", (err) => {
      res.status(500).send("Error downloading file");
    });
}

module.exports = {
  folderValidation,
  getFiles,
  postFolder,
  postFile,
  getOneFile,
};
