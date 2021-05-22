/**************************************************************/
// im_interfaceManager.js
// Written by Finn Thompson - Term 1/2 2021
/**************************************************************/
var canvas;
var canvasArea = document.getElementById("d_canvasArea");
var landingPage = document.getElementById("s_landingPage");
var gamePage = document.getElementById("s_gamePage");
var registerPage = document.getElementById("s_register");
var settingsPage = document.getElementById("s_settingsPage");

function setup() {
  im_showOnly("s_gamePage");
  canvas = createCanvas(canvasArea.offsetWidth, canvasArea.offsetHeight);
  canvas.parent("d_canvasArea");
  
  
  fb_setup();
}

async function draw() {
  document.getElementById("p_money").innerHTML = "$" + userDetails.money;
  await ga_draw();
}

/**************************************************************/
// im_hide(_id)
// Hides the section with _id
// Input:  The section to hide
// Return: n/a
/**************************************************************/
function im_hide(_id) {
  console.log("im_hide: _id= " + _id);
  document.getElementById(_id).style.display = "none";
}

/**************************************************************/
// im_hideAll()
// Hides all sections
// Input:  n/a
// Return: n/a
/**************************************************************/
function im_hideAll() {
  console.log("im_hideAll");

  landingPage.style.display = "none";
  gamePage.style.display = "none";
  registerPage.style.display = "none";
  settingsPage.style.display = "none";
}

/**************************************************************/
// im_show(_id, _displayType)
// Shows the section with _id using _displayType
// Input:  _id, _displayType
// Return: n/a
/**************************************************************/
function im_show(_id, _displayType) {
  console.log("im_show: _id= " + _id + "  _displayType= " + _displayType);

  if (_displayType == null || _displayType == undefined) {
    _displayType = "block";
  }
  document.getElementById(_id).style.display = _displayType;
}

/**************************************************************/
// im_showOnly(_id, _displayType)
// Hides all sections except for _id and shows _id with _displayType
// Input:  _id, _displayType
// Return: n/a
/**************************************************************/
function im_showOnly(_id, _displayType) {
  console.log("im_showOnly: _id= " + _id + "  _displayType= " + _displayType);

  if (_displayType == null || _displayType == undefined) {
    _displayType = "block";
  }
  im_hideAll();
  document.getElementById(_id).style.display = _displayType;
}

/**************************************************************/
// im_createFriendIcon(_friend, _uid, _request)
// Creates an icon for the user with _uid. Uses _friend to show
//   name and photo. If _request is true then the icon will have
//   accept and deny friend request buttons
// Input:  _friend, _uid, _request
// Return: n/a
/**************************************************************/
function im_createFriendIcon(_friend, _uid, _request) {
  console.log("im_createFriendIcon: _friend= " + JSON.stringify(_friend) + " _uid= " + _uid
      + " _request= " + _request);

  if (_request == true) {
    // If the icon to be created is a friend request icon then it will create the
    //   icon with accept and deny buttons
    document.getElementById("d_friendRequests").innerHTML +=
        '<div class="d_friendIconGrid" id="' + _uid + '">'
        + '<img src=' + _friend.photo + ' class="icon">'
        + '<p class="friendName">' + _friend.name + '</p> <div style="height: 22px; grid-column: 2;">'
        + '<button class="friendRequestButton" onclick="mm_acceptFriendRequest(' + "'"
          + _uid  + "', '" + _friend.name + "', '" + _friend.photo + "'" + ')">Accept</button>'
        + '<button class="friendRequestButton" onclick="mm_denyFriendRequest('
          + "'" + _uid  + "'" + ')">Deny</button> </div> </div>';
  } else {
    // If this icon to be created isn't a friend request it will be a button
    //   with the change chat function
    document.getElementById("d_friends").innerHTML +=
        '<button class="d_friendIconGrid" onclick="mm_changeChat(' + "'" + _uid + "'" + ')" id="' + _uid + '">'
        + '<img src=' + _friend.photo + ' class="icon">'
        + '<p class="friendName" style="grid-column: 2; grid-row-end: 1;">' + _friend.name + '</p>'
        + '</button>';

    if (_friend.playing) {
      document.getElementById(_uid).innerHTML += '<div style="position: absolute; width: 15px; height: 15px; border-radius: 100%; margin: 25px; background: #515151;"><div style="width: 10px; height: 10px; border-radius: 100%; margin: 2.5px; background: #0fa81a;"></div></div>'
    }
  }
}


/**************************************************************/
// im_drawMessage(_messages)
// Draws the messages
// Input:  _messages
// Return: n/a
/**************************************************************/
function im_drawMessage(_messages) {
  console.log("im_drawMessage: _messages= " + JSON.stringify(_messages));
  document.getElementById("p_messageDisplay").innerHTML = "";

  for (var i in _messages) {
    document.getElementById("p_messageDisplay").innerHTML +=
    '<div class="d_message">' +
    '<img src="' + _messages[i].icon + '" class="icon">' +
    '<p class="friendName">' + _messages[i].name + '</p>' +
    '<p style="grid-column: 2; padding-left: 5px;">' + _messages[i].message +
    '</p></div>'
  }
  var objDiv = document.getElementById("p_messageDisplay");
  objDiv.scrollTop = objDiv.scrollHeight;
}
/*<div class="d_message">
          <img src="https://lh3.googleusercontent.com/a-/AOh14GhPl-fSSCemGONRGgH6bZKN6w_9vT4jtxBoCi6i=s96-c" class="icon">
          <p class="friendName">Username</p>
          <p style="grid-column: 2; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto; white-space: normal;">
            
          </p>
        </div>*/