var bettingAmount;
var ace = false;
var playerCardAmount;
var gain;
var stage = 0;
var opponent = {stage: 0, cardAmount: 0, bettingAmount: 0};
var playing = false;

/**************************************************************/
// ga_getCard()
// gets a random card and returns the value
// Input:  
// Return:  The value of the card that is randomly chosen
/**************************************************************/
function ga_getCard() {
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

/**************************************************************/
// ga_startGame()
// indicates that the user would like to start a game
// Input:   n/a
// Return:  n/a
/**************************************************************/
function ga_startGame() {
  console.log("ga_startGame()");
  
  playing = true;

  // If the player is playing online it will read the opponents game data
  if (roomKey != "home") {
    fb_readOn("userDetails", roomKey + "/game", function(_data) {
      if (_data != null) {
        opponent = _data;
      }
    });
    fb_write("userDetails", roomKey + "/friends/" + userDetails.uid + "/playing", true);
    fb_write("userDetails", userDetails.uid + "/game/stage", 0);
  }

  // If it the players first time playing it willl give the player $10
  if (userDetails.money < 1) {
    userDetails.money = 10;
  }
  im_hide("stage2");
  im_show("stage0");
}

/**************************************************************/
// ga_bet()
// indicates that the user has has bet and is ready to play
// Input:   n/a
// Return:  n/a
/**************************************************************/
function ga_bet() {
  bettingAmount = parseInt(document.getElementById("i_bettingAmount").value);
  userDetails.stage = 1;
  if (roomKey == "home") {
    opponent.stage = 1;
    opponent.bettingAmount = bettingAmount;
  } else {
    fb_write("userDetails", userDetails.uid + "/game/bettingAmount", bettingAmount);
    fb_write("userDetails", userDetails.uid + "/game/stage", 1);
  }
}

/**************************************************************/
// ga_draw()
// all of the stuff for ga that should be in the draw loop
// Input:   n/a
// Return:  n/a
/**************************************************************/
function ga_draw() {
  // Making the player unable to bet more money than they have
  document.getElementById("i_bettingAmount").max = userDetails.money;
  if (playing) {
    // Showing the players card amount and the amount that their
    //   opponent is betting as well as their cards
    document.getElementById("p_playerCards").innerHTML = playerCardAmount;
    document.getElementById("p_playerCardsEnd").innerHTML = playerCardAmount;
    document.getElementById("p_opponentBetting").innerHTML = opponent.bettingAmount;
    document.getElementById("p_opponentsCards").innerHTML = opponent.cardAmount;
    if (stage == 0) {
      // During the betting stage
      if (opponent.stage == 1 && userDetails.stage == 1 &&
          opponent.bettingAmount == bettingAmount) {
        /* If the players have both got the same betting amount and have
             both said that they are ready*/
        userDetails.money -= bettingAmount;
        fb_write("userDetails", userDetails.uid + "/money", userDetails.money);

        im_hide("stage0");
        im_show("stage1");
        stage = 1;
        // Starting the game
        ga_startCards();
      }
    } else if (stage == 1) {
      // During the hitting stage
      if (roomKey == "home") {
        while (opponent.cardAmount < 17) {
          opponent.cardAmount += ga_getCard();
        }
        opponent.stage = 2;
      }
      
      if (opponent.stage == 3) {
        fb_write("userDetails", userDetails.uid + "/game/cardAmount", playerCardAmount);
        fb_write("userDetails", userDetails.uid + "/game/stage", 4);
      }
      // If both players have stood (stage 2) the opponent has bust (stage 3)
      //   or the opponent has received your bust (stage 4) it ends the game
      if ((opponent.stage == 2 && userDetails.stage == 2) || opponent.stage == 3 || opponent.stage == 4) {
        console.log("game end");
        im_hide("stage1");
        im_show("stage2");
        stage = 0;
        ga_endGame();
      }
    }
  }
}

/**************************************************************/
// ga_startCards()
// gives the player their starting cards
// Input:   n/a
// Return:  n/a
/**************************************************************/
function ga_startCards() {
  console.log("ga_startCards");
  ace = false;
  playerCardAmount = ga_getCard();
  playerCardAmount += ga_getCard();
}

/**************************************************************/
// ga_hit()
// indicates that the user has hit. Adds another card as well as
//  checks whether the user has bust
// Input:   n/a
// Return:  n/a
/**************************************************************/
function ga_hit() {
  console.log("ga_hit()");
  playerCardAmount = playerCardAmount + ga_getCard();
  if (playerCardAmount > 21 && ace) {
    ace = false;
    playerCardAmount = playerCardAmount - 10;
  } else if (playerCardAmount > 21) {
    if (roomKey != "home") {
      fb_write("userDetails", userDetails.uid + "/game/cardAmount", playerCardAmount);
      fb_write("userDetails", userDetails.uid + "/game/stage", 3);
    } else {
      opponent.stage = 4;
    }
  }
  document.getElementById("p_playerCards").innerHTML = playerCardAmount;
}

/**************************************************************/
// ga_stand()
// indicates that the user has stood
// Input:   n/a
// Return:  n/a
/**************************************************************/
function ga_stand() {
  console.log("ga_stand");
  userDetails.stage = 2;
  if (roomKey != "home") {
    fb_write("userDetails", userDetails.uid + "/game/cardAmount", playerCardAmount);
    fb_write("userDetails", userDetails.uid + "/game/stage", 2);
  }
}

/**************************************************************/
// ga_endGame()
// Ends the game and resets variables
// Input:   n/a
// Return:  n/a
/**************************************************************/
async function ga_endGame() {
  //winning and losing
  if (playerCardAmount > 21) { // Busting

  } else if (opponent.cardAmount > 21) { // Computer busting
    console.log("opponent bust Player= " + playerCardAmount + " Opponent= " + opponent.cardAmount);
    fb_write("userDetails", userDetails.uid + "/money", (userDetails.money + 2 * bettingAmount));
  } else if (opponent.cardAmount == playerCardAmount) { // Tieing
    console.log("tie Player= " + playerCardAmount + " Opponent= " + opponent.cardAmount);
    fb_write("userDetails", userDetails.uid + "/money", (userDetails.money + bettingAmount));
  } else if (opponent.cardAmount > playerCardAmount) { // Losing
    console.log("lost Player= " + playerCardAmount + " Opponent= " + opponent.cardAmount);
    
  } else if (playerCardAmount > opponent.cardAmount) { // Winning
    console.log("won Player= " + playerCardAmount + " Opponent= " + opponent.cardAmount);
    fb_write("userDetails", userDetails.uid + "/money", (userDetails.money + 2 * bettingAmount));
  }

  opponent = {stage: 0, cardAmount: 0, bettingAmount: 0}; 
  playing = false;
  userDetails.stage = 0;
  playerCardAmount = 0;

  if (roomKey != "home") {
    fb_write("userDetails", roomKey + "/friends/" + userDetails.uid + "/playing", false);
    fb_delete("userDetails", roomKey + "/game");
    fb_stopRead("userDetails", roomKey + "/game");
  }
}