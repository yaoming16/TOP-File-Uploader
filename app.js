const path = require("node:path");
require("dotenv").config();
const {
  localStrategy,
  serializeUser,
  deserializeUser,
} = require("./middleware/bcrypy.js");
const express = require("express");
const passport = require("passport");
const expressSession = require("express-session");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const { prisma } = require("./lib/prisma.js");

//Require routers
const signUpRouter = require("./routers/signUpRouter.js");
const filesRouter = require("./routers/filesRouter.js");
const logInRouter = require("./routers/logInRouter.js");
const logOutRouter = require("./routers/logOutRouter.js");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Session configuration
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false, // We dont want to create rows for visitors that are not logged in 
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// Make the user object available to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use(express.static(path.join(__dirname, "public")));

passport.use(localStrategy());

passport.serializeUser((user, done) => {
  serializeUser(user, done);
});

passport.deserializeUser(async (id, done) => {
  await deserializeUser(id, done);
});

//Pages views
app.get("/", (req, res) => {
  // If user already logged in we will redirect him to the files page, otherwise we will render the homepage
  if (req.user) {
    return res.redirect("/files");
  }
  res.render("homepage");
});

app.use("/login", logInRouter);
app.use("/signup", signUpRouter);
app.use("/files", filesRouter);
app.use("/logout", logOutRouter)

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global error handler caught an error:", err);

  // Distinguish between errors you sent vs unexpected crashes
  const statusCode = err.status || 500;
  const isInternalError = statusCode >= 500;

  const errorMessage = isInternalError
    ? "An unexpected error occurred on the server. Please try again later."
    : err.message;

  res.status(statusCode).json({
    errors: [{ msg: errorMessage }],
  });
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});

//npx prisma studio --config ./prisma.config.js
//https://www.prisma.io/docs/prisma-orm/quickstart/postgresql
