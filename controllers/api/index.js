const router = require("express").Router();
const userRoutes = require("./userRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
