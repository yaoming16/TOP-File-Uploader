const path = require("path");
const { randomUUID } = require("crypto");
const { uploadToCloudinary } = require("../lib/cloudinary.js");

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

module.exports = {
  handleFileUpload,
};
