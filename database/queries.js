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

async function createUser(email, name, lastName, password) {
  await prisma.user.create({
    data: {
      email: email,
      name: name,
      lastName: lastName,
      password: password,
    },
  });
}

module.exports = { getUserByEmail, getUserById, createUser };
