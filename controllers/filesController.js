const { validationResult, body } = require("express-validator");
const {
  getMainFolderOfUser,
  postNewFolder,
  getFolderById,
  postNewFile,
  getFileById,
  updateFolder,
  updateFile,
  getBasicInfoFolderById,
} = require("../database/queries.js");
const https = require("https");
const {
  handleFileUpload,
  handleFileDeletion,
  handleFolderDeletion,
} = require("../services/fileService.js");

const folderValidation = [
  body("folderName").notEmpty().withMessage("Folder name is required"),
];

const updateValidation = [
  body("newName").notEmpty().withMessage("The name can't be left empty"),
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
      currentFolderId: rootFolder.id,
      pathList: [rootFolder.id],
      error:
        "The requested folder does not exist or you do not have permission to view it.",
    });
  }

  //We will return an array with the path to the folder requested. 
  //We start from the current folder and go back using mainFolderId to get the parent of the current folder and so on 
  //First element of the array is the current folder
  let pathList = [];
  let folderCopy = {
    mainFolderId: folder.mainFolderId,
    id: folder.id,
    name: folder.name,
  };
  while (folderCopy.mainFolderId) {
    pathList.push(folderCopy);
    folderCopy = await getBasicInfoFolderById(
      folderCopy.mainFolderId,
      req.user.id,
    );
  }

  //At the end of the while loop folder copy should have the root folder. We add it to the path
  pathList.push(folderCopy)

  return res.render("files", {
    folders: folder.subFolders,
    files: folder.files,
    currentFolderId: folder.id,
    pathList: pathList,
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

  let uploadInfo;
  try {
    uploadInfo = await handleFileUpload(req.file.buffer, req.file.originalname);
  } catch (err) {
    // We send the error message to the user
    return res.status(400).json({
      errors: [
        {
          msg: err.message,
          path: "file",
        },
      ],
    });
  }

  await postNewFile({
    name: uploadInfo.nameWithoutExt,
    link: uploadInfo.imgLink,
    folderId: parseInt(req.params.mainFolderId),
    userId: req.user.id,
    size: req.file.size,
    extension: uploadInfo.fileExtension,
  });

  res.status(201).json({ message: "File created successfully" });
}

async function getOneFile(req, res) {
  console.log("Downloading file with id:", req.params.fileId);
  // File will be null if the file with id req.params.fileId isnt owned by current user
  const file = await getFileById(parseInt(req.params.fileId), req.user.id);
  if (!file) return res.status(403).send("Unauthorized");

  //Fetch file from Cloudinary
  https
    .get(file.link, (cloudinaryRes) => {
      // Set headers
      res.setHeader(
        "Content-Disposition", // Tells the browser to open "save as"
        `attachment; filename="${file.name}${file.extension}"`, //Tells the browser the suggested file name
      );
      res.setHeader("Content-Type", cloudinaryRes.headers["content-type"]); // Copy the content type cloudinary sent

      // Pipe the data directly to the user (dont wait for the server to finish the download before starting to send the file)
      cloudinaryRes.pipe(res);
    })
    .on("error", (err) => {
      res.status(500).send("Error downloading file");
    });
}

async function deleteOneFile(req, res) {
  try {
    const success = await handleFileDeletion(
      parseInt(req.params.fileId),
      req.user.id,
    );

    if (!success) {
      return res.status(403).json({ error: "Unauthorized or file not found" });
    }

    return res.status(200).json({ message: "File successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete the file" });
  }
}

async function deleteOneFolder(req, res) {
  try {
    const success = await handleFolderDeletion(
      parseInt(req.params.folderId),
      req.user.id,
    );

    if (!success) {
      return res
        .status(403)
        .json({ error: "error: Unauthorized or file/folder not found" });
    }

    return res.status(200).json({ message: "Folder successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete the folder" });
  }
}

async function updateOneFolder(req, res) {
  //Validate folder input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updatedFolder = await updateFolder(
    parseInt(req.params.folderId),
    req.user.id,
    req.body.newName,
  );

  if (!updatedFolder) {
    return res
      .status(403)
      .json({ error: "error: Unauthorized or folder not found" });
  }

  return res.status(200).json({ message: "Folder successfully updated" });
}

async function updateOneFile(req, res) {
  //Validate folder input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updatedFile = await updateFile(
    parseInt(req.params.fileId),
    req.user.id,
    req.body.newName,
  );

  if (!updatedFile) {
    return res
      .status(403)
      .json({ error: "error: Unauthorized or file not found" });
  }

  return res.status(200).json({ message: "File successfully updated" });
}

module.exports = {
  folderValidation,
  updateValidation,
  getFiles,
  postFolder,
  postFile,
  getOneFile,
  deleteOneFile,
  deleteOneFolder,
  updateOneFolder,
  updateOneFile,
};
