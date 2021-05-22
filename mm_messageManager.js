// Sends a message
function mm_sendMessage() {
  var message = document.getElementById("i_messageInput").value;
  var messageArray = fb_readRec(roomKey, "messages");

  if (message != null && message != undefined && message != "") {
    document.getElementById("i_messageInput").value = "";
    fb_write(roomKey, "messages", messageArray + userDetails.name + ": " + message + "<br>");
  }
}

// Reads the messages for that room
function mm_readMessages() {
  var messageArray = fb_readRec(roomKey, "messages");
  document.getElementById("p_messageDisplay").innerHTML = messageArray;
}

// Clears all the messages in that room
function mm_clearMessages() {
  fb_write(roomKey, "messages", "");
}

// The draw function for the message manager
function mm_draw() {
  mm_readMessages();
}

// Called when a button is pressed while typing
function mm_enterPressed() {
  if (key == "Enter") {
    mm_sendMessage();
  }
}