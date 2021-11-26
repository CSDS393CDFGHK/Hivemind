/**
 * @fileoverview The game is in charge of handling the gameplay elements.
 */

 const Message = require("../shared/Message.js");
 const MessageType = require("../shared/MessageType.js");
 const Lobby = require("../server/Lobby.js");
 const LobbyState = require("../shared/LobbyState.js");

/**
 * @constructor
 * @param {Lobby} lobby The associated lobby for this game
 */
 function Game(lobby) {
    this.whoseTurn = 0;
    this.words = []; // Array of words in the game
    this.numSentences = 0; // How many sentences there are so far
    this.lobby = lobby;
}

/**
 * Recieves messages when a player runs out of time on their turn
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Game.prototype.handleTurnTimeUp = function(msg) {
    return this.nextTurn();
}

/**
 * Returns `true` if the game should end
 * @return {Boolean}
 */
Game.prototype.isGameOver = function() {
    return this.numSentences >= this.lobby.settings.gameLength;
}


/**
 * Handles the word
 * @return {Boolean}
 */
 Game.prototype.handleWord = function(msg) {
    console.log("Current index: " + this.whoseTurn);
   if (msg.sourceID == this.lobby.players[this.whoseTurn].id) {
        let word = msg.data["word"].trim();
        this.words.push(word);
        let turnMsg = new Message("all", "", MessageType.NEXT_TURN, this.lobby.lobbyID, {"player": this.lobby.players[this.whoseTurn]});
        let wordMsg = new Message("all", "",  MessageType.WORD, this.lobby.lobbyID, {"word":word});
        let shouldEndMsg;
        console.log("Player " + this.lobby.players[this.whoseTurn].id + " says: " + wordMsg.data["word"]);
        // If a sentence has ended
        turnMsg = this.nextTurn();
        if (word.charAt(word.length - 1) == '!' || word.charAt(word.length - 1) == '.' || word.charAt(word.length - 1) == '?') {
            this.numSentences++;
            if(this.isGameOver()) {
                shouldEndMsg = this.triggerGameEnd();
                return [wordMsg, turnMsg, shouldEndMsg];
            }
        }
        return [wordMsg, turnMsg];
   }
    // TODO fix later
    return [];
}

/**
 * Does required actions when ending the game. State goes from GAME -> GAME_END
 */
Game.prototype.triggerGameEnd = function() {
    this.lobby.state = LobbyState.GAME_END;
    return new Message("all", "", MessageType.LOBBY_STATE, this.lobby.lobbyID, {"state": this.lobby.state});
}

/**
 * Does required actions when moving to the next player's turn
 */
Game.prototype.nextTurn = function() {
    this.whoseTurn = (this.whoseTurn + 1) % this.lobby.players.length;
    return new Message("all", "", MessageType.NEXT_TURN, this.lobby.lobbyID, {"player": this.lobby.players[this.whoseTurn]});
}

/**
 * Starts the timer for how much time the player has to enter a word
 */
Game.prototype.startTurnTimer = function() {

}

module.exports = Game;
