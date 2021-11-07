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
	; //for now, don't do anything on open
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
	let message = Message.fromJSON(msg.data)
	console.log(message);

	//TODO: Make this a switch
	if (message.type == MessageType.PLAYER_JOIN) {
		onJoinMessage(message);
	}

	else if (message.type == MessageType.PLAYER_DATA) {
		//TODO: abstract this to another function, make HTML state changing more streamlined
		if (message.targetID == ID) {
			console.log("IDs match");
    		var landing = document.getElementById('landing');
    		landing.style.display = 'none';
    		lobby.style.display = 'block';
			ready.style.display = 'block';
		}
		refreshPlayersInLobby(message.data);
	}

	else if (message.type == MessageType.PLAYER_LEAVE) {
		removePlayerDiv(message.data.id);
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

/**
 * Remove all divs currently in the lobby
 * @param {numPlayers} the number divs to possibly remove
 */
function removePlayerDivs(numPlayers) {
	console.log("here");
	//set OG div to invisible, delete rest of them
	document.getElementById('player0').style.display = 'none';
	for (let i = 1; i <= numPlayers; i++) {
		if (document.getElementById('player' + i) !== null)
			document.getElementById('player' + i).remove();
	}
}

/**
 * Remove the div corresponding to a specific player
 * @param {playerid} the ID of the player to remove
 */
function removePlayerDiv(playerid) {
	console.log(playerid);
	var removed = false;
	if (document.getElementById('player0').getElementsByClassName('p_id')[0].textContent == playerid) {
		document.getElementById('player0').style.display = 'none';
	}
	//if other players have left, nextDivNum != numPlayers, so iterate over all possible
	for (let i = 0; i <=  nextDivNum && !removed; i++) {
		let div = document.getElementById('player' + i);
		if (div != null) {
			console.log(div.getElementsByClassName('p_id')[0].textContent);
		}
		if (div != null && div.getElementsByClassName('p_id')[0].textContent == playerid) {
			div.remove();
		}
	}
}

/**
 * Given a list of all players, add their divs
 * @param {players} the list of players to add
 * @param {numPlayers} the number of players in the list
 */
function addPlayerDivs(players, numPlayers) {
	//(i - 1) = id of last player div displayed (i.e. when i == 0, no player divs have been displayed)
	for (let i = 0; i < numPlayers; i++) {
		if (i == 0) {
			//expose the player0 div, edit the player name 
			document.getElementById('player0').style.display = 'block';
			document.getElementById('player0').style.gridColumnStart = "5";
			document.getElementById('player0').getElementsByClassName('name')[0].textContent = players[i].username//get the correct div, name field within div;;
			document.getElementById('player0').getElementsByClassName('p_id')[0].textContent = players[i].id;
		}
		else {
			//create div for new player 
			createPlayerDiv(players[i], i);
		}
	}
	//possibly update the div num
	nextDivNum = nextDivNum < numPlayers ? numPlayers : nextDivNum;
}

/**
 * Create a single player div
 * @param {player} the information of the player whose div we want to create
 * @param {divNum} the identifier used on the frontend to create identifiable, iterable divs
 */
function createPlayerDiv(player, divNum) {
	var original = null;
	var original = document.getElementById('player' + 0); //A possible cause for weird HTML bugs, likely want to change at some point 

	//copy the div, change its ID, append it 
	var clone = original.cloneNode(true);
	clone.id = "player" + (divNum); // there can only be one element with an particular div num
	original.parentNode.appendChild(clone);

	//get the 'name' field, change it to be this players id
	document.getElementById(clone.id).getElementsByClassName('name')[0].textContent = player.username;
	document.getElementById(clone.id).getElementsByClassName('p_id')[0].textContent = player.id;
	if ((divNum) % 3 != 0) {
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


function onJoinMessage(message){
	if (message.data != null && message.data.username != null) {
		createPlayerDiv(message.data, nextDivNum);
	}
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

