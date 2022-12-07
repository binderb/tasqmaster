const sequelize = require('../config/connection');
const { User, Project, Task, ProjectUser } = require('../models');

const userData = require('./userData.json');
const taskData = require('./taskData.json');
const projectData = require('./projectData.json');
const projectUserData = require('./projectUserData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true
  });

  const projects = await Project.bulkCreate(projectData);

  const projectUsers = await ProjectUser.bulkCreate(projectUserData);

  const tasks = await Task.bulkCreate(taskData);

  // for (const project of projectData) {
  //   await Project.create({
  //     ...project,
  //     user_id: users[Math.floor(Math.random() * users.length)].id,
  //   });
  // }

  process.exit(0);
};

seedDatabase();
