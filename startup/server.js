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
let socketToPlayer= new Map();

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
        console.log("Received: " + msg);
		let message = Message.fromJSON(msg);
        if (message.type == MessageType.CREATE_LOBBY) {
            let lobbyID = Utils.generateRandomString();
            lobbies.push(new Lobby("1", message.sourceID));
            // Send a message to the client with the lobby id
        } else {
            let l = getLobby(message.lobbyID);
            if (l != null) {
                l.handleMessage(message);
            } else {
                console.log("That lobby does not exist.");
            }
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



//Message-handling functions
/*---------------------------------*/

/**
 * Note: If you want to see logs on the server, type "sudo pm2 logs 0". You can see old console.logs
 * and also new ones as they're printed.
 */
function handleUsernameMsg(ws, msg) {
	console.log("server recieved a Username message");
	socketToPlayer.get(ws).id = JSON.stringify(msg.data); //replace with official code whenever
}

function handleSettingsMsg(ws, msg) {
	console.log("server recieved a Settings message");
}

function handleReadyMsg(ws, msg) {
	console.log("server recieved a Ready message");
}

function handlePlayerJoinMsg(ws, msg) {
	console.log("server recieved a Player_Join message");
}

function handlePlayerLeaveMsg(ws, msg) {
	console.log("server recieved a Player_Leave message");
}

function handWordMsg(ws, msg) {
	console.log("server recieved a Word message");
}

function handleCreateLobbyMsg(ws, msg) {
	console.log("server recieved a Create_Lobby message");
	//make new player, map socket to player, create a lobby specified by msg
	//Just temp code, switch this to whatever actually needs to happen on backend
	p = new Player(Utils.generateRandomString(8), "", "", false);
	socketToPlayer.set(ws, p);
	createLobby(msg.lobbyID, p);
}

function handleLobbyIDMsg(ws, msg) {
	console.log("server recieved a Lobby_ID message");
}

function handlePlayerDataMsg(ws, msg) {
	console.log("server recieved a Player_Data message");
}

function handleNextTurnMsg(ws, msg) {
	console.log("server recieved a Next_Turn message");
}

function handleLobbyStateMsg(ws, msg) {
	console.log("server recieved a Lobby_State message");
}

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


//helper functions
/*---------------------------------*/

function sendAllActivePlayerIDs() {
	let s = getAllActivePlayerIDs();
	wss.clients.forEach(function each(client) {
		if (socketToPlayer.get(client) != null)
			client.send("Your ID: " + (socketToPlayer.get(client)).id + " Everyone: " + s);

	});
}

function getAllActivePlayerIDs() {
	let str = "";
	wss.clients.forEach(function each(client) {
		if (socketToPlayer.get(client) != null)
			str += socketToPlayer.get(client).id + " ";
	});
	return str;
}

function createLobby(lobbyID, owner) {
    let l = new Lobby(lobbyID, owner);
    (l.players).add(p);
    lobbies.push(l);
   // console.log(lobby.owner);
}

/*---------------------------------*/
