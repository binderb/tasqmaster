const helpers = {

  displayTaskDetails : function (data) {
    document.querySelector('#task-title').innerHTML = `${data.title}`;
  }
}