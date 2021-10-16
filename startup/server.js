/**
 * @fileoverview The server is in charge of serving webpages, managing Lobby objects,
 * and handling/passing websocket data to the correct lobby.
 */
const http = require('http');
const ws = require('ws');
const SERVER_PORT = 8000; 
const wss = new ws.Server( { noServer: true });
var count = 0;

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
		ws.on('message', function message(message) {
			if (message == "Opening") {
				count++;
				wss.clients.forEach(function each(client) {
					client.send(count);
				});
			}
			//handles closing when not leaving page.
			else if (message == "Closing") {
				count--;
				wss.clients.forEach(function each(client) {
					client.send(count);
				});
			}
		});


		ws.on('close', function close() {
			count--;
			wss.clients.forEach(function each(client) {
				client.send(count);
			});
		});
}

if (!module.parent) {
  http.createServer(accept).listen(SERVER_PORT);
} else {
  exports.accept = accept;
}
