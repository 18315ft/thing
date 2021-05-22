/**************************************************************/
// mm_messageManager.js
// Written by Finn Thompson - Term 1/2 2021
/**************************************************************/
var messageArray;
var roomKey;

/**************************************************************/
// mm_draw()
// All of the things from mm_messageManager that would be in the
//   draw function
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_draw() {
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

  if (roomKey == "home") {
    if (message != null && message != undefined && message != "") {
      document.getElementById("i_messageInput").value = "";
      if (messageArray != null) {
        fb_write("messages", roomKey, messageArray + userDetails.username +
        ": " + message + "<br>");
      } else {
        fb_write("messages", roomKey, userDetails.username +
        ": " + message + "<br>");
      }
    }
  } else {
    if (message != null && message != undefined && message != "") {
      document.getElementById("i_messageInput").value = "";
      if (messageArray != null) {
        fb_write("messages", roomKey + userDetails.uid, messageArray + userDetails.username +
        ": " + message + "<br>");
        fb_write("messages", userDetails.uid + roomKey, messageArray + userDetails.username +
        ": " + message + "<br>");
      } else {
        fb_write("messages", roomKey + userDetails.uid, userDetails.username +
        ": " + message + "<br>");
        fb_write("messages", userDetails.uid + roomKey, userDetails.username +
        ": " + message + "<br>");
      }
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
    friend = await fb_getDetailsOfUsername(friend.username);

  if (friend.uid) {
    console.log("friend found");
    fb_write("userDetails", userDetails.uid + "/friends/" + friend.uid,
     {name: friend.username, photo: friend.icon});
     
    fb_write("userDetails", friend.uid + "/friendRequests/" + userDetails.uid,
     {name: userDetails.username, photo: userDetails.icon});
     
    console.log("request sent");
  } else {
    console.log("friend not found");
  }
}

/**************************************************************/
// mm_acceptFriendRequest(_uid, _name, _photo)
// Accepts friend requests. Uses _uid, _name and _photo to put
//   all of the required data into the database
// Input:  _uid, _name, _photo
// Return: n/a
/**************************************************************/
function mm_acceptFriendRequest(_uid, _name, _photo) {
  console.log("mm_acceptFriendRequest: _uid= " + _uid + " _friend: " + _name + " _photo: " + _photo);
  fb_delete("userDetails", userDetails.uid + "/friendRequests/" + _uid);
  fb_write("userDetails", userDetails.uid + "/friends/" + _uid, {name: _name, photo: _photo});
}

/**************************************************************/
// mm_denyFriendRequest(_uid)
// Denys friend requests from _uid
// Input:  _uid
// Return: n/a
/**************************************************************/
function mm_denyFriendRequest(_uid) {
  console.log("mm_denyFriendRequest: _uid= " + _uid);
  fb_delete("userDetails", userDetails.uid + "/friendRequests/" + _uid);
  fb_delete("userDetails", _uid + "/friends/" + userDetails.uid);
}

/**************************************************************/
// mm_checkFriends(_friends)
// Checks for any friends
// Called by fb_readOn at the start
// Input:  _friends
// Return: n/a
/**************************************************************/
function mm_checkFriends(_friends) {
  console.log("mm_checkFriends: _friends= " + JSON.stringify(_friends));
  document.getElementById("d_friends").innerHTML = "";

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
// Called by fb_readOn at the start
// Input:  _friendRequests
// Return: n/a
/**************************************************************/
function mm_checkFriendRequests(_friendRequests) {
  console.log("mm_checkFriendRequests: _friendRequests= " + JSON.stringify(_friendRequests));
  document.getElementById("d_friendRequests").innerHTML = "";

  if (_friendRequests == null) {
    console.log("no friend requests");
  } else {
    for (var i in _friendRequests) {
      im_createFriendIcon(_friendRequests[i], i, true);
    }
  }
}

/**************************************************************/
// mm_changeChat(_uid)
// changes the chat
// Input:  n/a
// Return: n/a
/**************************************************************/
function mm_changeChat(_uid) {
  fb_stopRead("messages", roomKey);

  roomKey = _uid;

  if (roomKey == "home") {
  fb_readOn("messages", roomKey, function(_data) {
            messageArray = _data;
          });
  } else {
  fb_readOn("messages", userDetails.uid + roomKey, function(_data) {
            messageArray = _data;
          });
  }
}