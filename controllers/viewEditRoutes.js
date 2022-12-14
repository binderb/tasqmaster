const router = require("express").Router();
const { Project, User } = require("../models");
const { withAuthView } = require("../utils/auth");
const { getNestedTasks } = require("./helpers");

// Display create new project page
router.get('/', withAuthView, (req, res) => {
  res.render('projectEditor', {
    loggedIn: req.session.loggedIn,
    username: req.session.username,
    userID: req.session.userID
  })
});

// Display edit existing project page
router.get('/:id', withAuthView, async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [{model:User}]
    });
    // Check if the requested project exists
    if (!projectData) {
      res.status(404).render('404',{
        loggedIn: req.session.loggedIn,
        userID: req.session.userID,
        username: req.session.username
      });
      return;
    }
    const project = projectData.get({plain: true});
    // Make sure the user has ownership over this project
    if (project.users.filter(e => e.id == req.session.userID).length == 0) {
      res.status(403).redirect('/');
      return;
    }
    const render_obj = {
      project,
      loggedIn: req.session.loggedIn,
      userID: req.session.userID,
      username: req.session.username
    }
    // console.log('my user id: ',render_obj.userID);
    res.render('projectEditor', render_obj);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }
});

module.exports = router;