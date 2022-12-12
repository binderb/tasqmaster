const add_user = async (e) => {
  e.preventDefault();
  const form_data = {
    username: document.querySelector('#username').value.trim(),
    email: document.querySelector('#email').value.trim(),
    password: document.querySelector('#password').value.trim()
  }
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(form_data)
  });
  if (response.ok) {
    document.location.replace('/');
  } else {
    const response_data = await response.json();
    document.querySelector('#err').textContent = response_data.message;
  }
}

document.querySelector('#login-signup-form').addEventListener('submit',add_user);