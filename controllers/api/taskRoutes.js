const router = require("express").Router();
const { Project, User, Task } = require("../../models");
const { withAuthAPI } = require("../../utils/auth");
const { getNestedTasks } = require("../helpers");

// Get 1 task
router.get('/:id', async (req, res) => {
  try {
    const taskData = await Task.findByPk(req.params.id);
    const task = taskData.get({plain:true});
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }

});

// Delete 1 task
router.delete("/:id", withAuthAPI, async (req, res) => {
  try {
    // Make sure user is the author of the post
    const taskData = await Task.findByPk(req.params.id);
    if (!taskData) {
      res.status(404).json({ message: "Task with given ID not found!" });
      return;
    }
    const task = taskData.get({ plain: true });
    if (task.user_id != req.session.userID) {
      res
        .status(403)
        .json({
          message:
            "You are trying to delete a task over which you do not have ownership.",
        });
      return;
    }

    await Task.destroy({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${err.name}: ${err.message}` });
  }
});

// Get an alphabetical list of tasks for 1 project
router.get("/projects/:id", async (req, res) => {
  try {
    const allTasksData = await Task.findAll({
      where: {
        project_id: req.params.id,
      },
      order: [["title", "ASC"]],
    });
    if (!allTasksData) {
      res.status(404).json({ message: "Project ID not found!" });
      return;
    }
    const allTasks = allTasksData.map((e) => e.get({ plain: true }));
    res.status(200).json(allTasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${err.name}: ${err.message}` });
  }
});

// Create 1 task
router.post('/', withAuthAPI, async (req, res) => {
  try {
    if (!req.body.title) {
      res.status(403).json({message: 'Your task title cannot be empty!'});
      return;
    } else if (!req.body.description) {
      res.status(403).json({message: 'Your task description cannot be empty!'});
      return;
    }
    const new_task_body = {
      user_id: req.session.userID,
      ...req.body
    }
    const new_task_data = await Task.create(new_task_body);
    res.status(201).json(new_task_data);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }
});

// Update 1 task
router.put('/:id', withAuthAPI, async (req, res) => {
  try {
    if (!req.body.title) {
      res.status(403).json({message: 'Your task title cannot be empty!'});
      return;
    } else if (!req.body.description) {
      res.status(403).json({message: 'Your task description cannot be empty!'});
      return;
    }
    const taskData = await Task.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    res.status(200).json(taskData);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}`});
  }
})

module.exports = router;
