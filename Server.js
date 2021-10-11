/**
 * @fileoverview The server is in charge of serving webpages, managing Lobby objects,
 * and handling/passing websocket data to the correct lobby.
 */

/**
 * @constructor
 */
 function Server() {
    this.lobbies = {} // A dictionary of lobbies indexed by their id
}

/**
 * To be called when a websocket connection is made to the websocket server
 * @param {WebSocket} socket The new socket connection
 * @param {Event} event Information about the event
 */
Server.prototype.onOpen = function(socket, event) {

}

/**
 * To be called when a websocket recieves a message
 * @param {WebSocket} socket The new socket connection
 * @param {Event} event Information about the event
 */
Server.prototype.onMessage = function(socket, event) {

}

/**
 * To be called when a websocket connection is closed
 * @param {WebSocket} socket The new socket connection
 * @param {Event} event Information about the event
 */
Server.prototype.onClose = function(socket, event) {

}

/**
 * Recieves messages when new players join the lobby
 * @param {String} lobbyID The lobby containing the player the message should be sent to
 * @return {Message} msg The message to send
 */
Server.prototype.sendMessage = function(lobbyID, msg) {

}
