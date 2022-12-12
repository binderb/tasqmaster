const router = require('express').Router();
const { User } = require('../../models');
const { withAuthAPI } = require('../../utils/auth');

// Create 1 user
router.post('/', async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.status(403).json({message: 'You must supply a username, email, and password!'});
      return;
    }
    const newUserData = await User.create(req.body);
    req.session.loggedIn = true;
    req.session.userId = newUserData.id;
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
    req.session.userId = userData.id;
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
