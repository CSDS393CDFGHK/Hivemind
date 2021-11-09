const Server = require("../startup/server.js");
const Message = require("../shared/Message.js");
const MessageType = require("../shared/MessageType.js");
const LobbyState = require("../shared/LobbyState.js");


const http = require('http');
const ws = require('ws');

var should = require('chai').should()

// Start the server here.
describe("Create Lobby", function() {
    var server;

    // Run this code before all the tests
    before(() => {
        SERVER_PORT = Math.floor(Math.random()*60000+2000); // A random port from 2000-62000
        server = http.createServer(Server.accept).listen(SERVER_PORT);

        // Create a websocket for the player
        ws1 = new ws.WebSocket("ws://localhost:" + SERVER_PORT);

        // Count messages recieved. Hacky ish way to tell when we are done
        messagesRecieved = 0;

        // Client gets to choose playerID, but server makes lobbyID
        player1ID = "player1";
    });

    it('Will create lobby and send messages back', function(done) {
        // First, player1 will connect and send create lobby message
        ws1.on('open', function open() {
            sendCreateLobbyMessage(ws1, player1ID);
        });

        // Handle and check all messages recieved
        ws1.on('message', function message(message) {
            msg = Message.fromJSON(message);

            // Check all messages for validity
            checkGenericMsg(msg);

            // Check the message based on its type
            switch (msg.type) {
                case MessageType.SETTINGS:
                    checkSettingsMsg(msg);
                    break;
                case MessageType.PLAYER_JOIN:
                    checkPlayerJoinMsg(msg);
                    break;
                case MessageType.PLAYER_DATA:
                    checkPlayerDataMsg(msg);
                    break;
                case MessageType.LOBBY_STATE:
                    checkLobbyStateMsg(msg);
                    break;
                default:
                    throw("Unknown message type: " + msg.type);
                    break;
            };

            // We are done when we recieve 4 messages from the server
            // Note this does not check they are unique messages
            messagesRecieved += 1;
            if (messagesRecieved == 4) {
                done();
            }
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

// Check that all the players are being sent
function checkPlayerDataMsg(msg) {
    msg.data.should.have.property('ownerID').that.is.a('string');
    msg.data.should.have.property('players').that.is.an('Array').with.a.lengthOf.above(0);

    // Check every player message
    let players = msg.data.players;
    for (let i = 0; i < players.length; i++) {
        checkPlayerDict(players[i]);
    }
}

// Check this gives the identity of the new player
function checkPlayerJoinMsg(msg) {
    msg.data.should.have.all.keys('id', 'username', 'color', 'ready');
    checkPlayerDict(msg.data);
}

// Check we recieve the current state of the lobby
function checkLobbyStateMsg(msg) {
    // Lobby State message only returns not a dictionary!!
    // msg.data.should.have.property('state').that.is.a('string').that.equals(LobbyState.LOBBY);
}

function checkSettingsMsg(msg) {
    // Make sure settings are good
    msg.data.should.have.property('turnTimeLimit').that.is.a('number').that.is.above(0);
    msg.data.should.have.property('gameLength').that.is.a('number').that.is.above(0);
}

// Checks that all messages have correct form
function checkGenericMsg(msg) {
    msg.should.be.a('object');
    msg.should.have.all.keys('targetID', 'sourceID', 'type', 'lobbyID', 'data');
    // msg.data.should.be.an('object'); // Fix lobby state message!!
    msg['lobbyID'].should.have.lengthOf(8); // LOBBYID LENGTH = 8
}

function checkPlayerDict(data) {
    data.id.should.be.a('string');
    data.username.should.be.a('string');
    data.color.should.be.a('string').with.lengthOf(7);
    data.ready.should.be.a('boolean');
}
