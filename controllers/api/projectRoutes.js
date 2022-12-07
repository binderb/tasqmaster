const router = require('express').Router();
const { Project, User, Task } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all projects
router.get('/', async(req, res) => {
  try {
    const projects_data = await Project.findAll({
      include: [{model: User},{model: Task}]
    });
    const projects = projects_data.map(e => e.get({plain:true}));
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(`Internal Server Error: ${err.name}`);
  }
});

module.exports = router;
