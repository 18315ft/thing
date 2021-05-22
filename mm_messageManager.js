var messageArray

/**************************************************************/
// mm_sendMessage()
// Sends a message to that room
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_sendMessage() {
  var message = document.getElementById("i_messageInput").value;

  if (message != null && message != undefined && message != "") {
    document.getElementById("i_messageInput").value = "";
    if (messageArray != null) {
      fb_write(roomKey, "messages", messageArray + userDetails.name +
       ": " + message + "<br>");
    } else {
      fb_write(roomKey, "messages", userDetails.name +
       ": " + message + "<br>");
    }
  }
}

/**************************************************************/
// mm_readMessages()
// Reads all the messages in that room
// Input:  n/a
// Return: n/a
/**************************************************************/
async function mm_readMessages() {
  messageArray = await fb_asyncRead(roomKey, "messages");
  document.getElementById("p_messageDisplay").innerHTML = messageArray;
}

/**************************************************************/
// mm_clearMessages()
// Clears all the messages in that room
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_clearMessages() {
  fb_write(roomKey, "messages", "");
}

/**************************************************************/
// mm_draw()
// All of the things from mm_messageManager that would be in the
//   draw function
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_draw() {
  roomKey = "testGame/" + document.getElementById("i_roomCode").value;
  mm_readMessages();
}

/**************************************************************/
// mm_keyPressed()
// Runs whenever a key is pressed while typing in the message input
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_keyPressed() {
  if (key == "Enter") {
    mm_sendMessage();
  }
}

/**************************************************************/
// mm_findFriend()
// Finds a friend using the i_findFriend input
// Input:  n/a
// Return: n/a
/**************************************************************/
async function mm_findFriend() {
  var friend = document.getElementById("i_findFriend").value;
  if (await fb_checkForUsername(friend)) {
    console.log("friend found");
    var friend = await fb_getDetailsOfUsername(friend);
    fb_write("userDetails", userDetails.uid + "/friends/" + friend.uid, friend.username);
    fb_write("userDetails", friend.uid + "/friendRequests/" + userDetails.uid, userDetails.username);
  } else {
    console.log("friend not found");
  }
}

/**************************************************************/
// mm_checkFriends()
// Checks for any friend requests
// Input:  n/a
// Return: n/a
/**************************************************************/
async function mm_checkFriends() {
  console.log("mm_checkFriends");
  var friendRequests = await fb_read("userDetails", userDetails.uid + "/friendRequests");
  if (friendRequests != null) {
    for (i in friendRequests) {
      im_createFriendIcon(friendRequests[i], true);
    }
  } else {
    console.log("no friend requests");
  }
}