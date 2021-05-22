/**************************************************************/
// mm_messageManager.js
// Written by Finn Thompson - Term 1/2 2021
/**************************************************************/
var messageArray

/**************************************************************/
// mm_draw()
// All of the things from mm_messageManager that would be in the
//   draw function
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_draw() {
  roomKey = "testGame/" + document.getElementById("i_roomCode").value;
  document.getElementById("p_messageDisplay").innerHTML = messageArray;
}

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
      fb_write(roomKey, "messages", messageArray + userDetails.username +
       ": " + message + "<br>");
    } else {
      fb_write(roomKey, "messages", userDetails.username +
       ": " + message + "<br>");
    }
  }
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
// mm_sendFriendRequest()
// Finds a friend using the i_findFriend input
// Input:  n/a
// Return: n/a
/**************************************************************/
async function mm_sendFriendRequest() {
  var friend = {username: document.getElementById("i_findFriend").value};

  if (fb_checkForUsername(friend.username)) {
    console.log("friend found");
    friend = await fb_getDetailsOfUsername(friend.username);
    fb_write("userDetails", userDetails.uid + "/friends/" + friend.uid, friend.username);
    fb_write("userDetails", friend.uid + "/friendRequests/" + userDetails.uid, userDetails.username);
    console.log(JSON.stringify(userDetails));
  } else {
    console.log("friend not found");
  }
}

/**************************************************************/
// mm_acceptFriendRequest()
// Accepts friend requests
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_acceptFriendRequest(_friend) {
  console.log("mm_acceptFriendRequest: _friend= " + _friend);
  fb_delete("userDetails", userDetails.uid + "/friendRequests/" + _friend);
  fb_write("userDetails", userDetails.uid + "/friends/" + _friend, _friend);
}

/**************************************************************/
// mm_denyFriendRequest()
// Accepts friend requests
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_denyFriendRequest(_friend) {
  console.log("mm_denyFriendRequest: _friend= " + _friend);
  fb_delete("userDetails", userDetails.uid + "/friendRequests/" + _friend);
  fb_delete("userDetails", _friend + "/friends/" + userDetails.uid);
}

/**************************************************************/
// mm_checkFriends(_friends)
// Checks for any friends
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_checkFriends(_friends) {
  console.log("mm_checkFriends: _friends= " + JSON.stringify(_friends));

  if (_friends == null) {
    console.log("no friends");
  } else {
    for (var i in _friends) {
      im_createFriendIcon(_friends[i], i, false);
    }
  }
}

/**************************************************************/
// mm_checkFriendRequests(_friendRequests)
// Checks for any friend requests
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_checkFriendRequests(_friendRequests) {
  console.log("mm_checkFriendRequests: _friendRequests= " + JSON.stringify(_friendRequests));

  if (_friendRequests == null) {
    console.log("no friend requests");
  } else {
    for (i in _friendRequests) {
      im_createFriendIcon(_friendRequests[i], i, true);
    }
  }
}