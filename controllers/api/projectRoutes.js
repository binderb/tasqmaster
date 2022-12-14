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
    } else if (!req.body.userList) {
      res.status(403).json({message: 'You must give access to at least 1 user!'});
      return;
    }
    const new_project_data = await Project.create(req.body);
    const project_user_body_array = req.body.userList.map(id => {
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

// Update 1 project
router.put('/:id', withAuthAPI, async (req, res) => {
  try {
    if (!req.body.title) {
      res.status(403).json({message: 'Your project title cannot be empty!'});
      return;
    } else if (!req.body.description) {
      res.status(403).json({message: 'Your project description cannot be empty!'});
      return;
    } else if (!req.body.userList) {
      res.status(403).json({message: 'You must give access to at least 1 user!'});
      return;
    }
    const projectData = await Project.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    // if (projectData[0] === 0) {
    //   console.log(projectData);
    //   res.status(404).json({message:`No project with the given ID (${req.params.id}) was found!`});
    //   return;
    // }
    // remove all associated entries from ProjectUser
    await ProjectUser.destroy({ 
      where: { 
        project_id: req.params.id 
      } 
    });
    // create an updated set of entries in ProjectUser
    const project_user_body_array = req.body.userList.map(id => {
      return {
        project_id: req.params.id,
        user_id: id
      };
    });
    await ProjectUser.bulkCreate(project_user_body_array);
    
    res.status(200).json('Project updated successfully.');
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
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
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
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
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
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }

});

// Delete 1 project
router.delete('/:id', withAuthAPI, async (req, res) => {
  try {
    // Make sure user is the author of the post
    const projectData = await Project.findByPk(req.params.id, {
      include: [{model: User}]
    });
    if (!projectData) {
      res.status(404).json({message: 'Project with given ID not found!'});
      return;
    }
    const project = projectData.get({plain:true});
    if (project.users.filter(e => e.id == req.session.userID).length == 0) {
      res.status(403).json({message: 'You are trying to delete a project over which you do not have ownership.'});
      return;
    }

    await Project.destroy({
      where: {id: req.params.id}
    });

    res.status(200).json({message: 'Project deleted successfully.'});
  
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }
});

module.exports = router;
