const Server = require("../../startup/server.js");
const Message = require("../../shared/Message.js");
const MessageType = require("../../shared/MessageType.js");
const LobbyState = require("../../shared/LobbyState.js");

const http = require('http');
const ws = require('ws');

// Start the server here.
SERVER_PORT = Math.floor(Math.random()*60000+2000); // A random port from 2000-62000
server = http.createServer(Server.accept).listen(SERVER_PORT);

// Create four websockets for four players
let ws1 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);
let ws2 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);
let ws3 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);
let ws4 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);

// Client gets to choose playerID, but server makes lobbyID
let player1ID = "player1";
let player2ID = "player2";
let player3ID = "player3";
let player4ID = "player4";
let player5ID = "player5";
let lobbyID = "";

// Delay between calls (ms)
PAUSE_TIME = 5;

// Debugs for non ws1
ws2.on('open', function open() {console.log("ws2 connected");});
ws3.on('open', function open() {console.log("ws3 connected");});
ws4.on('open', function open() {console.log("ws4 connected");});

ws2.on('message', function message(message) {console.log("ws2 recieved " + message)});
ws3.on('message', function message(message) {console.log("ws3 recieved " + message)});
ws4.on('message', function message(message) {console.log("ws4 recieved " + message)});

// Step 1: player1 will connect and send create lobby message
ws1.on('open', function open() {
    console.log("ws1 connected");
    sendCreateLobbyMessage(ws1, player1ID);
});

ws1.on('message', function message(message) {
    console.log("ws1 recieved " + message);
    msg = Message.fromJSON(message);

    // Step 2: have the other players join
    if (msg.type == MessageType.PLAYER_DATA) {
        lobbyID = msg.lobbyID;

        // Run through the game setup commands
        runTheTest();
    }
});

// Need to make this function async so it can use sleep
// All these functions are async so they can have a delay
async function runTheTest() {
   console.log("Sending join messages")
    await sendJoinLobbyMessage(ws2, player2ID, lobbyID);
    await sendJoinLobbyMessage(ws3, player3ID, lobbyID);
    await sendJoinLobbyMessage(ws4, player4ID, lobbyID);

    // Step 3: Send valid usernames
    console.log("Sending username change messages")
    await sendUsernameMessage(ws1, player1ID, lobbyID, "OrangePorcupine");
    await sendUsernameMessage(ws2, player2ID, lobbyID, "RedTurtle");
    await sendUsernameMessage(ws3, player3ID, lobbyID, "BlueGoose");
    await sendUsernameMessage(ws4, player4ID, lobbyID, "AmberMantis");

    // Step 4: Send improper messages
    console.log("Sending improper messages")
    await sendNextTurnMessage(ws1, player1ID, lobbyID);
    await sendPlayerDataMessage(ws2, player2ID, lobbyID, {"ownerID":player1ID, arr:[]});
    await sendLobbyStateMessage(ws3, player3ID, lobbyID, LobbyState.GAME);

    // Close everything
    // ws1.close();
    // ws2.close();
    // ws3.close();
    // ws4.close();
    // ws5.close();
    // server.close();
}

async function sendCreateLobbyMessage(ws, playerID) {
    let msg = new Message(0, playerID, MessageType.CREATE_LOBBY);
    ws.send(msg.toJSON());
    await sleep(PAUSE_TIME);
}

async function sendJoinLobbyMessage(ws, playerID, lobbyID) {
    let msg = new Message(0, playerID, MessageType.PLAYER_JOIN, lobbyID);
    ws.send(msg.toJSON());
    await sleep(PAUSE_TIME);
}

async function sendUsernameMessage(ws, playerID, lobbyID, username) {
    let msg = new Message(0, playerID, MessageType.USERNAME, lobbyID, {"username": username});
    ws.send(msg.toJSON());
    await sleep(PAUSE_TIME);
}

async function sendNextTurnMessage(ws, playerID, lobbyID) {
    let msg = new Message(0, playerID, MessageType.NEXT_TURN, lobbyID);
    ws.send(msg.toJSON());
    await sleep(PAUSE_TIME);
}

async function sendPlayerDataMessage(ws, playerID, lobbyID, data) {
    let msg = new Message(0, playerID, MessageType.USERNAME, lobbyID, data);
    ws.send(msg.toJSON());
    await sleep(PAUSE_TIME);
}

async function sendLobbyStateMessage(ws, playerID, lobbyID, state) {
    let msg = new Message(0, playerID, MessageType.LOBBY_STATE, lobbyID, {"state": state});
    ws.send(msg.toJSON());
    await sleep(PAUSE_TIME);
}

// Sleep function returns a promise that resolves after the time
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}