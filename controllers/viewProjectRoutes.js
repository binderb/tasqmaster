const router = require("express").Router();
const { Project, User, Task } = require("../models");
const { withAuthView } = require("../utils/auth");
const { getNestedTasks } = require("./helpers");

// Display single project
router.get("/:id", async (req, res) => {
  try {
    // Get the project details.
    const projectData = await Project.findByPk(req.params.id, {
      include: [{ model: User }],
    });
    const project = projectData.get({ plain: true });
    // If the user is logged in, check if they have ownership
    // on this project, and set a flag for editing capability if so.

    // Render the page.
    res.render("singleProject", {
      project,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      userID: req.session.userID,
    });
  } catch (err) {
    res.status(500).json(`Internal Server Error: ${err.name}`);
  }
});

module.exports = router;
