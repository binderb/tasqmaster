const router = require("express").Router();
const apiRoutes = require("./api");
const viewMainRoutes = require("./viewMainRoutes");
const viewProjectRoutes = require("./viewProjectRoutes");
const viewEditRoutes = require("./viewEditRoutes");

router.use("/", viewMainRoutes);
router.use("/projects", viewProjectRoutes);
router.use("/edit", viewEditRoutes);
router.use("/api", apiRoutes);

module.exports = router;
