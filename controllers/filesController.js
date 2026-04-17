const { validationResult, body } = require("express-validator");

async function filesView(req, res) {
  //If user is not logged In we will send them to the log in page.
  if (!req.isAuthenticated()) {
    return res.render("logIn");
  }

  //If user is logged In, we show the files view
  
  
}