const Server = require("../startup/server.js");
const Message = require("../shared/Message.js");
const MessageType = require("../shared/MessageType.js");
const LobbyState = require("../shared/LobbyState.js");

const http = require('http');
const ws = require('ws');

var should = require('chai').should()

// Start the server here.
describe("Handle Bad Inputs", function() {
    var server;

    // Run this code before all the tests
    before(() => {
        SERVER_PORT = Math.floor(Math.random()*60000+2000); // A random port from 2000-62000
        server = http.createServer(Server.accept).listen(SERVER_PORT);

        // Create a websocket for the player
        ws1 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);
        
        // Store lobbyID from server
        lobbyID = "";
    });

    it('Will not crash on malformed JSON', function(done) {
        // First, player1 will connect and send create lobby message
        ws1.on('open', function open() {
            ws1.send("a");
            done();
        });
    });

    // Close everything, otherwise mocha hangs
    after(function() {
        ws1.close();
        server.close();
    });
});

function sendCreateLobbyMessage(ws, playerID) {
    let msg = new Message(0, playerID, MessageType.CREATE_LOBBY);
    ws.send(msg.toJSON());
}

function sendJoinLobbyMessage(ws, playerID, lobbyID) {
    let msg = new Message(0, playerID, MessageType.PLAYER_JOIN, lobbyID);
    ws.send(msg.toJSON());
}
