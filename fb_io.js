/**************************************************************/
// fb_io.js
// Written by Finn Thompson - Term 1/2 2021
/**************************************************************/
var userDetails;
var roomKey = "home";

function fb_setup() {
  fb_initialise();

  userDetails = {
    uid:      "",
    email:    "",
    name:     "",
    photoURL: ""
  };

  fb_autoLogin();
}

/**************************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {
  console.log("fb_initialise");
  var firebaseConfig = {
    apiKey: "AIzaSyCFD-tubP4vVdtVbYdXwuk7psiXlazM8n4",
    authDomain: "comp-2021-finn-thompson.firebaseapp.com",
    databaseURL: "https://comp-2021-finn-thompson-default-rtdb.firebaseio.com",
    projectId: "comp-2021-finn-thompson",
    storageBucket: "comp-2021-finn-thompson.appspot.com",
    messagingSenderId: "923639396720",
    appId: "1:923639396720:web:05a6eab715d2465c34f7b5",
    measurementId: "G-5SR5VHTQQT"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

/**************************************************************/
// fb_autoLogin()
// Automatically login to Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
async function fb_autoLogin() {
  console.log('fb_autoLogin');
  var userRegistered;

  firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        userDetails.uid      = user.uid;
        userDetails.email    = user.email;
        userDetails.name     = user.displayName;
        userDetails.photoURL = user.photoURL;
        userRegistered = await fb_checkForUserUID(userDetails.uid);

        if (userRegistered == false) {
          console.log("user not registered");
          im_showOnly("s_landingPage");
        } else {
          console.log("user registered");
          userDetails = await fb_read("userDetails", userDetails.uid);
          document.getElementById("img_userImage").src = userDetails.icon;
          document.getElementById("p_username").textContent = userDetails.username;

          fb_readOn("messages", roomKey, im_drawMessage);

          fb_readOn("userDetails", userDetails.uid +
            "/friendRequests", mm_checkFriendRequests);

          fb_readOn("userDetails", userDetails.uid +
            "/friends", mm_checkFriends);

          fb_readOn("userDetails", userDetails.uid + "/money", function(_data) {
            userDetails.money = _data;
          });
        }
      } else {
        im_showOnly("s_landingPage");
      }
    });
}

/**************************************************************/
// fb_redirectLogin()
// Login to google
// Input:  n/a
// Return: n/a
/**************************************************************/
async function fb_redirectLogin() {
  console.log("fb_redirectLogin");

  firebase.auth().onAuthStateChanged(newLogin);
  
  function newLogin(user) {
    if (user) {
      im_showOnly("s_gamePage");
      im_show("s_register");
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  }
}

/**************************************************************/
// fb_logout()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_logout() {
  console.log("fb_logout");
  firebase.auth().signOut();
}

/**************************************************************/
// fb_write(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_write(_path, _key, _data) { 
  console.log("fb_write: _path= " + _path + "  _key= " + _key + "  _data= " + _data);

  if (_path != null && _path != undefined && _key != null && _key != undefined) {
    firebase.database().ref(_path + "/" + _key).set(_data,
      function(error) {
        if (error) {
          console.log(error);
        }
      });
  }
}

/**************************************************************/
// fb_push(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_push(_path, _key, _data) { 
  console.log("fb_push: _path= " + _path + "  _key= " + _key + "  _data= " + _data);

  if (_path != null && _path != undefined && _key != null && _key != undefined) {
    firebase.database().ref(_path + "/" + _key).push().set(_data,
      function(error) {
        if (error) {
          console.log(error);
        }
      });
  }
}

/**************************************************************/
// fb_read(_path, _key)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
async function fb_read(_path, _key) {	
  console.log("fb_read: _path= " + _path + "  _key= " + _key);
  var data

  await firebase.database().ref(_path + "/" + _key).once("value", gotRecord, readErr);
  return(data);

  function gotRecord(snapshot) {
    console.log(snapshot.val());
    data = snapshot.val();
  }
 
  function readErr(error) {
    console.log(error);
  }
}

/**************************************************************/
// fb_readOn(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_readOn(_path, _key, _return) {	
  console.log("fb_readOn: _path= " + _path + "  _key= " + _key);
  var data;

  firebase.database().ref(_path + "/" + _key).on("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    console.log("gotRecord: snapshot.val= " + snapshot.val());
    console.log(_return);
    _return(snapshot.val());
  }
  
  function readErr(error) {
    console.log(error);
  }
}

/**************************************************************/
// fb_readOn(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_stopRead(_path, _key) {	
  console.log("fb_readOn: _path= " + _path + "  _key= " + _key);
  var data;

  firebase.database().ref(_path + "/" + _key).off;
}

