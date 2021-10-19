/**
 * @fileoverview The lobby is in charge of all aspects of a single group of people.
 */

const Settings = require("../shared/Settings.js");
const LobbyState = require("../shared/LobbyState.js");

/**
 * @constructor
 * @param {String} lobbyID The lobby's unique id
 * @param {String} owner The owner of the lobby
 */
 function Lobby(lobbyID, owner) {
    this.lobbyID = lobbyID; // The lobby's unique id
    this.players = new Set(); // The collection of Players in this lobby
    this.sockets = {}; // A dictionary of websockets, indexed by player's id
    this.settings = new Settings(20, 8); // Game settings, initialized to defaults
    this.state = LobbyState.LOBBY; // All games start in the lobby
    this.owner = owner; // The owner of the lobby
}

/**
 * Incoming event handler. Passes events to other handlers based on msg.type
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Lobby.prototype.websocketCallback = function(msg) {

}

/**
 * Recieves messages when the lobby owner changes the lobby settings
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Lobby.prototype.handleSettingsChange = function(msg) {

}

/**
 * Recieves messages when players in the lobby change their username
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Lobby.prototype.handleUsernameChange = function(msg) {

}

/**
 * Recieves messages when new players join the lobby
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Lobby.prototype.handlePlayerJoin = function(msg) {

}

/**
 * Recieves messages when players leave the lobby
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Lobby.prototype.handlePlayerLeave = function(msg) {

}

/**
 * Recieves messages when players change their ready state
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Lobby.prototype.handleReadyChange = function(msg) {

}

/**
 * Checks if the game is ready to start, which occurs if all players
 * in the lobby are ready, and there are enough players for a game.
 * @return {Boolean}
 */
Lobby.prototype.gameShouldStart = function() {

}

/**
 * Does required actions when starting the game. State goes from LOBBY -> GAME
 */
Lobby.prototype.triggerGameStart = function() {

}

/**
 * Returns a player by ther id, or null
 * @param {int} id The player's id
 * @return {Player}
 */
Lobby.prototype.getPlayer = function(id) {

}

/**
 * Returns a player's WebSocket by ther id, or null
 * @param {int} id The player associated with the websocket's id
 * @return {WebSocket}
 */
Lobby.prototype.getSocket = function(id) {

}

module.exports = Lobby;
