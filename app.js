const path = require("node:path");
require("dotenv").config();
const {
  localStrategy,
  serializeUser,
  deserializeUser,
} = require("./middleware/bcrypt");
const express = require("express");
const passport = require("passport");
const expressSession = require("express-session");

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./generated/prisma/client.js");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

// DATABASE_URL defined in env file included in prisma.config.js; see Prisma docs
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "yaoming",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

/* passport.use(localStrategy());

passport.serializeUser((user, done) => {
  serializeUser(user, done);
});

passport.deserializeUser(async (id, done) => {
  await deserializeUser(id, done);
}); */

app.get("/", (req, res) => {
  res.render("homepage");
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});


//npx prisma studio --config ./prisma.config.js
//https://www.prisma.io/docs/prisma-orm/quickstart/postgresql
