/**
 * @fileoverview The game is in charge of handling the gameplay elements.
 */

 const Message = require("../shared/Message.js");
 const MessageType = require("../shared/MessageType.js");

/**
 * @constructor
 * @param {int} whoseTurn Player id of whose turn it currently is
 */
 function Game(whoseTurn) {
    this.whoseTurn = whoseTurn;
    this.words = []; // Array of words in the game
    this.numSentences = 0; // How many sentences there are so far
}

/**
 * Recieves messages when a player runs out of time on their turn
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Game.prototype.handleTurnTimeUp = function(msg) {

}

/**
 * Returns `true` if the game should end
 * @return {Boolean}
 */
Game.prototype.isGameOver = function() {

}


/**
 * Handles the word
 * @return {Boolean}
 */
 Game.prototype.handleWord = function(msg) {
   // if (msg.sourceID == this.whoseTurn) {
        let word = msg.data["word"].trim();
        this.words.push(word);
        if (word.charAt(word.length - 1) == '!' || word.charAt(word.length - 1) == '.' || word.charAt(word.length - 1) == '?') {
            this.nextTurn();
        }
        let wordMsg = new Message("all", "",  MessageType.WORD, this.lobbyID, {"word":word});
        console.log("**********************************************************************" + wordMsg.data["word"]);
        return [wordMsg];
   // }
    // TODO fix later
    return [];
}

/**
 * Does required actions when ending the game. State goes from GAME -> GAME_END
 */
Game.prototype.triggerGameEnd = function() {

}

/**
 * Does required actions when moving to the next player's turn
 */
Game.prototype.nextTurn = function() {

}

/**
 * Starts the timer for how much time the player has to enter a word
 */
Game.prototype.startTurnTimer = function() {

}

module.exports = Game;
