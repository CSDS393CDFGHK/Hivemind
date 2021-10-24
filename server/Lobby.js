/**
 * @fileoverview The lobby is in charge of all aspects of a single group of people.
 */

const Settings = require("../shared/Settings.js");
const LobbyState = require("../shared/LobbyState.js");
const Player = require("../shared/Player.js");
const Message = require("../shared/Message.js");
const MessageType = require("../shared/MessageType.js");
const UniqueColorPicker = require("../server/UniqueColorPicker.js");
const MAX_PLAYERS = 12;

/**
 * @constructor
 * @param {String} lobbyID The lobby's unique id
 * @param {String} owner The owner of the lobby
 */
 function Lobby(lobbyID, owner) {
    this.picker = new UniqueColorPicker();
    this.lobbyID = lobbyID; // The lobby's unique id
    this.players = []; // The collection of Players in this lobby
    this.players.push(new Player(owner, this.picker.pickColor()));
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
Lobby.prototype.handleMessage = function(msg) {
    switch (msg.type) {
        case MessageType.USERNAME:
            this.handleUsernameChange(msg);
            break;
        case MessageType.SETTINGS:
            this.handleSettingsChange(msg);
            break;
        case MessageType.READY:
            this.handleReadyChange(msg);
            break;
        case MessageType.PLAYER_JOIN:
            this.handlePlayerJoin(msg);
            break;
        case MessageType.PLAYER_LEAVE:
            this.handlePlayerLeave(msg);
            break;
        case MessageType.WORD:
            this.handleWord(msg);
            break;
        case MessageType.LOBBY_ID:
        case MessageType.PLAYER_DATA:
        case MessageType.NEXT_TURN:
        case MessageType.LOBBY_STATE:
        case MessageType.CREATE_LOBBY:
            console.log('Recieved Bad Message Type: ' + msg.type);
            break;
        default:
            console.log('Recieved Unknown Message Type: ' + msg.type);
            break;
    }
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
    this.getPlayer(msg.sourceID).username = msg.data["username"];
}

/**
 * Recieves messages when new players join the lobby
 * @param {Message} msg The incoming msg
 * @return {Message[]} List of messages to send back to clients
 */
Lobby.prototype.handlePlayerJoin = function(msg) {
    // Note: Add checks for joining midgame, exceeding player limit, etc.
    if (this.players.length < MAX_PLAYERS) {
        this.players.push(new Player(msg.sourceID, this.picker.pickColor()));
    } else {
        console.log("There are too many players in the lobby."); // Fix
    }
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
	for (i = 0; i < this.players.length; i++) {
		if (this.players[i].id == id) {
			return this.players[i];
		}
	}
	return null;
}

/**
 * Returns a player's WebSocket by ther id, or null
 * @param {int} id The player associated with the websocket's id
 * @return {WebSocket}
 */
Lobby.prototype.getSocket = function(id) {

}

// Gets the id
Lobby.prototype.getID = function() {
    return this.lobbyID;
}

module.exports = Lobby;
