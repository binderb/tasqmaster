const removeUser = (e) => {
  e.preventDefault();
  const userBlock = e.target.parentElement;
  console.log(e.target);
  console.log(userBlock);
  userBlock.remove();
}

const removes = document.querySelectorAll('.remove-user');
removes.forEach((el,i) => el.addEventListener('click',removeUser));