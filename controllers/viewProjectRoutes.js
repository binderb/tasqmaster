const router = require('express').Router();
const { Project, User, Task } = require('../models');
const withAuth = require('../utils/auth');
const { getNestedTasks } = require('./helpers');

router.get('/:id', async (req, res) => {
  try {

    res.render('singleProject');
    

  } catch (err) {
    res.status(500).json(`Internal Server Error: ${err.name}`);
  }
});

module.exports = router;