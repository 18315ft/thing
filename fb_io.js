/**************************************************************/
// fb_io.js
// Written by ???   2021
/**************************************************************/
var userDetails;
var roomKey;

function fb_setup() {
  fb_initialise();

  userDetails = {
    uid:      "",
    email:    "",
    name:     "",
    photoURL: ""
  };
  fb_autoLogin(userDetails);
}

/**************************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {
  console.log('fb_initialise: ');
  var firebaseConfig = {
  apiKey: "AIzaSyCFD-tubP4vVdtVbYdXwuk7psiXlazM8n4",
    authDomain: "comp-2021-finn-thompson.firebaseapp.com",
    projectId: "comp-2021-finn-thompson",
    storageBucket: "comp-2021-finn-thompson.appspot.com",
    messagingSenderId: "923639396720",
    appId: "1:923639396720:web:32c2abca7a349be134f7b5",
    measurementId: "G-WEQJ68G5PD"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //console.log(firebase);	
		
  database = firebase.database();
}

/**************************************************************/
// fb_login(_dataRec)
// Login to Firebase
// Input:  to store user info in
// Return: n/a
/**************************************************************/
function fb_autoLogin(_dataRec) {
  console.log('fb_autoLogin: dataRec= ' + _dataRec);

  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // user is signed in
        _dataRec.uid      = user.uid;
        _dataRec.email    = user.email;
        _dataRec.name     = user.displayName;
        _dataRec.photoURL = user.photoURL;
        console.log("user signed in")
        console.log(_dataRec);
      }
    });
}

/**************************************************************/
// fb_login(_dataRec)
// Login to Firebase
// Input:  to store user info in
// Return: n/a
/**************************************************************/
function fb_redirectLogin(_dataRec) {
  //console.log('fb_redirectLogin: dataRec= ' + _dataRec);
  firebase.auth().onAuthStateChanged(newLogin);
  
  function newLogin(user) {
    _dataRec     = {};
      
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
  firebase.auth().signOut();
}

/**************************************************************/
// fb_write(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_write(_path, _key, _data) { 
  //console.log('fb_Write: path= ' + _path + '  key= ' + _key +
  //            '  data= ' + _data.name + '/' + _data.score);
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
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_readRec(_path, _key, data) {	
  var data

  firebase.database().ref(_path + "/" + _key).on("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    //console.log(snapshot.val());
    data = snapshot.val();
  }

  //console.log(data);
  return(data);
 
  function readErr(error) {
    console.log(error);
  }
}

function fb_draw() {
  roomKey = "testGame/" + document.getElementById("i_roomCode").value;
}

/**************************************************************/
//    END OF MODULE
/**************************************************************/



/**************************************************************/
//    Archived functions (backups incase I break them)
/**************************************************************/

/**************************************************************/
// fb_login(_dataRec)
// Login to Firebase
// Input:  to store user info in
// Return: n/a
/**************************************************************
function fb_login(_dataRec) {
  //console.log('fb_login: dataRec= ' + _dataRec);
  firebase.auth().onAuthStateChanged(newLogin);
  
  function newLogin(user) {
    if (user) {
      // user is signed in
      _dataRec.uid      = user.uid;
      _dataRec.email    = user.email;
      _dataRec.name     = user.displayName;
      _dataRec.photoURL = user.photoURL;
      console.log("user signed in")
    }
    else {
      // user NOT logged in, so redirect to Google login
        _dataRec     = {};
        
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  }
}



*/