const helpers = {

  displayTaskDetails : function (data) {
    document.querySelector('#project-details').setAttribute('style','display:none;');
    document.querySelector('#task-details').setAttribute('style','display:block;');
    document.querySelector('#task-title').innerHTML = `${data.title}`;
    document.querySelector('#task-author').innerHTML = `authored by <b>${data.author.username}</b>`;
    document.querySelector('#task-description').innerHTML = `${data.description}`;
    document.querySelector('#task-label').innerHTML = `${data.label}`;
    document.querySelector('#task-status').innerHTML = `${data.status}`;
    const assignee_text = data.assignee.username ? data.assignee.username : 'N/A';
    document.querySelector('#task-assignee').innerHTML = `${assignee_text}`;

  },

  displayProjectDetails : function () {
    document.querySelector('#project-details').setAttribute('style','display:block;');
    document.querySelector('#task-details').setAttribute('style','display:none;');
  }

}