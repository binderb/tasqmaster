const router = require('express').Router();
const { Project, User } = require('../models');
const withAuthView = require('../utils/auth');
router.get("/login", (req,res) => {
res.render("login")
});
module.exports = router;
