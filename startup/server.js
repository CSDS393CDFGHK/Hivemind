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
		let message = Message.fromJSON(msg);
		switch (message.type) {
			case MessageType.USERNAME:
				handleUsernameMsg(ws, message);
				break;

			case MessageType.CREATE_LOBBY:
				handleCreateLobbyMsg(ws, message);
				break;

			case MessageType.SETTINGS:
				handleSettingsMsg(ws, message);
				break;

			case MessageType.READY:
				handleReadyMsg(ws, message);
				break;

			case MessageType.PLAYER_JOIN:
				handlePlayerJoinMsg(ws, message);
				break;

			case MessageType.PLAYER_LEAVE:
				handlePlayerLeaveMsg(ws, message);
				break;

			case MessageType.WORD:
				handleWordMsg(ws, message);
				break;

			case MessageType.LOBBY_ID:
				handlLobbyIDMsg(ws, message);
				break;

			case MessageType.PLAYER_DATA:
				handlePlayerDataMsg(ws, message);
				break;

			case MessageType.NEXT_TURN:
				handleNextTurnMsg(ws, message);
				break;

			case MessageType.LOBBY_STATE:
				handleLobbyStateMsg(ws, message);
				break;
			
			default:
				throw new Error('Recieved Unknown Message Type: ' + message.type);
			
		}
		sendAllActivePlayerIDs();
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
	socketToPlayer.get(ws).id = JSON.stringify(msg.data);
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
	p = new Player(generateRandomString(8), "", "", false);
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

/*---------------------------------*/


//helper functions
/*---------------------------------*/

function sendAllActivePlayerIDs() {
	let s = getAllActivePlayerIDs();
	wss.clients.forEach(function each(client) {
		client.send("Your ID: " + (socketToPlayer.get(client)).id + " Everyone: " + s);

	});
}

function getAllActivePlayerIDs() {
	let str = "";
	wss.clients.forEach(function each(client) {
		str += socketToPlayer.get(client).id + " ";
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

/*---------------------------------*/
