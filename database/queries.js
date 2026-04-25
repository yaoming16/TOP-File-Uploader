const { prisma } = require("../lib/prisma.js");

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email: email },
  });
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}

async function createUser(userInfo) {
  await prisma.user.create({
    data: {
      email: userInfo.email,
      name: userInfo.name,
      lastName: userInfo.lastName,
      password: userInfo.password,
      folders: {
        create: [{ name: "root" }],
      },
    },
  });
}

async function getFolderById(folderId, userId) {
  return await prisma.folder.findUnique({
    where: { id: folderId, userId: userId },
    include: { subFolders: true, files: true },
  });
}

async function getMainFolderOfUser(userId) {
  return await prisma.folder.findFirst({
    where: { userId: userId, mainFolderId: null },
    include: { subFolders: true, files: true },
  });
}

async function postNewFolder(newFolder) {
  await prisma.folder.create({
    data: {
      name: newFolder.name,
      userId: newFolder.userId,
      mainFolderId: newFolder.mainFolderId,
    },
  });
}

async function postNewFile(newFile) {
  await prisma.file.create({
    data: {
      name: newFile.name,
      link: newFile.link,
      folderId: newFile.folderId,
      userId: newFile.userId,
      size: newFile.size,
      extension: newFile.extension,
    },
  });
}

async function getFileById(fileId, userId) {
  return await prisma.file.findUnique({
    where: { id: fileId, userId: userId },
  });
}

async function deleteFile(fileId, userId) {
  try {
    return await prisma.file.delete({
      where: { id: fileId, userId: userId },
    });
  } catch (err) {
    if (err.code === "P2025") {
      return null;
    }
    throw err;
  }
}

async function deleteFolder(folderId, userId) {
  try {
    return await prisma.folder.delete({
      where: { id: folderId, userId: userId },
      include: { subFolders: true, files: true },
    });
  } catch (err) {
    if (err.code === "P2025") {
      return null;
    }
    throw err;
  }
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  getFolderById,
  getMainFolderOfUser,
  postNewFolder,
  postNewFile,
  getFileById,
  deleteFile,
  deleteFolder,
};
