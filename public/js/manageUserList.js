const addUser = async (e) => {
  e.preventDefault();
  const username = document.querySelector('#user-search').value.trim();
  const userData = await fetch('/api/users/search?name='+username);

  if (userData.ok) {
    const user = await userData.json();
    // check to see if the user is already in the list
    const existingUsers = [];
    const userBlocks = document.querySelectorAll('.user-block');
    userBlocks.forEach((el,i) => existingUsers.push(el.querySelector('p').textContent.split('(')[0].trim()));
    console.log(existingUsers);
    if (existingUsers.includes(user.username)) {
      document.querySelector('#err').textContent = 'User already added to the list!';
      document.querySelector('#err').setAttribute('style','');
      $('#user-search').autocomplete('close');
      return;
    }
    const userBlock = document.createElement('div');
    userBlock.setAttribute('class','p-2 my-2 bg-dark-glass d-flex justify-content-between align-items-center rounded user-block');
    userBlock.setAttribute('data-id',user.id);
    const userText = document.createElement('p');
    userText.setAttribute('class','m-0');
    userText.textContent = user.username;
    userBlock.append(userText);
    const userDelete = document.createElement('button');
    userDelete.setAttribute('class','btn btn-danger fa-solid fa-trash-can remove-user');
    userDelete.addEventListener('click',removeUser);
    userBlock.append(userDelete);
    document.querySelector('#user-list').append(userBlock);
    document.querySelector('#err').setAttribute('style','display:none;');
    document.querySelector('#user-search').value = '';
    $('#user-search').autocomplete('close');
  } else {
    const err = await userData.json();
    document.querySelector('#err').textContent = err.message;
    document.querySelector('#err').setAttribute('style','');
    $('#user-search').autocomplete('close');
  }
}

const removeUser = (e) => {
  e.preventDefault();
  const userBlock = e.target.parentElement;
  console.log(e.target);
  console.log(userBlock);
  userBlock.remove();
}

const populateUserSearch = async () => {
  const usersExceptMeData = await fetch('/api/users/other');
  if (usersExceptMeData.ok) {
    const usersExceptMe = await usersExceptMeData.json();
    const usernamesExceptMe = usersExceptMe.map(e => e.username);
    $('#user-search').autocomplete({
      source: usernamesExceptMe
    });
  } else {
    const err = await usersExceptMeData.json();
    alert(err.message);
  }
} 

document.querySelector('#add-user').addEventListener('click',addUser);
document.querySelector('#user-search').addEventListener('submit',addUser);
const removes = document.querySelectorAll('.remove-user');
removes.forEach((el,i) => el.addEventListener('click',removeUser));
populateUserSearch();