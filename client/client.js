//some page switching 
/**
 * @fileoverview Client.js handles client-side sockets and events.
 */
//constants used in all functions; the location of the server and the socket used to communicate
const SERVER_WS_LOCATION = 'ws://3.144.98.109/Hivemind/startup/'; //not permanent, but where it's located now
const socket = new WebSocket(SERVER_WS_LOCATION);
const ID = Utils.generateRandomString(8);
const lobbyID = null;
let nextDivNum = 1;
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
	var readyButton = document.getElementById('readyButton');
	var submitButton = document.getElementById('submitButton');
	var joinButton = document.getElementById('JoinLobby');

	//give buttons functionality
	createLobby.onclick = onCreateLobbyClick;
	readyButton.onclick = onReadyClick;
	submitButton.onclick = onSubmitClick;
	joinButton.onclick = onJoinClick;

}

function onSubmitClick() {
	let attemptedUsername = document.getElementById("username").value;
	if (validUsername(attemptedUsername)) {
		let msg = new Message(23, 23, MessageType.USERNAME, 23, attemptedUsername);
		socket.send(msg.toJSON());
	}

}

function onJoinClick() {
	let lobby = document.getElementById('lobbyID').value;
	if (lobby != null) {
		socket.send(new Message(0, ID, MessageType.PLAYER_JOIN, lobby).toJSON())
	}
}


/**
 * Called when you click the "Create Lobby" button the main page
 */
function onCreateLobbyClick() {
	let msg = new Message(0, ID, MessageType.CREATE_LOBBY, 1, 'N/A');
	socket.send(msg.toJSON());
}

/**
 * Called when you click the "Ready" button in the lobby
 */
function onReadyClick() {
	let msg = new Message(23, 23, MessageType.READY, 23, 'N/A');
	socket.send(msg.toJSON());
}


/**
 * Called when websocket makes connection
 * @param {Socket} socket The socket that is being opened
 */
function onOpen(socket) {	

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
	let data_ = msg.data
	let message = Message.fromJSON(data_)

	//if someone joined 

	if (message.type = MessageType.PLAYER_JOIN) {
		//if that person was me, switch up my HTML from landing page to lobby
		//DEFINITELY want to enum-ify this so messing with page state isn't as ugly and is more efficient
		console.log(message);
		if (message.targetID == ID) {
    		var landing = document.getElementById('landing');
    		landing.style.display = 'none';
    		lobby.style.display = 'block';
			ready.style.display = 'block';
		}
		if (message.data != null) {
			//if this message has the player array, great, populate everything
			if (message.data.players != null) {
				refreshPlayersInLobby(message.data);
			}
			//else the message just has the new player, add their div
			else if (message.data.username != null) {
				createPlayerDiv(message.data, nextDivNum);
			}
		}
	//if join attempt was successful (i.e. lobby does exist), then switch up the HTML
	if (message.type = MessageType.PLAYER_JOIN) {
    	var landing = document.getElementById('landing');
    	landing.style.display = 'none';
    	lobby.style.display = 'block';
		ready.style.display = 'block';
	}
}

/**
 * Update the players in lobby based on the number of active connections.
 * Update by removing all, and then adding all back
 * @param {Message} msg The incoming msg
 */
function refreshPlayersInLobby(lobbyData) {
	if (lobbyData.players != null) { 
		let players = lobbyData.players;
		removePlayerDivs(players.length);
		addPlayerDivs(players, players.length);
	}

}

function removePlayerDivs(numPlayers) {
	console.log("here");
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
			document.getElementsByClassName('name')[0].textContent = players[i].username//get the correct div, name field within div;;
		}
		else {
			//create div for new player 
			createPlayerDiv(players[i], i);
		}
	}
	//possibly update the div num
	nextDivNum = nextDivNum < numPlayers ? numPlayers : nextDivNum;
}

function createPlayerDiv(player, playerid) {
	//get the last made player div
	var original = document.getElementById('player' + 0);

	//copy the div, change its ID, append it 
	var clone = original.cloneNode(true);
	clone.id = "player" + (playerid); // there can only be one element with an ID
	original.parentNode.appendChild(clone);

	//get the 'name' field, change it to be this players id
	document.getElementById(clone.id).getElementsByClassName('name')[0].textContent = player.username;
	if ((playerid) % 3 != 0) {
		document.getElementById(clone.id).style.gridColumnStart = "auto";
	}
	nextDivNum++;
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
	if(/^[\x00-\x7F]+$/.test(word)===false || /\s/g.test(word)==true) return false;
	else return true;
}

