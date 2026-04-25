const path = require("path");
const { randomUUID } = require("crypto");
const {
  uploadToCloudinary,
  deleteCloudinaryFile,
} = require("../lib/cloudinary.js");
const { deleteFolder, deleteFile } = require("../database/queries.js");

async function handleFileUpload(fileBuffer, originalName) {
  // Use randomUUID to generate a unique name for the file
  const fileId = randomUUID();
  const fileExtension = path.extname(originalName).toLowerCase();
  const newFileName = fileId + fileExtension;

  // If cloudinary returns an error we will throw an error
  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(fileBuffer, newFileName);
  } catch (err) {
    // error example: { message: 'Empty file', name: 'Error', http_code: 400 }
    console.error("Cloudinary Upload Failed:", err);

    //Now we throw an error
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
    throw new Error(errorMessage);
  }

  //We want to save the name of the file without the extension
  const nameWithoutExt = fileExtension
    ? originalName.slice(0, -fileExtension.length)
    : originalName;

  const imgLink = uploadResult.secure_url;

  return {
    nameWithoutExt,
    imgLink,
    fileExtension,
  };
}

async function handleFileDeletion(fileId, userId) {
  //Check if file exists and belongs to the user
  const deletedFile = await deleteFile(fileId, userId);
  if (!deletedFile) {
    return false; // Tells the controller it failed authorization
  }

  //Delete from Cloudinary second
  try {
    await deleteCloudinaryFile(deletedFile.link);
  } catch (cloudinaryError) {
    console.error("Cloudinary failed to delete file:", cloudinaryError);
  }
  return true;
}

async function handleFolderDeletion(folderId, userId) {
  const deletedFolder = await deleteFolder(folderId, userId);
  if (!deletedFolder) {
    return false; // Tells the controller it failed authorization
  }

  //We need to delete all cloudinary files inside the folder
  // Files are deleted in the db on cascade when the folder they ar einside are deleted
  for (let i = 0; i < deletedFolder.files.length; i++) {
    try {
      await deleteCloudinaryFile(deletedFolder.files[i].link);
    } catch (cloudinaryError) {
      console.error(
        `Cloudinary failed to delete file of Id ${deletedFolder.files[i].id}:`,
        cloudinaryError,
      );
    }
  }

  //We also need to delete all files in subfolders
  // If the folder has subfolders we will recursively call handleFolderDeletion on each
  // When no more subfolders it returns.
  if (deletedFolder.subFolders.length > 0) {
    for (let j = 0; j < deletedFolder.subFolders.length; j++) {
      handleFolderDeletion(deletedFolder.subFolders[j].id, userId);
    }
  }
  return true;
}

module.exports = {
  handleFileUpload,
  handleFileDeletion,
  handleFolderDeletion,
};
