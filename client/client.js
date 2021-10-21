//some page switching 
/**
 * @fileoverview Client.js handles client-side sockets and events.
 */

//constants used in all functions; the location of the server and the socket used to communicate
const SERVER_WS_LOCATION = 'ws://3.144.98.109/Hivemind/startup/'; //not permanent, but where it's located now
const socket = new WebSocket(SERVER_WS_LOCATION);
initialize();

/**
 * First function called when client.js is recieved by client.
 */
function initialize() {
	//configure socket stuff
	socket.onopen = onOpen;
	socket.onmessage = websocketCallback;
	socket.onclose = onClose;

	//hide Lobby stuff initially
	var lobby = document.getElementById('lobby');
	lobby.style.display = 'none';
	var ready = document.getElementById('ready');
	ready.style.display = 'none';
	var createLobby = document.getElementById('CreateLobby'); 
	var player = document.getElementById('player0');
	player.style.display = 'none';


	//give buttons functionality
	createLobby.onclick = onCreateLobbyClick;
	ready.onclick = onReadyClick;
}

/**
 * Called when you click the "Create Lobby" button the main page
 */
function onCreateLobbyClick() {
	socket.send('{"targetID":23, "sourceID":23, "type":"create_lobby", "lobbyID":23, "data": {"hello":3}}');
    var landing = document.getElementById('landing');
    landing.style.display = 'none';
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
function onOpen(socket) {	
	//
}

/**
 * Called when socket is closed
 * @param {Socket} socket The socket that is being closed
 */
function onClose(socket){
    socket.send("Closing");
}

/**
 * Incoming event handler. Passes events to other handlers based on msg.type
 * @param {Message} msg The incoming msg
 */
 function websocketCallback(msg) {
	 //if msg is player leave/player join, need to refresh. Only operation currently supported.
	refreshPlayersInLobby(msg);
}

/**
 * Update the players in lobby based on the number of active connections.
 * Update by removing all, and then adding all back
 * @param {Message} msg The incoming msg
 */
function refreshPlayersInLobby(msg) {
	const ar = msg.data.split(" ");

	//Cut off the "Your ID: Everyone" portion, get only the players.
	const players = ar.slice(4, -1);
	const myID = ar[2];
	const numPlayers = players.length;

	removePlayerDivs(numPlayers);

	addPlayerDivs(players, numPlayers);
}

function removePlayerDivs(numPlayers) {
	//set OG player to invisible, delete rest of them
	document.getElementById('player0').style.display = 'none';
	for (let i = 1; i <= numPlayers; i++) {
		if (document.getElementById('player' + i) !== null)
			document.getElementById('player' + i).remove();
	}
}

function addPlayerDivs(players, numPlayers) {
	//(i - 1) = id of last player div displayed (i.e. when i == 0, no player divs have been displayed)
	for (let i = 0; i < numPlayers; i++) {
		if (i == 0) {
			//expose the player0 div, edit the player name 
			document.getElementById('player0').style.display = 'block';
			document.getElementById('player0').style.gridColumnStart = "5";
			document.getElementsByClassName('name')[0].textContent = players[i] //get the correct div, name field within div
		}
		else {
			//create div for new player 
			createPlayerDiv(players[i], i);
		}
	}
}

function createPlayerDiv(player, playerid) {
	//get the last made player div
	var original = document.getElementById('player' + 0);

	//copy the div, change its ID, append it 
	var clone = original.cloneNode(true);
	clone.id = "player" + (playerid); // there can only be one element with an ID
	original.parentNode.appendChild(clone);

	//get the 'name' field, change it to be this players id
	document.getElementById(clone.id).getElementsByClassName('name')[0].textContent = player;
	if ((playerid) % 3 != 0) {
		document.getElementById(clone.id).style.gridColumnStart = "auto";
	}
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
 * @return {Boolean} Returns whether the username was valid
 * */ 
function validUsername(word){
	word = word.trim();
	if(/^[\x00-\x7F]+$/.test(word)===false) return false;
}

