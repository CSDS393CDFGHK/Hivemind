/**
 * @fileoverview The server is in charge of serving webpages, managing Lobby objects,
 * and handling/passing websocket data to the correct lobby.
 */
// Doing things OO-style makes updating instance variables while handling websockets messier than it needs to be, so we'll keep this procedural.
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
let players = [];

//to manage all active socket connections




function accept(req, res) {
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end();
    return;
  }

  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
		ws.on('message', function message(msg) {

			//THIS CODE DOES NOT USE HIVEMIND MESSAGE BUT STRINGS, ONLY TO KEEP HTML STUFF WORKING
			/*----------------------*/
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
			/*----------------------*/

			//if the message wasn't taken care of above, it's a real message
			else {
				let message = Message.fromJSON(msg);
				if (message.type == MessageType.CREATE_LOBBY) {
					p = new Player(generateRandomString(8), "", "", false);
					players.push([p, ws]);
					createLobby(message.lobbyID, p);
				}
			}
			wss.clients.forEach(function each(client) {
				let str = "";
				players.forEach(player => str += player[0].id + '\t');
				client.send(str);
			});

		});

		ws.on('close', function close() {
			//if websocket is closed, filter it out of list
			//playersToSockets = playersToSockets.filter(player => player[1].readyState === ws.CLOSED);
			wss.clients.forEach(function each(client) {
				let str = "";
				players.forEach(player => str += player[0].id + '\t');
				client.send(str);
			});
		});



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
    // let lobby = new Lobby(generateRandomString(8), p.id);
    // lobby = new Lobby("", "");	
    (l.players).add(p);
    lobbies.push(l);
   // console.log(lobby.owner);
}

if (!module.parent) {
  http.createServer(accept).listen(SERVER_PORT);
} else {
  exports.accept = accept;
}
