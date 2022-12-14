const showEditor = (isNew) => {
  document.querySelector('#project-details').setAttribute('style','display:none;');
  document.querySelector('#task-details').setAttribute('style','display:none;');
  document.querySelector('#task-editor').setAttribute('style','display:block;');
  document.querySelector('#delete-task').disabled = true;
  document.querySelector('#new-task').disabled = true;
}

document.querySelector('#new-task').addEventListener('click', () => {showEditor(true)});