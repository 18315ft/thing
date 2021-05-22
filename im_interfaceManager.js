var canvas;
var canvasArea = document.getElementById("d_canvasArea");;
var gamePage = document.getElementById("s_gamePage");
var registerPage = document.getElementById("s_register");
var settingsPage = document.getElementById("s_settingsPage");

async function setup() {
  await fb_setup();


  frameRate(5);
  im_showOnly("s_gamePage");
  canvas = createCanvas(canvasArea.offsetWidth, canvasArea.offsetHeight - 1);
  canvas.parent("d_canvasArea");

  
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
// im_createFriendIcon(_uid, _request)
// Creates a icon for the user with _uid
// Input:  _uid
// Return: n/a
/**************************************************************/
function im_createFriendIcon(_uid, _request) {
  var mainDiv = document.createElement("div");
  var image = document.createElement("img");
  var personName = document.createElement("p");
  var buttonsDiv = document.createElement("div");
  var accept = document.createElement("button");
  var deny = document.createElement("button");

  mainDiv.class = "d_friendIconGrid";
  image.class = "icon";
  personName.class = "friendName";
  accept.class = "friendRequestButton";
  deny.class = "friendRequestButton";
}

      <div class="d_friendIconGrid">
        <img src="homeIcon.png" class="icon" style="grid-row-end: span 2;">
        <p class="friendName">Friend Name</p>
        <div>
          <button class="friendRequestButton">Accept</button>
          <button class="friendRequestButton">Deny</button>
        </div>
      </div>