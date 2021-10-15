/**
 * @fileoverview The server is in charge of serving webpages, managing Lobby objects,
 * and handling/passing websocket data to the correct lobby.
 */
const http = require('http');
const ws = require('ws');


/**
 * SERVER_PORT is the port the NodeJS server should constantly listen to for incoming websocket requests. Port 80 is for listening to client HTTP requests.
 * Client-side JS from port 80 (connected through a regular HTTP request that can be made from the browser) makes a connection to Port 8000 for the websocket.
 */
const SERVER_PORT = 8000; 
var s = new Server();
/**
 * @constructor
 */
 function Server() {
    this.webSocketServer = new ws.Server( { noServer: true });
    this.lobbies = {}; // A dictionary of lobbies indexed by their id
}

/**
 * To be called when a websocket connection is made to the websocket server
 * @param {WebSocket} socket The new socket connection
 */
Server.prototype.onOpen = function(socket) {
    socket.send("Web socket connection made.");
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
/**
 * Listens to a given port for new websocket connections
 * @param {int} port The port the server should listen to for incoming requests.
 */
Server.prototype.listenToPort = function(port) {
    http.createServer(this.acceptConnection).listen(port);
}

Server.prototype.acceptConnection = function(req, res) {
    if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
        res.end();
        return;
    }

    //check if upgradable connection
    if (!req.headers.connection.match(/\bupgrade\b/i)) {
        res.end();
        return;
    }
    
    this.webSocketServer.handleUpgrade(req, req.socket, Buffer.alloc(0), this.onOpen);
}
