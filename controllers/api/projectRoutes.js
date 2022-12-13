const router = require('express').Router();
const { Project, User, Task, ProjectUser } = require('../../models');
const { withAuthAPI } = require('../../utils/auth');
const { getNestedTasks } = require('../helpers');

// Create 1 project
router.post('/', withAuthAPI, async (req, res) => {
  try {
    if (!req.body.title) {
      res.status(403).json({message: 'Your project title cannot be empty!'});
      return;
    } else if (!req.body.description) {
      res.status(403).json({message: 'Your project description cannot be empty!'});
      return;
    }
    const new_project_data = await Project.create(req.body);
    const user_list = [req.session.user_id, ...req.body.user_list];
    const project_user_body_array = user_list.map(id => {
      return {
        project_id: new_project_data.id,
        user_id: id
      };
    });
    await ProjectUser.bulkCreate(project_user_body_array);
    res.status(201).json(new_project_data);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const allProjectsData = await Project.findAll({
      include: [{model: User}]
    });
    const allProjects = allProjectsData.map(e => e.get({plain:true}));
    res.status(200).json(allProjects);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}.`});
  }
});

// Get all projects belonging to a specific user
router.get('/user/:id', async (req, res) => {
  try {
    const allProjectsData = await Project.findAll({
      where: {
        '$users.id$': req.params.id,
      },
      include: [
        {
          model: User,
          required: false,
        },
      ],
    });
    const allProjects = allProjectsData.map((e) => e.get({ plain: true }));
    res.status(200).json(allProjects);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}.`});
  }
});

// Get 1 project (including all nested tasks)
router.get('/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [{model: User}]
    });
    const project = projectData.get({plain:true});

    const allTasks = await getNestedTasks(
      {title:project.title, id:null}, 
      project.id
    );
    res.status(200).json(allTasks);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}.`});
  }

});

module.exports = router;
