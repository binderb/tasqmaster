const Task = require('./Task');
const User = require('./User');
const Project = require('./Project');
const ProjectUser = require('./ProjectUser');

User.hasMany(Task, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

User.hasMany(Task, {
  foreignKey: 'assignee_id',
  onDelete: 'SET NULL'
});

Task.belongsTo(User, {
  foreignKey: 'user_id'
});

Task.belongsTo(User, {
  foreignKey: 'assignee_id'
});

Project.hasMany(Task, {
  foreignKey: 'project_id',
  onDelete: 'CASCADE'
});

Task.belongsTo(Project, {
  foreignKey: 'project_id'
});

Task.hasOne(Task, {
  foreignKey: 'parent_id',
  onDelete: 'CASCADE'
});

Task.belongsTo(Task, {
  foreignKey: 'parent_id'
});

User.belongsToMany(Project, {
  through: ProjectUser,
  uniqueKey: 'unique_id',
  foreignKey: 'user_id'
});

Project.belongsToMany(User, {
  through: ProjectUser,
  uniqueKey: 'unique_id',
  foreignKey: 'project_id'
});

module.exports = { User, Project, Task, ProjectUser };
