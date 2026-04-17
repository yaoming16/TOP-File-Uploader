const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const {getUserByEmail, getUserById} = require("../database/queries.js");

//Tries to find user in the DB
function localStrategy() {
  return new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Invalid email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          // passwords do not match!
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  );
}

function serializeUser(user, done) {
  done(null, user.id);
}

async function deserializeUser(id, done) {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
}

module.exports = {
  localStrategy,
  serializeUser,
  deserializeUser,
};
