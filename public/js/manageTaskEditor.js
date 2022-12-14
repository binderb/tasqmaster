const showEditor = async (e, isNew) => {
  document.querySelector('#project-details').setAttribute('style','display:none;');
  document.querySelector('#task-details').setAttribute('style','display:none;');
  document.querySelector('#task-editor').setAttribute('style','display:block;');
  document.querySelector('#delete-task').disabled = true;
  document.querySelector('#new-task').disabled = true;

  const project_id = document.querySelector('#project-title').getAttribute('data-id');
  const allTasksResponse = await fetch('/api/tasks/projects/'+project_id);
  const allTasks = await allTasksResponse.json();
  for (task of allTasks) {
    const option_i = document.createElement('option');
    option_i.setAttribute('value',task.id);
    option_i.textContent = task.title;
    document.querySelector('#task-parent-editor').append(option_i);
  }
  const allOwnersResponse = await fetch('/api/users/projects/'+project_id);
  const allOwners = await allOwnersResponse.json();
  for (user of allOwners) {
    const option_i = document.createElement('option');
    option_i.setAttribute('value',user.id);
    option_i.textContent = user.username;
    document.querySelector('#task-assignee-editor').append(option_i);
  }

}

const hideEditor = (e) => {
  document.querySelector('#project-details').setAttribute('style','display:block;');
  document.querySelector('#task-details').setAttribute('style','display:none;');
  document.querySelector('#task-editor').setAttribute('style','display:none;');
  document.querySelector('#delete-task').disabled = true;
  document.querySelector('#new-task').disabled = false;
}

const saveTask = async () => {
  const form_data = {
    project_id: document.querySelector('#project-title').getAttribute('data-id'),
    parent_id: (document.querySelector('#task-parent-editor').value == 'null') ? null : document.querySelector('#task-parent-editor').value,
    title: document.querySelector('#task-title-editor').value.trim(),
    description: document.querySelector('#task-description-editor').value.trim(),
    label: document.querySelector('#task-label-editor').value,
    status: document.querySelector('#task-status-editor').value,
    assignee_id: (document.querySelector('#task-assignee-editor').value == 'null') ? null : document.querySelector('#task-assignee-editor').value
  }
  const response = await fetch('/api/tasks/', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(form_data)
  });
  if (response.ok) {
    document.location.reload();
  } else if (response.status == 404) {
    document.location.replace('/404');
  } else {
    const response_data = await response.json();
    document.querySelector('#err').textContent = response_data.message;
  }
}

document.querySelector('#new-task').addEventListener('click', (e) => {showEditor(e,true)});
document.querySelector('#cancel-new-task').addEventListener('click', hideEditor);
document.querySelector('#confirm-new-task').addEventListener('click', saveTask);