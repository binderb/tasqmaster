const showEditor = async (e, isNew) => {
  document.querySelector('#project-details').setAttribute('style','display:none;');
  document.querySelector('#task-details').setAttribute('style','display:none;');
  document.querySelector('#task-editor').setAttribute('style','display:block;');
  document.querySelector('#delete-task').disabled = true;
  document.querySelector('#new-task').disabled = true;

  const project_id = document.querySelector('#project-title').getAttribute('data-id');
  const allTasksResponse = await fetch('/api/tasks/projects/'+project_id);
  const allTasks = await allTasksResponse.json();
  console.log(allTasks);
}

const hideEditor = (e) => {
  document.querySelector('#project-details').setAttribute('style','display:block;');
  document.querySelector('#task-details').setAttribute('style','display:none;');
  document.querySelector('#task-editor').setAttribute('style','display:none;');
  document.querySelector('#delete-task').disabled = true;
  document.querySelector('#new-task').disabled = false;
}

document.querySelector('#new-task').addEventListener('click', (e) => {showEditor(e,true)});
document.querySelector('#cancel-new-task').addEventListener('click', hideEditor);