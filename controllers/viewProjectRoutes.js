const router = require('express').Router();
const { Project, User, Task } = require('../models');
const withAuth = require('../utils/auth');
const { getNestedTasks } = require('./helpers');

router.get('/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [{model: User}]
    });
    const project = projectData.get({plain:true});
    console.log(project);
    res.render('singleProject', {
      project
    });
    

  } catch (err) {
    res.status(500).json(`Internal Server Error: ${err.name}`);
  }
});

module.exports = router;