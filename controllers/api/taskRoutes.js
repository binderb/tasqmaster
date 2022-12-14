const router = require('express').Router();
const { Project, User, Task } = require('../../models');
const { withAuthAPI } = require('../../utils/auth');
const { getNestedTasks } = require('../helpers');

//-------------------------------CREATES A NEW TASK-------------------------------//
router.post('/', withAuthAPI, async (req, res) => {
    try {
      if (!req.body.title) {
        res.status(403).json({message: 'Your task title cannot be empty!'});
        return;
      } else if (!req.body.description) {
        res.status(403).json({message: 'Your task description cannot be empty!'});
        return;
      } else if (!req.body.userList) {
        res.status(403).json({message: 'You must give access to this task to at least 1 user!'});
        return;
      }
      const new_task_data = await Project.create(req.body);
      const task_user_body_array = req.body.userList.map(id => {
        return {
          task_id: new_task_data.id,
          user_id: id
        };
      });
      await TaskUser.bulkCreate(task_user_body_array);
      res.status(201).json(new_task_data);
    } catch (err) {
      res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
    }
  })
  //----------------------------------------------------------------------------------------//



  



  //-------------------------------CREATES A PUT-------------------------------//
router.put('/:id', withAuthAPI, async (req, res) => {
    try {
      if (!req.body.title) {
        res.status(403).json({message: 'Your task title cannot be empty!'});
        return;
      } else if (!req.body.description) {
        res.status(403).json({message: 'Your task description cannot be empty!'});
        return;
      } else if (!req.body.userList) {
        res.status(403).json({message: 'You must give access to at least 1 user!'});
        return;
      }
      const taskData = await Task.update(req.body, {
        where: {
          id: req.params.id,
        }
      });
      await TaskUser.destroy({ 
        where: { 
          task_id: req.params.id 
        } 
      });
      const task_user_body_array = req.body.userList.map(id => {
        return {
          task_id: req.params.id,
          user_id: id
        };
      });
      await TaskUser.bulkCreate(task_user_body_array);
      
      res.status(200).json('Task updated successfully.');
    } catch (err) {
      res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
    }
  });

  //----------------------------------------------------------------------------------------//

module.exports = router;