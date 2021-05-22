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
  frameRate(5);
  im_showOnly("s_gamePage");
  canvas = createCanvas(canvasArea.offsetWidth, canvasArea.offsetHeight - 1);
  canvas.parent("d_canvasArea");
  
  fb_setup();
}

function draw() {
  mm_draw();
  //mp_draw();
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
        '<div class="d_friendRequestIconGrid">'
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
        '<button class="d_friendIconGrid" onclick="mm_changeChat(' + "'" + _uid + "'" + ')">'
        + '<img src=' + _friend.photo + ' class="icon">'
        + '<p class="friendName">' + _friend.name + '</p>'
        + '</button>';
  }
}