/**************************************************************/
// fb_delete(_path, _key)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_delete(_path, _key) { 
  console.log("fb_delete: _path= " + _path + "  _key= " + _key);
  if (_path != null && _path != undefined && _key != null && _key != undefined) {
    firebase.database().ref(_path + "/" + _key).remove(
      function(error) {
        if (error) {
          console.log(error);
        }
      });
  }
}

/**************************************************************/
// fb_setAccountDetails()
// Uploads account details to firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
async function fb_setAccountDetails(_inSettings) {
  console.log("fb_setAccountDetails");
  var tempObject = {username: "", age: "", gender: ""};

  if (_inSettings) {
    tempObject.username = document.getElementById("i_settingsUsernameInput").value;
    tempObject.age = document.getElementById("i_settingsAgeInput").value;
    tempObject.gender = document.getElementById("i_settingsGenderInput").value;
    tempObject.icon = document.getElementById("sel_settingsIcon").value;
  } else {
    tempObject.username = document.getElementById("i_usernameInput").value;
    tempObject.age = document.getElementById("i_ageInput").value;
    tempObject.gender = document.getElementById("i_genderInput").value;
    tempObject.icon = document.getElementById("sel_icon").value;
  }

  if (await fb_checkForUsername(tempObject.username)) {
    document.getElementById("p_usernameStatus").textContent = "Username is taken";
    return;
  }
  
  if (tempObject.age < 13) {
    document.getElementById("p_ageStatus").textContent = "You must be 13 or over to use this website";
    return;
  }

  if (tempObject.icon == "google") {
    tempObject.icon = userDetails.photoURL;
  }

  userDetails.username = tempObject.username;
  userDetails.age = tempObject.age;
  userDetails.gender = tempObject.gender;
  userDetails.icon = tempObject.icon;

  for (var i in friends) {
    fb_write("userDetails", i + "/friends/" + userDetails.uid, {name: userDetails.username, photo: userDetails.icon});
  }

  if (!_inSettings) {
    fb_autoLogin();
  }

  fb_write("userDetails", userDetails.uid, userDetails);
  im_hide("s_register");
  im_hide("s_settingsPage");
}

/**************************************************************/
// fb_checkForUserUID(_uid)
// Checks the database for the user
// Input:  the uid that it will search for
// Return:  whether or not it has found that uid
/**************************************************************/
async function fb_checkForUserUID(_uid) {
  console.log("fb_checkForUserUID: _uid= " + _uid);
  var allUsers = await fb_read("userDetails", "");
  console.log(allUsers);

  if (allUsers != null) {
    var allUserKeys = Object.keys(allUsers);

    for (var i = 0; i < allUserKeys.length; i++) {
      if (allUserKeys[i] == _uid) {
        console.log("found user " + _uid);
        return(true);
      }
    }
  }
  console.log("didn't find user " + _uid);
  return(false);
}

/**************************************************************/
// fb_checkForUsername(_name)
// Checks the database for the user
// Input:  the name that it will search for
// Return:  whether or not it has found that name
/**************************************************************/
async function fb_checkForUsername(_name, _exceptions) {
  console.log("fb_checkForUsername: _name= " + _name);
  var allUsers = await fb_read("userDetails", "");

  if (allUsers != null) {
    for (var i in allUsers) {
      console.log(allUsers[i]);
      if (allUsers[i].username == _name) {
        if (function() {
          for (var x = 0; x < _exceptions.length; x++) {
            if (allUsers[i].username == _exceptions[x]) {
              return(false);
            }
          }
        }) {
          console.log("found user " + _name);
          return(true);
        }
      }
    }
  }
  console.log("didn't find user " + _name);
  return(false);
}

/**************************************************************/
// fb_getDetailsOfUsername(_name)
// Checks the database for the user
// Input:  the name that it will search for
// Return:  the details of the user that is found
/**************************************************************/
async function fb_getDetailsOfUsername(_name) {
  console.log("fb_getDetailsOfUsername: _name= " + _name);
  var allUsers = await fb_read("userDetails", "");

  if (allUsers != null) {
    for (var i in allUsers) {
      if (allUsers[i].username == _name) {
        console.log("returning user: " + allUsers[i]);
        return(allUsers[i]);
      }
    }
  }
  console.log("didn't find user " + _name);
  return(false);
}

/**************************************************************/
// fb_getDetailsOfUID(_uid)
// Checks the database for the user
// Input:  the uid that it will search for
// Return:  the details of the user that is found
/**************************************************************/
async function fb_getDetailsOfUID(_uid) {
  console.log("fb_getDetailsOfUID: _uid= " + _uid);
  var allUsers = await fb_read("userDetails", "");

  if (allUsers != null) {
    for (var i in allUsers) {
      if (i == _uid) {
        console.log("returning user: " + JSON.stringify(allUsers[i]));
        return(allUsers[i]);
      }
    }
  }
}
/**************************************************************/
//    END OF MODULE
/**************************************************************/