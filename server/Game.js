/**
 * @fileoverview The game is in charge of handling the gameplay elements.
 */

/**
 * @constructor
 * @param {int} whoseTurn Player id of whose turn it currently is
 */
 function Game(whoseTurn) {
    this.whoseTurn = whoseTurn;
    this.sentences = []; // Array of words in the game
    this.numSentences = 0; // How many sentences there are so far
}

/**
 * Incoming event handler. Passes events to other handlers based on msg.type
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Game.prototype.websocketCallback = function(msg) {

}

/**
 * Recieves messages when a player enteres a word
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Game.prototype.handleWordSent = function(msg) {

}

/**
 * Recieves messages when players leave the game
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Game.prototype.handlePlayerLeave = function(msg) {

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
