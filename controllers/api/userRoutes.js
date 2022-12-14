const router = require('express').Router();
const { User, Project } = require('../../models');
const { withAuthAPI } = require('../../utils/auth');
const { Op } = require("sequelize");

// Create 1 user
router.post('/', async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.status(403).json({message: 'You must supply a username, email, and password!'});
      return;
    }
    const newUserData = await User.create(req.body);
    req.session.loggedIn = true;
    req.session.userID = newUserData.id;
    req.session.username = newUserData.username;
    await req.session.save(() => {
      res.status(201).json({message: 'Profile created successfully!'});
    });

  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(403).json({message: 'Username already exists! Please try a different one.'});
    } else if (err.name === 'SequelizeValidationError') {
      if (err.message.includes('Validation error: Validation isEmail on email failed')) {
        res.status(403).json({message: 'You must provide a valid email address!'});
      } else if (err.message.includes('Validation error: Validation len on password failed')) {
        res.status(403).json({message: 'Your password must be at least 8 characters long!'});
      } else {
        res.status(403).json({message: err.message});
      }
    } else {
      res.status(500).json({message: `Internal Server Error: ${err.name}`});
    }
  }
});

// Get user list except self
router.get('/other', withAuthAPI, async (req, res) => {
  try {
    const otherUserData = await User.findAll({
      where: {
        id: {
          [Op.not]: req.session.userID
        }
      },
      attributes: { exclude: ['password'] }
    });
    // console.log(otherUserData);
    res.status(200).json(otherUserData);
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}: ${err.message}.`});
  }
});

// Get 1 user by username
router.get('/search', async (req, res) => {
  // console.log(req.query.name);
  const matchData = await User.findOne({
    where: {
      username: req.query.name
    }
  });
  // console.log(matchData);
  if (!matchData) {
    res.status(404).json({message:'Username does not exist in the system!'});
    return;
  }
  res.status(200).json(matchData);
});

// Get an alphabetical list of owning users for 1 project
router.get("/projects/:id", async (req, res) => {
  try {
    const allUsersData = await User.findAll({
      where: {
        '$projects.id$': req.params.id,
      },
      include: [
        {
          model: Project,
          required: false,
        },
      ],
      order: [["username", "ASC"]],
    });
    if (!allUsersData) {
      res.status(404).json({ message: "Project ID not found!" });
      return;
    }
    const allUsers = allUsersData.map((e) => e.get({ plain: true }));
    res.status(200).json(allUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${err.name}: ${err.message}` });
  }
});

// Log in user
router.post('/login', async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(403).json({message: 'You must supply a username and password!'});
      return;
    }

    const userData = await User.findOne({
      where: {username: req.body.username}
    });

    if (!userData) {
      res.status(403).json({message: 'Invalid username or password, please try again!'});
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(403).json({message: 'Invalid username or password, please try again!'});
      return;
    }
    req.session.loggedIn = true;
    req.session.userID = userData.id;
    req.session.username = userData.username;
    req.session.save(() => {
      res.status(200).json({userData, message: 'You are now logged in!'});
    });
  
  } catch (err) {
    res.status(500).json({message: `Internal Server Error: ${err.name}`});
  }
});

// Log out user
router.post('/logout', withAuthAPI, async (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

module.exports = router;
