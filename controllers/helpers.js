const { Task } = require('../models');

const getNestedTasks = async (task,project) => {
  let subTasks = await Task.findAll({
      where: {
          parent_id: task.id,
          project_id: project
      },
      raw : true
  });

  let radius = Math.floor(100+Math.random()*400);
  if (subTasks.length > 0) {
      const promises = [];
      subTasks.forEach(task => {
          promises.push(getNestedTasks(task,project));
      });
      task['size'] = radius;
      task['children'] = await Promise.all(promises);
  }
  else {
    task['size'] = radius;
  }
  return task;
};

module.exports = {
  getNestedTasks
}