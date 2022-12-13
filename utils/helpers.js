module.exports = {
  isMe: (myID, userID) => {
    console.log(myID);
    console.log(userID);
    return myID == userID;
  }
};
