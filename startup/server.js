/**
 * @fileoverview The server is in charge of serving webpages, managing Lobby objects,
 * and handling/passing websocket data to the correct lobby.
 */
const http = require('http');
const ws = require('ws');
const Message = require("../shared/Message.js");
const MessageType = require("../shared/MessageType.js");
const Utils = require("../shared/Utils.js");
const Player = require("../shared/Player.js");
const Lobby = require("../server/Lobby.js");

const SERVER_PORT = 8000; 
const wss = new ws.Server( { noServer: true });
let lobbies = [];
let sockets = {};
let socketsToPlayers = {};

console.log("Server exists now");

function accept(req, res) {
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end();
    return;
  }
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketAction);
}

function onSocketAction(ws) {
	ws.on('message', function message(msg) {
		onMessage(msg, ws);
	});

	ws.on('close', function close() {
		let playerID = socketsToPlayers[ws]["playerID"];
		let lobbyID = socketsToPlayers[ws]["lobbyID"];
		let m = new Message(-1, playerID, MessageType.PLAYER_LEAVE, lobbyID);
       	console.log("Player " + playerID + " in " + lobbyID + " has left.");
		delete socketsToPlayers[ws];
		delete sockets[lobbyID][playerID];
		onMessage(m.toJSON(), ws);
	});
}

function onMessage(message, ws) {
	// console.log("Received: " + message);
	// console.log(sockets);
	let msg = Message.fromJSON(message);
	// Create the lobby or find the lobby and send the message on
	if (msg.type == MessageType.CREATE_LOBBY) {
		let lobbyID = Utils.generateRandomString(8);
		lobbies.push(new Lobby(lobbyID, msg.sourceID));
		sockets[lobbyID] = {};
		sockets[lobbyID][msg.sourceID] = ws;
		socketsToPlayers[ws] = {"lobbyID":lobbyID, "playerID":msg.sourceID};

		console.log(`Created lobby ${lobbyID} with owner ${msg.sourceID}`);

		// Tell client the new lobby id
		sendMessage(new Message(msg.sourceID, "", MessageType.LOBBY_ID, lobbyID, {}));
		return;
	}

	// Sends the message on to the lobby
	let lobby = getLobby(msg.lobbyID);
	if (lobby == null) {
		console.log("Lobby " + msg.lobbyID + " does not exist.");
		return;
	}
	let toClientMessages = lobby.handleMessage(msg);

	// Handles websockets and lobby deletion
	if (msg.type == MessageType.PLAYER_JOIN) {
		sockets[msg.lobbyID][msg.sourceID] = ws;
		socketsToPlayers[ws] = {"lobbyID":msg.lobbyID, "playerID":msg.sourceID};
		console.log(`Player ${msg.sourceID} has joined ${msg.lobbyID}`);
	} else if (msg.type == MessageType.PLAYER_LEAVE) {
		// Delete lobby if there are no players
		if (lobby.players.length == 0) {
			lobbies.splice(lobbies.indexOf(lobby));

			console.log(`Deleted empty lobby ${lobby.lobbyID}`);
			delete sockets[lobby.lobbyID];
		} 
	}

	for (i = 0; i < toClientMessages.length; i++) {
		sendMessage(toClientMessages[i]);
	}
}

function startServer() {
	if (!module.parent) {
  		http.createServer(accept).listen(SERVER_PORT);
	} else {
  		exports.accept = accept;
	}
}

startServer();

// Returns the lobby based on an input id, returns null otherwise.
function getLobby(id) {
	for (i = 0; i < lobbies.length; i++) {
		if (lobbies[i].getID() == id) {
			return lobbies[i];
		}
	}
	return null;
}

/*---------------------------------*/

// Sends a message to the client based on id (or to all if the targetID is "all")
function sendMessage(msg) {
	// If the lobby has been deleted or msg has an invalid lobbyID
	if (!(msg.lobbyID in sockets)) {
		return;
	}

	if (msg.targetID == "all") {
		Object.keys(sockets[msg.lobbyID]).forEach(key => {
			sockets[msg.lobbyID][key].send(msg.toJSON());
		})
		return;
	}

	// Send to a single person if not sending to all
	sockets[msg.lobbyID][msg.targetID].send(msg.toJSON());
}