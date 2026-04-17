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
    },
  });
}

module.exports = { getUserByEmail, getUserById, createUser };
