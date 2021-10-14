const ws = require("ws");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app); //Might be Robbie's thing?????????
const wsServer = new ws.WebSocketServer({ port: 8080 });

app.get("/", (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log("Hi, I'm listening on 3000");
});

wsServer.on('connection', function connection(ws) {
    console.log("New ws connection");
    ws.on('message', function incoming(msg) {
        console.log('Received: %s', msg);
        let message = Message.fromJSON(msg);
    });
});
