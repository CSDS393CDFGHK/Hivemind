//some page switching 
/**
 * @fileoverview Client.js handles client-side sockets and events.
 */

const SERVER_WS_LOCATION = 'ws://3.144.98.109/Hivemind/startup/'; //not permanent, but where it's located now
let socket = new WebSocket(SERVER_WS_LOCATION);
socket.onopen = function(e) {
	onOpen(socket);
}
socket.onmessage = function(event) {
	onMessage(event);
}
socket.onclose = function(event) {
	onClose(socket);
}

//hide Lobby stuff initially
var lobby = document.getElementById('lobby');
lobby.style.display = 'none';
var ready = document.getElementById('ready');
ready.style.display = 'none';
var button = document.getElementById('CreateLobby'); 


//when button is clicked, hide landing page and display lobby and ready button.
//Send msg to server indicating that we want a lobby created.
button.onclick = onCreateLobbyClick;

ready.onclick = onReadyClick;


/**
 * Called when you click the "Create Lobby" button the main page
 */
function onCreateLobbyClick() {
	socket.send('{"targetID":23, "sourceID":23, "type":"create_lobby", "lobbyID":23, "data": {"hello":3}}');
    var landing = document.getElementById('landing');
    landing.style.display = 'none';
    ready.style.display = 'block';
    lobby.style.display = 'block';
}

/**
 * Called when you click the "Ready" button in the lobby
 */
function onReadyClick() {
	socket.send('{"targetID":23, "sourceID":23, "type":"ready", "lobbyID":23, "data": {"hello":3}}');
}


/**
 * Called when websocket makes connection
 * @param {Socket} socket The socket that is being opened
 */
function onOpen(socket){	
	//might not need anything here
}

/**
 * Called when socket is closed
 * @param {Socket} socket The socket that is being closed
 */
function onClose(socket){
    socket.send("Closing");
}

/**
 * Called when the websocket sends/receives a JSON message
 * @param {Message} msg The incoming msg
 */
function onMessage(Message){
	console.log(Message.data);
	//if the first word of the response is "L_CREATED"
	if (Message.data.split(" ")[0] == "L_CREATED:") {
		alert(Message.data);
	}
}

/**
 * Incoming event handler. Passes events to other handlers based on msg.type
 * @param {Message} msg The incoming msg
 */
 function websocketCallback(msg) {

}

/**
 *  Sends a message to the server linked with the Player object through the client's WebSocket based on the targetID in msg
 * @param {Message} msg The incoming msg
 * @return {Boolean} Returns boolean representing message sending success
 */
function sendMessage(lobbyID, msg){
    
}

/**  Called when the server indicates the game has begun. Starts the game on the client's page. */
function handleGameStart(){

}

/**  Called when the player joins a game. Sends data about the player to the server */
function onJoin(){

}

/**  Sends a CreateLobby message to the server */
function onCreateLobby(){

}

/**  Called when a player enters a new username or attempts to change an existing username. Validates username and sends a msg to the server
 * */
function onUsernameTyped(){

}

/**  Called when the player changes their ready status. Sends a msg to the server.
 * */
function onReadyStatusChange(){

}

/** Called when the player changes the settings. Sends a message to the server containing information about the settings.
 * */
function onChangeSettings(){

}

/**
 * Checks to see if a username is valid 
 * @param {String} word The string that the user has input
 * @param {Player} p The player that input the word
 * @return {Boolean} Returns whether the username was valid
 * */ 
function validUsername(word, p){

}
