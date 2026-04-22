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
      extension: newFile.extension
    },
  });
}

async function getFileById(fileId, userId) {
  return await prisma.file.findUnique({
    where: { id: fileId, userId: userId },
  });
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
};
