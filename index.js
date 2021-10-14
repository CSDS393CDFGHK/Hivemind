const ws = require("ws");
const Message = require("./shared/Message.js");
const MessageType = require("./shared/MessageType.js");
const Lobby = require("./server/Lobby.js");
const express = require("express");
const app = express();
const http = require("http");
const Player = require("./shared/Player.js");
const server = http.createServer(app); //Might be Robbie's thing?????????
const wsServer = new ws.WebSocketServer({ port: 8080 });

let lobbies = [];

app.get("/", (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log("Hi, I'm listening on 3000");
});

wsServer.on('connection', function connection(ws) {
    p = new Player(generateRandomString(8), "", ""/*Put generatecolor here*/, false);
    console.log("New ws connection");
    ws.on('message', function incoming(msg) {
        console.log('Received: %s', msg);
        let message = Message.fromJSON(msg);
        console.log(message.lobbyID);
        if (message.type == MessageType.CREATE_LOBBY) {
            createLobby(p);
        }
    });
});

function createLobby(p) {
    let lobby = new Lobby("");
    // let lobby = new Lobby(generateRandomString(8), p.id);
    // lobby = new Lobby("", "");
    // lobbies.push(lobby);
    // lobby.players.push(p);
    // console.log(lobby.owner);
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