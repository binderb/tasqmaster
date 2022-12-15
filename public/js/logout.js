const logout = async (e) => {
  e.preventDefault();
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    const response_json = await response.json();
    alert(`${response.status}: ${response.statusText}\n${response_json.message}`);
  }
};

document.querySelector('#logout').addEventListener('click', logout);
