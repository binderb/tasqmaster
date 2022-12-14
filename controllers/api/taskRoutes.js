const router = require('express').Router();
const { Project, User, Task } = require('../../models');
const { withAuthAPI } = require('../../utils/auth');
const { getNestedTasks } = require('../helpers');

router.delete('/Task/:id', withAuthAPI, async (req, res) => {
    try {
      // Make sure user is the author of the post
      const TaskId = await Project.findByPk(req.params.id, {
        include: [{model: User}]
      });
      if (!TaskId) {
        res.status(404).json({message: 'Task with given ID not found!'});
        return;
      }
      const project = TaskId.get({plain:true});
      if (project.users.filter(e => e.id == req.session.userID).length == 0) {
        res.status(403).json({message: 'You are trying to delete a task over which you do not have ownership.'});
        return;
      }
  
      await Project.destroy({
        where: {id: req.params.id}
      });
  
      res.status(200).json({message: 'Task deleted successfully.'});
    
    } catch (err) {
      res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
    }
  });
  

module.exports = router;