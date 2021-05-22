var bettingAmount;
var playerCardAmount;
var compCardAmount;
var i;
var ace = false;
var gain;
var action;
var stage = 0;
var opponent = {stage: 0};

function getCard1() {
  var card = Math.floor(Math.random() * 13 + 1);
  if (card >= 10) {
    return 10;
  } else if (card >= 2) {
    return card;
  } else {
    ace = true;
    return 11;
  }
}

function ga_startGame() {
  playing = true;
  if (roomKey != "home") {
    fb_readOn("userDetails", roomKey + "/game/actions", function(_data) {
      opponent = _data;
    });
  }
}

function ga_ready() {
  console.log("ga_ready()");
  if (userDetails.money == undefined) {
    userDetails.money = 100;
  }
  userDetails.stage = 1;
  fb_write("userDetails", userDetails.uid + "/game/actions/stage", 1);
  fb_readOn("userDetails", userDetails.uid + "/money", function(_data) {
    
  })
}

function ga_draw() {
  if (playing) {
    document.getElementById("i_bettingAmount").max = userDetails.money;
    if (stage == 0) {
      // During the betting stage
      bettingAmount = document.getElementById("i_bettingAmount").value;
      if (opponent.stage == 1 && userDetails.stage == 1 &&
          opponent.bettingAmount == userDetails.bettingAmount) {
        // If the players have both got the same betting amount and have
        //   both said that they are ready
        fb_write("userDetails", userDetails.uid + "/money", userDetails.money - bettingAmount);
        fb_write("userDetails", userDetails.uid + "/game/bettingAmount", bettingAmount);
        stage = 1;
        // Starting the game
        ga_startCards();
      }
    } else if (stage == 1) {
      // During the hitting stage
      document.getElementById("p_blackjackOutput").innerHTML = playerCardAmount;

      if ((opponent.stage == 2 && userDetails.stage == 2) || opponent.stage == 3 || userDetails.stage == 3)  {
        stage = 2;
      }
    } else if (stage == 2) {
      // During the winning stage
    }
  }
}

//starting the game
function ga_startCards() {
  //starting cards
  ace = 0;
  playerCardAmount = getCard1();
  playerCardAmount += getCard1();
  if (roomKey == "home") {
    compCardAmount = getCard1();
  }
}

// 
function ga_hit() {
  console.log("ga_hit()");
  playerCardAmount = playerCardAmount + getCard1();
  if (playerCardAmount > 21 && ace == 1) {
    ace = 0;
    playerCardAmount = playerCardAmount - 10;
  } else if (playerCardAmount > 21) {
    playerStage = 3;
    fb_write("userDetails", userDetails.uid + "/stage", 3);
  }
  document.getElementById("p_blackjackOutput").innerHTML = playerCardAmount;
}

function ga_stand() {
  playerStage = 2;
  if (roomKey != "home") {
    fb_write("userDetails", userDetails.uid + "/stage", 2);
  }
}

function ga_end() {
  console.log("ga_end()");
  //Making the computer hit / stand
  while (compCardAmount < 17) {
    compCardAmount = compCardAmount + getCard1();
  }

  //winning and losing
  if (playerCardAmount > 21) { // Losing

  } else if (compCardAmount > 21) { // Computer busting
    fb_write("userDetails", userDetails.uid + "/money", (userDetails.money + 2 * bettingAmount));

  } else if (compCardAmount == playerCardAmount) { // Tieing
    fb_write("userDetails", userDetails.uid + "/money", (userDetails.money + bettingAmount));

  } else if (compCardAmount > playerCardAmount) {

  } else if (playerCardAmount > compCardAmount) {
    fb_write("userDetails", userDetails.uid + "/money", (userDetails.money + 2 * bettingAmount));

  }
}
