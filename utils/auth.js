// This middleware function is used for API routes
// and returns a JSON object for unauthorized calls 
// with a descriptive message.
const withAuthAPI = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.status(403).json({message:'Route requires an authenticated login.'});
  } else {
    next();
  }
}

// This middleware function is used for view routes
// and reidrects to the login page for unauthorized calls.
const withAuthView = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    next();
  }
}

module.exports = {
  withAuthAPI,
  withAuthView
};
