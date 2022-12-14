const router = require('express').Router();
const { Project, User, Task } = require('../../models');
const { withAuthAPI } = require('../../utils/auth');
const { getNestedTasks } = require('../helpers');

// Get an alphabetical list of tasks for 1 project
router.get('/projects/:id', async (req, res) => {
  try {
    const allTasksData = await Task.findAll({
      where: {
        project_id: req.params.id
      },
      order: [['title','DESC']]
    });
    if (!allTasksData) {
      res.status(404).json({message:'Project ID not found!'});
      return;
    }
    const allTasks = allTasksData.map(e => e.get({plain:true}));
    res.status(200).json(allTasks);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }

});

module.exports = router;