function logOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      
      // Clear the browser cookie
      res.clearCookie('connect.sid');
      
      // Redirect successfully
      res.redirect('/');
    });
  });
}


module.exports = {
  logOut
}