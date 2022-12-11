const router = require('express').Router();

const apiRoutes = require('./api');
const viewMainRoutes = require('./viewMainRoutes');
const viewProjectRoutes = require('./viewProjectRoutes');

router.use('/', viewMainRoutes);
router.use('/projects', viewProjectRoutes);
router.use('/api', apiRoutes);

module.exports = router;
