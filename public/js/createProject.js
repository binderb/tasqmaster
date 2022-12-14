const createProject = async (e) => {
  e.preventDefault();
  const userList = [];
  const userBlocks = document.querySelectorAll('.user-block');
  userBlocks.forEach((el,i) => userList.push(el.getAttribute('data-id')));
  const form_data = {
    title: document.querySelector('#title').value.trim(),
    description: document.querySelector('#description').value.trim(),
    userList: userList
  }
  const response = await fetch('/api/projects/', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(form_data)
  });
  if (response.ok) {
    document.location.replace('/dashboard');
  } else if (response.status == 404) {
    document.location.replace('/404');
  } else {
    const response_data = await response.json();
    document.querySelector('#outer-err').textContent = response_data.message;
  }
}

document.querySelector('#submit').addEventListener('click',createProject);