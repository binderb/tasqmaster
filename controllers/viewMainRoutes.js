const router = require('express').Router();
const { Project, User } = require('../models');
const { withAuthView } = require('../utils/auth');

router.get('/', (req, res) => {
  res.render('homepage', {
    loggedIn: req.session.loggedIn,
    username : req.session.username,
    userID : req.session.userID
  });
});

router.get('/dashboard', withAuthView, (req, res) => {
  res.render('dashboard', {
    loggedIn: req.session.loggedIn,
    username : req.session.username,
    userID : req.session.userID
  });
});

router.get("/login", (req,res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login-signup', {
    showLogin : true
  });
});

router.get("/signup", (req,res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login-signup', {
    showLogin : false
  });
});

module.exports = router;
