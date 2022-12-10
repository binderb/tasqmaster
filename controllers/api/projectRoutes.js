const router = require('express').Router();
const { Project, User, Task } = require('../../models');
const withAuth = require('../../utils/auth');
const { getNestedTasks } = require('../helpers');

router.get('/:id', async (req, res) => {
  
  const projectData = await Project.findByPk(req.params.id, {
    include: [{model: User}]
  });
  const project = projectData.get({plain:true});

  const allTasks = await getNestedTasks(
    {title:project.title, id:null}, 
    project.id
  );
  
  res.status(200).json(allTasks);

});

module.exports = router;
