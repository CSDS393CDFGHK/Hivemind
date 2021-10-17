/**
 * @fileoverview The server is in charge of serving webpages, managing Lobby objects,
 * and handling/passing websocket data to the correct lobby.
 */
const http = require('http');
const ws = require('ws');
const Message = require("../shared/Message.js");
const MessageType = require("../shared/MessageType.js");
const Player = require("../shared/Player.js");
const Lobby = require("../server/Lobby.js");


const SERVER_PORT = 8000; 
const wss = new ws.Server( { noServer: true });
var count = 0;
let lobbies = [];
let socketToPlayer= new Map();


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
		//Will be removed when Hivemind Msgs are used everywhere
		if (isStringMessage(msg)) {
			handleStringMessage(msg, ws);
		}

		//Hivemind messages
		else {
			let message = Message.fromJSON(msg);
			if (message.type == MessageType.CREATE_LOBBY) {
				//make new player, map socket to player, create a lobby specified by msg
				p = new Player(generateRandomString(8), "", "", false);
				socketToPlayer.set(ws, p.id);
				createLobby(message.lobbyID, p);
			}
			sendAllActivePlayerIDs();
		}
	});

	ws.on('close', function close() {
		socketToPlayer.delete(ws);
		sendAllActivePlayerIDs();
	});
}


function startServer() {
	if (!module.parent) {
  		http.createServer(accept).listen(SERVER_PORT);
	} else {
  		exports.accept = accept;
	}
}

startServer();

//helper functions
/*---------------------------------*/
function sendAllActivePlayerIDs() {
	let s = getAllActivePlayerIDs();
	
	wss.clients.forEach(function each(client) {
		client.send("Your ID: " + socketToPlayer.get(client) + " Everyone: " + s);
	});
}

function getAllActivePlayerIDs() {
	let str = "";
	wss.clients.forEach(function each(client) {
		str += socketToPlayer.get(client) + " ";
	});
	return str;
}
function generateRandomCharacter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}


function generateRandomString(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += generateRandomCharacter();
    }
    return result;
}

function createLobby(lobbyID, owner) {
    let l = new Lobby(lobbyID, owner);
    (l.players).add(p);
    lobbies.push(l);
   // console.log(lobby.owner);
}

function handleStringMessage(msg, ws) {
	if (msg== "Opening") {
		count++;
		wss.clients.forEach(function each(client) {
			client.send(count);
		});
	}
	//handles closing when not leaving page.
	else if (msg == "Closing") {
		count--;
		wss.clients.forEach(function each(client) {
			client.send(count);
		});
	}
	else if (msg == "Create Lobby") {
		console.log("here");
		lobbies.push("this is a lobby");
		ws.send("L_CREATED: The server has recognized that you created a lobby. " + lobbies.length + " lobbies have been created since last server restart.");
	}
}

function isStringMessage(msg) {
	return msg == "Opening" || msg == "Closing" || msg == "Create Lobby";
}
/*---------------------------------*/


