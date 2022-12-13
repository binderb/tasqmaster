const router = require("express").Router();
const { Project, User } = require("../models");
const { withAuthView } = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const allProjectsData = await Project.findAll({
      limit: 5,
      order: [["id", "DESC"]],
      include: [{ model: User }],
    });
    const allProjects = allProjectsData.map((e) => e.get({ plain: true }));

    res.render("homepage", {
      allProjects,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      userID: req.session.userID,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${err.name}: ${err.message}.` });
  }
});

router.get("/dashboard", async (req, res) => {
  // Get a list of all projects belonging to the logged in user
  try {
    console.log(req.session.userID);
    const allProjectsData = await Project.findAll({
      where: {
        '$users.id$': req.session.userID,
      },
      include: [
        {
          model: User,
          required: false,
        },
      ],
    });
    const allProjects = allProjectsData.map((e) => e.get({ plain: true }));
    res.render("dashboard", {
      allProjects,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      userID: req.session.userID,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${err.name}: ${err.message}.` });
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login-signup", {
    showLogin: true,
  });
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login-signup", {
    showLogin: false,
  });
});

module.exports = router;
