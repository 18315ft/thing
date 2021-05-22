/**************************************************************/
// im_interfaceManager.js
// Written by Finn Thompson - Term 1/2 2021
/**************************************************************/
var canvas;
var canvasArea = document.getElementById("d_canvasArea");;
var gamePage = document.getElementById("s_gamePage");
var registerPage = document.getElementById("s_register");
var settingsPage = document.getElementById("s_settingsPage");

function setup() {
  frameRate(5);
  im_showOnly("s_gamePage");
  canvas = createCanvas(canvasArea.offsetWidth, canvasArea.offsetHeight - 1);
  canvas.parent("d_canvasArea");
  
  fb_setup();

  roomKey = "testGame/" + document.getElementById("i_roomCode").value;
}

function draw() {
  mm_draw();
  //mp_draw();
}

/**************************************************************/
// im_hide()
// Hides all pages
// Input:  n/a
// Return: n/a
/**************************************************************/
function im_hide(_id) {
  console.log("im_hide: _id= " + _id);
  document.getElementById(_id).style.display = "none";
}

/**************************************************************/
// im_hideAll()
// Hides all pages
// Input:  n/a
// Return: n/a
/**************************************************************/
function im_hideAll() {
  console.log("im_hideAll");
  gamePage.style.display = "none";
  registerPage.style.display = "none";
  settingsPage.style.display = "none";
}

/**************************************************************/
// im_show(_id, _displayType)
// Shows _id
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
// Hides all except for _id
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
// im_createFriendIcon(_name, _request)
// Creates a icon for the user with _name
// Input:  _name
// Return: n/a
/**************************************************************/
async function im_createFriendIcon(_name, _uid, _request) {
  console.log("im_createFriendIcon: _name= " + _name + " _request= " + _request);
  var sideBar = document.getElementById("d_sideBar");

  if (_request == true) {
    sideBar.innerHTML += '<div class="d_friendIconGrid">'
      + '<img src="homeIcon.png" class="icon" style="grid-row-end: span 2;">'
      + '<p class="friendName">' + _name + '</p> <div>'
      + '<button class="friendRequestButton" onclick="mm_acceptFriendRequest(' + "'" + _uid + "'" + ')">Accept</button>'
      + '<button class="friendRequestButton" onclick="mm_denyFriendRequest(' + "'" + _uid + "'" + ')">Deny</button> </div> </div>';
  } else {
    sideBar.innerHTML += '<div class="d_friendIconGrid">'
        + '<img src="homeIcon.png" class="icon" style="grid-row-end: span 2;">'
        + '<p class="friendName">' + _name + '</p>'
      + '</div>';
  }
}
/*
      <div class="d_friendIconGrid">
        <img src="homeIcon.png" class="icon" style="grid-row-end: span 2;">
        <p class="friendName">Friend Name</p>
        <p class="lastOnline">Online: 10/10/10 - 12:00 am</p>
      </div>*/