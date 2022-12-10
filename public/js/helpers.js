const helpers = {

  displayTaskDetails : function (data) {
    document.querySelector('#task-title').innerHTML = `<b>Title:</b>&nbsp;${data.title}`;
  }

}