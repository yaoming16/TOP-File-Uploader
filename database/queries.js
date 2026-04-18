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

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  getFolderById,
  getMainFolderOfUser,
  postNewFolder,
};
