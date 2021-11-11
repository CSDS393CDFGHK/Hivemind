const Server = require("../../startup/server.js");
const Message = require("../../shared/Message.js");
const MessageType = require("../../shared/MessageType.js");

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
let lobbyID = "";

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
        console.log("Sending join messages")
        sendJoinLobbyMessage(ws2, player2ID, lobbyID);
        sendJoinLobbyMessage(ws3, player3ID, lobbyID);
        sendJoinLobbyMessage(ws4, player4ID, lobbyID);

        // Step 3: Make all the players ready
        console.log("Sending ready messages")
        sendReadyMessage(ws1, player1ID, lobbyID, true);
        sendReadyMessage(ws2, player2ID, lobbyID, true);
        sendReadyMessage(ws3, player3ID, lobbyID, true);
        sendReadyMessage(ws4, player4ID, lobbyID, true);

        // Step 4: Send words in order
        console.log("Sending word messages")
        sendWordMessage(ws1, player1ID, lobbyID, "The");
        sendWordMessage(ws2, player2ID, lobbyID, "dog");
        sendWordMessage(ws3, player3ID, lobbyID, "said");
        sendWordMessage(ws4, player4ID, lobbyID, "hi");
        sendWordMessage(ws1, player1ID, lobbyID, "there");
        sendWordMessage(ws2, player2ID, lobbyID, "dude");

        // Step 5 send words not in order
        console.log("Sending bad order word messages")
        sendWordMessage(ws2, player2ID, lobbyID, "a");
        sendWordMessage(ws1, player1ID, lobbyID, "b");

        // Step 6 send a word with a period (It is player 3's turn)
        sendWordMessage(ws3, player3ID, lobbyID, "yup.");

        // Step 7: A player whose turn it isn't leaves
        console.log("Player 3 leaving")
        ws3.close();

        // Step 8: more words
        console.log("Sending more words")
        sendWordMessage(ws4, player4ID, lobbyID, "Then");
        sendWordMessage(ws1, player1ID, lobbyID, "he");

        // Step 8: Player whose turn it is leaves
        console.log("Player 2 leaving")
        ws2.close();

        // Step 9: It should now be next player's turn
        console.log("Sending more words")
        sendWordMessage(ws3, player3ID, lobbyID, "said");
        sendWordMessage(ws1, player1ID, lobbyID, "hello.");
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

function sendReadyMessage(ws, playerID, lobbyID, ready) {
    let msg = new Message(0, playerID, MessageType.READY, lobbyID, {ready: ready});
    ws.send(msg.toJSON());
}

function sendWordMessage(ws, playerID, lobbyID, word) {
    let msg = new Message(0, playerID, MessageType.WORD, lobbyID, {word: word});
    ws.send(msg.toJSON());
}
