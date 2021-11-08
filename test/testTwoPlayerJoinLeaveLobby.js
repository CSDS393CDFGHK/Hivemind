const Server = require("../startup/server.js");
const Message = require("../shared/Message.js");
const MessageType = require("../shared/MessageType.js");

const http = require('http');
const ws = require('ws');

// Start the server here.
SERVER_PORT = 8000
http.createServer(Server.accept).listen(SERVER_PORT);

// Create two websockets for two players
let ws1 = new ws.WebSocket("ws://localhost:8000");
let ws2 = new ws.WebSocket("ws://localhost:8000");

// Client gets to choose playerID, but server makes lobbyID
let player1ID = "player1";
let player2ID = "player2";
let lobbyID = "";

// First, player1 will connect and send create lobby message
ws1.on('open', function open() {
    console.log("ws1 connected");
    sendCreateLobbyMessage(ws1, player1ID);
});

ws1.on('message', function message(message) {
    console.log("ws1 recieved " + message);
    msg = Message.fromJSON(message);

    // When we recieve player data message, store lobby ID and have player 2 join
    if (msg.type == MessageType.PLAYER_DATA) {
        lobbyID = msg.lobbyID;
        sendJoinLobbyMessage(ws2, player2ID, lobbyID);
    }
});

ws1.on('close', function close(message) {
    console.log("ws1 closed");
});

ws2.on('open', function open() {
    console.log("ws2 connected");
});

ws2.on('message', function message(message) {
    console.log("ws2 recieved " + message);
    msg = Message.fromJSON(message);

    // When we recieve player data message, close first websocket
    if (msg.type == MessageType.PLAYER_DATA) {
        ws1.close();
    }
});

function sendCreateLobbyMessage(ws, playerID) {
    let msg = new Message(0, playerID, MessageType.CREATE_LOBBY);
    ws.send(msg.toJSON());
}

function sendJoinLobbyMessage(ws, playerID, lobbyID) {
    let msg = new Message(0, playerID, MessageType.PLAYER_JOIN, lobbyID);
    ws.send(msg.toJSON());
}
