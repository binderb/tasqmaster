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

router.get('/dashboard', withAuthView, async (req, res) => {
  // Get a list of all projects belonging to the logged in user
  try {
    const allProjectsData = await Project.findAll({
      include: [
        {
          model: User,
          where: {
            id: req.session.id
          },
          required: false
        }
      ]
    });
    const allProjects = allProjectsData.map(e => e.get({plain:true}));
    res.render('dashboard', {
      allProjects,
      loggedIn: req.session.loggedIn,
      username : req.session.username,
      userID : req.session.userID
    });
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}.`});
  }
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
