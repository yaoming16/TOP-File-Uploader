const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

function uploadToCloudinary(fileBuffer, imageName) {
  return new Promise((resolve, reject) => {
    const options = {
      folder: process.env.CLOUDINARY_FOLDER,
      resource_type: "auto", // Accept any file type (images, pdfs, raw files, etc.)
    };
    if (imageName) {
      options.public_id = imageName;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
}

function extractFileName(imgURL) {
  return imgURL.split("/").pop().split(".")[0];
}

async function deleteCloudinaryFile(imgURL) {
  try {
    //We need to see the resource type of the file we want to delete
    let resourceType = "image";
    if (imgURL.includes("/raw/upload/")) resourceType = "raw";
    else if (imgURL.includes("/video/upload/")) resourceType = "video";

    // Extract the portion of the URL after "/upload/"
    const urlParts = imgURL.split("/upload/");
    if (urlParts.length < 2) {
      throw new Error("Invalid Cloudinary URL");
    }

    let pathSegment = urlParts[1]; // e.g. "v1234567/folder/file.jpg"

    // Remove the version folder if it exists (e.g., "v123456789/")
    if (pathSegment.match(/^v\d+\//)) {
      pathSegment = pathSegment.replace(/^v\d+\//, "");
    }

    // Raw types need the extension on public_id, images/videos don't.
    let publicId = pathSegment;
    if (resourceType !== "raw" && pathSegment.lastIndexOf(".") !== -1) {
      publicId = pathSegment.substring(0, pathSegment.lastIndexOf("."));
    }

    //Delete the file
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("File deletion failed");
  }
}

module.exports = {
  uploadToCloudinary,
  extractFileName,
  deleteCloudinaryFile,
};
