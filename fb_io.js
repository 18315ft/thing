/**************************************************************/
// fb_io.js
// Written by ???   2021
/**************************************************************/
var userDetails;
var roomKey;

async function fb_setup() {
  fb_initialise();

  userDetails = {
    uid:      "",
    email:    "",
    name:     "",
    photoURL: ""
  };
  await fb_autoLogin();
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
  console.log(firebase);
}

/**************************************************************/
// fb_autoLogin()
// Automatically login to Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_autoLogin() {
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
          console.log("user not signed in");
          im_show("s_register");
        } else {
          console.log("user registered");
          userDetails =  await fb_asyncRead("userDetails", userDetails.uid);
          document.getElementById("p_username").textContent = userDetails.username;
        }
      } else {
        fb_redirectLogin();
      }
    });
}

/**************************************************************/
// fb_redirectLogin()
// Login to google
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_redirectLogin() {
  console.log("fb_redirectLogin");
  firebase.auth().onAuthStateChanged(newLogin);
  
  function newLogin(user) {
      
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
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
// fb_asyncRead(_path, _key)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
async function fb_asyncRead(_path, _key) {	
  console.log("fb_asyncRead: _path= " + _path + "  _key= " + _key)
  var data

  await firebase.database().ref(_path + "/" + _key).once("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    console.log(snapshot.val());
    data = snapshot.val();
  }

  return(data);
 
  function readErr(error) {
    console.log(error);
  }
}

/**************************************************************/
// fb_read(_path, _key)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_read(_path, _key) {	
  console.log("fb_read: _path= " + _path + "  _key= " + _key)
  var data

  firebase.database().ref(_path + "/" + _key).once("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    console.log(snapshot.val());
    data = snapshot.val();
  }

  return(data);
 
  function readErr(error) {
    console.log(error);
  }
}

/**************************************************************/
// fb_upload(_path, _key, _input)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_upload(_path, _key, _input) { 
  console.log("fb_upload: _path= " + _path + "  _key= " + _key + "  _input= " + _input);
  if (_path != null && _path != undefined && _key != null && _key != undefined) {
    var file = document.getElementById(_input).files[0];
    var storageRef = firebase.storage().ref(_path + "/" + _key);

    storageRef.put(file,
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
async function fb_setAccountDetails() {
  console.log("fb_register");
  userDetails.username = document.getElementById("i_usernameInput").value;
  userDetails.age = document.getElementById("i_ageInput").value;

  if (await fb_checkForUsername(userDetails.username)) {
    document.getElementById("p_usernameStatus").textContent = "Username is taken";
    return;
  }

  if (userDetails.age < 13) {
    document.getElementById("p_ageStatus").textContent = "You must be 13 or over to use this website";
    return;
  }

  fb_write("userDetails", userDetails.uid, userDetails);
  im_hide("s_register");
}

/**************************************************************/
// fb_checkForUserUID(_uid)
// Checks the database for the user
// Input:  the uid that it will search for
// Return:  whether or not it has found that uid
/**************************************************************/
async function fb_checkForUserUID(_uid) {
  console.log("fb_checkForUserUID: _uid= " + _uid);
  var allUsers = await fb_asyncRead("userDetails", "");
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
async function fb_checkForUsername(_name) {
  console.log("fb_checkForUsername: _name= " + _name);
  var allUsers = await fb_asyncRead("userDetails", "");

  if (allUsers != null) {
    for (var i in allUsers) {
      console.log(allUsers[i]);
      if (allUsers[i].username == _name) {
        console.log("found user " + _name);
        return(true);
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
// Return:  whether or not it has found that name
/**************************************************************/
async function fb_getDetailsOfUsername(_name) {
  console.log("fb_getDetailsOfUsername: _name= " + _name);
  var allUsers = await fb_asyncRead("userDetails", "");

  if (allUsers != null) {
    for (var i in allUsers) {
      console.log(allUsers[i]);
      if (allUsers[i].username == _name) {
        return(allUsers[i]);
      }
    }
  }
  console.log("didn't find user " + _name);
  return(false);
}
/**************************************************************/
//    END OF MODULE
/**************************************************************/