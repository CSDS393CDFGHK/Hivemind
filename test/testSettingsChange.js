const Server = require("../startup/server.js");
const Message = require("../shared/Message.js");
const MessageType = require("../shared/MessageType.js");
const LobbyState = require("../shared/LobbyState.js");
const Settings = require("../shared/Settings.js");


const http = require('http');
const ws = require('ws');

var should = require('chai').should()

// Start the server here.
describe("Change Settings", function() {
    // Run this code before all the tests
    before(() => {
        SERVER_PORT = Math.floor(Math.random()*60000+2000); // A random port from 2000-62000
        server = http.createServer(Server.accept).listen(SERVER_PORT);

        // Create a websocket for the players
        ws1 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);
        ws2 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);

        // Count messages recieved. Hacky ish way to tell when we are done
        messagesRecieved = 0;

        // Client gets to choose playerID
        player1ID = "player1";
        player2ID = "player2";
        
        // Store lobbyID from server
        lobbyID = "";
    });

    it('Will create lobby and send messages back', function(done) {
        // First, player1 will connect and send create lobby message
        ws1.on('open', function open() {
            sendCreateLobbyMessage(ws1, player1ID);
        });

        ws1.on('message', function message(message) {
            lobbyID = Message.fromJSON(message).lobbyID;
            messagesRecieved += 1;
            if (messagesRecieved == 4) {
                done(); // Ensure lobby is created before next test runs
            }
        });
    });

    it('Player 2 will join', function() {
        sendJoinLobbyMessage(ws2, player2ID, lobbyID);
    });

    it('Player 1 will change settings', function(done) {
        newSettings = new Settings(12, 6);
        let messagesRecieved = 0;

        // Check settings change recieved by all players
        ws1.on('message', function message(message) {
            messagesRecieved += 1;
            msg = Message.fromJSON(message);
            checkSettingsMsg(msg, newSettings);
            if (messagesRecieved == 2) {
                done()
            };
        });

        ws2.on('message', function message(message) {
            messagesRecieved += 1;
            msg = Message.fromJSON(message);
            checkSettingsMsg(msg, newSettings);
            if (messagesRecieved == 2) {
                done()
            };
        });

        sendChangeSettingsMessage(ws1, player1ID, lobbyID, newSettings);
    });

    it('Player 2 can not change settings', function(done) {
        newSettings = new Settings(8, 4);

        // Check only the owner can change settings
        ws1.on('message', function message(message) {
            throw("Player 2 should not be able to change settings");
        });

        ws2.on('message', function message(message) {
            throw("Player 2 should not be able to change settings");
        });

        sendChangeSettingsMessage(ws2, player2ID, lobbyID, newSettings);
    });

    // Close everything, otherwise mocha hangs
    after(function() {
        ws1.close();
        ws2.close();
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

function sendChangeSettingsMessage(ws, playerID, lobbyID, settings) {
    let msg = new Message(0, playerID, MessageType.SETTINGS, lobbyID, settings.toDict());
    ws.send(msg.toJSON());
}

function checkSettingsMsg(msg, settings) {
    // Make sure settings are good
    msg.data.should.have.property('turnTimeLimit').that.is.a('number').that.equals(settings.turnTimeLimit);
    msg.data.should.have.property('gameLength').that.is.a('number').that.is.equals(settings.gameLength);
}

// Checks that all messages have correct form
function checkGenericMsg(msg) {
    msg.should.be.a('object');
    msg.should.have.all.keys('targetID', 'sourceID', 'type', 'lobbyID', 'data');
    // msg.data.should.be.an('object'); // Fix lobby state message!!
    msg['lobbyID'].should.have.lengthOf(8); // LOBBYID LENGTH = 8
}
