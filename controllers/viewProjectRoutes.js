const router = require('express').Router();
const { Project, User, Task } = require('../models');
const { withAuthView } = require('../utils/auth');
const { getNestedTasks } = require('./helpers');

router.get('/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [{model: User}]
    });
    const project = projectData.get({plain:true});
    res.render('singleProject', {
      project,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      userID: req.session.userID
    });
    

  } catch (err) {
    res.status(500).json(`Internal Server Error: ${err.name}`);
  }
});

module.exports = router;