//some page switching 
/**
 * @fileoverview Client.js handles client-side sockets and events.
 */

//constants used in all functions
const SERVER_WS_LOCATION = 'ws://3.144.98.109/Hivemind/startup/'; //not permanent, but where it's located now
const socket = new WebSocket(SERVER_WS_LOCATION);
const ID = Utils.generateRandomString(8);
let lobbyID = null;
let nextDivNum = 1; //The next certainly valid number we can use for a div
let readyStatus = false;
let lobbyLink = null;

//Enum to describe current page state: Not used yet, but will be
const PageState = {
	LANDING:'landing',
	LOBBY:'lobby',
	GAME:'game'
}

/**
 * First function called when client.js is recieved by client.
 */
function initialize() {
	//configure socket stuff
	socket.onopen = onOpen;
	socket.onmessage = websocketCallback;
	socket.onclose = onClose;

	//hide Lobby stuff initially (and game stuff once that is on here too)
	var lobby = document.getElementById('lobby');
	lobby.style.display = 'none';
	var ready = document.getElementById('ready');
	ready.style.display = 'none';
	var createLobby = document.getElementById('CreateLobby'); 
	var player = document.getElementById('player0');
	player.style.display = 'none';
	lobbyLink = document.getElementById('lobbyLink');
	lobbyLink.style.display = 'none';
	var readyButton = document.getElementById('readyButton');
	var submitButton = document.getElementById('submitButton');
	var settingsButton = document.getElementById('settingsButton');
	settingsButton.style.display = 'none';
	var changeSettings = document.getElementById('changeSettings');
	changeSettings.style.display = 'none';
	var settingsSubmitButton = document.getElementById('settingsSubmitButton');


	//give buttons functionality
	createLobby.onclick = onCreateLobby;
	readyButton.onclick = onReadyStatusChange;
	submitButton.onclick = onUsernameTyped;
	settingsButton.onclick = allowSettingsChange;
	settingsSubmitButton.onclick = onChangeSettings;
}

/**
 * Called when websocket makes connection
 * @param {Socket} socket The socket that is being opened
 */
function onOpen(socket) {	
	//see if we're trying to join lobby from link
	let urlSuffix = window.location.search;
	if (urlSuffix != null) {
		onJoinFromLink(urlSuffix.substring(1));
	}
}

/**
 * Called when socket is closed
 * @param {Socket} socket The socket that is being closed
 */
function onClose(socket){
	/*
	 *TODO: If a websocket connection is closed due to idling (ex: leaving the app on mobile), then websockets 
	 * The client's screen is stil just the lobby, with no indication that there's an issue. Probably should make 
	 * some HTML page when an error has occurred saying "disconnected from server. Please refresh to continue" or 
	 * something else of that effect.
	 */
}

/**
 * Incoming event handler. Passes events to other handlers based on msg.type
 * @param {Message} msg The incoming msg
 */
 function websocketCallback(msg) {
	let message = Message.fromJSON(msg.data)
	console.log(message);
	switch (message.type) {
		case MessageType.PLAYER_JOIN:
			onJoinMessage(message);
			break;
		case MessageType.PLAYER_DATA:
			onPlayerDataMessage(message);
			break;
		case MessageType.PLAYER_LEAVE:
			onPlayerLeaveMessage(message);
			break;
		case MessageType.USERNAME:
			onUsernameMessage(message);
			break;
		case MessageType.LOBBY_STATE:
			onLobbyStateMessage(message);
			break;
		case MessageType.SETTINGS:
			onSettingsMessage(message);
			break;
		default:
			console.log('Messages of type ' + message.type + ' have not been configured yet.');
			break;

	}
}

function onJoinMessage(message){
	lobbyID = message.lobbyID;
	if(lobbyID!=null && lobbyLink.style.display==='none'){
		lobbyLink.style.display = 'block';
		lobbyLink.textContent += '?' + lobbyID;
	}
	if (message.data != null && message.data.username != null) {
		createPlayerDiv(message.data, nextDivNum);
	}
}

function onPlayerDataMessage(message) {
    var landing = document.getElementById('landing');
    landing.style.display = 'none';
    lobby.style.display = 'block';
    ready.style.display = 'block';
    initializePlayersInLobby(message.data);
}

function onUsernameMessage(message) {
	let found = false;
	let playerid = message.data.id;
	let name = message.data.username;
	//iterating over divs and stopping when a boolean condition is met is done often and could be abstracted
	for (let i = 0; i < nextDivNum && !found; i++) {
		let div = document.getElementById('player' + i);
		if (div != null && div.getElementsByClassName('p_id')[0].textContent == playerid) {
			div.getElementsByClassName('name')[0].textContent = name;
			found = true;
		}
	}
}

function onPlayerLeaveMessage(message) {
	console.log('made it here');
	if(message.data.ownerID==ID){
		changeSettings.style.display = 'block';
		console.log('made it inside if');
	}
	removePlayerDiv(message.data.id);
}

function onLobbyStateMessage(message) {
}

function onSettingsMessage(message) {
	let turnTimeLimit = message.data['turnTimeLimit'];
	let gameLength = message.data['gameLength'];
	document.getElementById('numSentencesDisplay').textContent = 'Number of Sentences: ' + turnTimeLimit;
	document.getElementById('turnTimeLimitDisplay').textContent = 'Turn Time Limit: ' + gameLength + ' seconds';
}

function onReadyMessage(message) {

}

/**
 * Update the players in lobby based on the number of active connections.
 * Update by removing all, and then adding all back
 * @param {Message} msg The incoming msg
 */
function initializePlayersInLobby(lobbyData) {
	if (lobbyData.players != null) { 
		let players = lobbyData.players;
		let ownerID = lobbyData.ownerID;
		//by default a single player div is there at the top left with my username
		//remove it and readd in proper place so formatting is consistent will all other players in lobby
		removePlayerDivs(players.length); 
		addPlayerDivs(players, players.length, ownerID);
	}

}

/**
 * Remove all divs currently in the lobby
 * @param {numPlayers}  number of divs to possibly remove
 */
function removePlayerDivs(numPlayers) {
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
function removePlayerDiv(playerid, ownerID) {
	var removed = false;
	//If it's player0 we're trying to remove, set it to invisible 
	if (document.getElementById('player0').getElementsByClassName('p_id')[0].textContent == playerid) {
		var player0 = document.getElementById('player0');
		player0.style.display = 'none';
		//make sure background is white if copied, new players who join can't be leaders 
		player0.getElementsByClassName('container')[0].style.backgroundColor = '#FFFFFF'; 
	}
	//if other players have left, nextDivNum != numPlayers, so iterate over all possible
	//also look for new owner, assign their color appropriately
	for (let i = 1; i <=  nextDivNum; i++) {
		let div = document.getElementById('player' + i);
		if (div != null && div.getElementsByClassName('p_id')[0].textContent == playerid) {
			div.remove();
		}
		else if (div.getElementsByClassName('p_id')[0].textContent == ownerID)
			div.getElementsByClassName('container')[0].style.backgroundColor = '#F1E5AC';
	}
}

/**
 * Adds all the divs based on the players list
 * @param {players} the list of players to add
 * @param {numPlayers} the number of players in the list
 */
function addPlayerDivs(players, numPlayers, ownerID) {
	//(i - 1) = id of last player div displayed (i.e. when i == 0, no player divs have been displayed)
	for (let i = 0; i < numPlayers; i++) {
		if (i == 0) {
			var player0 = document.getElementById('player0');
			//expose the player0 div, edit the player info 
			player0.style.display = 'block';
			player0.style.gridColumnStart = "5";
			player0.getElementsByClassName('name')[0].textContent = players[i].username//get the correct div, name field within div;;
			player0.getElementsByClassName('p_id')[0].textContent = players[i].id;
			player0.getElementsByClassName('dot')[0].style.backgroundColor = players[i].color
			if (players[i].id == ownerID)
				player0.getElementsByClassName('container')[0].style.backgroundColor = '#F1E5AC';
			else 
				player0.getElementsByClassName('container')[0].style.backgroundColor = '#FFFFFF';
				
		}
		else {
			//create div for new player 
			createPlayerDiv(players[i], i, ownerID);
		}
	}
	//possibly update the div num
	nextDivNum = nextDivNum < numPlayers ? numPlayers : nextDivNum;
}

/**
 * Create a single player div * @param {player} the information of the player whose div we want to create
 * @param {divNum} the identifier used on the frontend to create identifiable, iterable divs
 */
function createPlayerDiv(player, divNum, ownerID) {
	var original = document.getElementById('player' + 0);

	//copy the div, change its ID, append it 
	var clone = original.cloneNode(true);
	clone.id = "player" + (divNum); 
	original.parentNode.appendChild(clone);
	
	//get the 'name' field, change it to be this player's id
	document.getElementById(clone.id).style.display = 'block'; //player0 may be inivisible, make sure it can be seen
	document.getElementById(clone.id).getElementsByClassName('name')[0].textContent = player.username;
	document.getElementById(clone.id).getElementsByClassName('p_id')[0].textContent = player.id;
	document.getElementById(clone.id).getElementsByClassName('dot')[0].style.backgroundColor = player.color;
	document.getElementById(clone.id).getElementsByClassName('container')[0].style.backgroundColor = '#FFFFFF';

	if ((divNum) % 3 != 0) {
		document.getElementById(clone.id).style.gridColumnStart = "auto";
	}
	nextDivNum++;
}


/**  Called when the server indicates the game has begun. Starts the game on the client's page. */
function handleGameStart(){
	
}

/**  Called when the change settings button is clicked. Shows the changeable settings. */
function allowSettingsChange(){
	document.getElementById('settingsInfo').style.display = 'none';
	settingsButton.style.display = 'none';
	changeSettings.style.display = 'block';
}

/**  Sends a CreateLobby message to the server */
function onCreateLobby(){
	settingsButton.style.display = 'block';
	let msg = new Message(0, ID, MessageType.CREATE_LOBBY, 1, 'N/A');
	socket.send(msg.toJSON());
}

/**  Called when a player enters a new username or attempts to change an existing username. Validates username and sends a msg to the server
 * */
function onUsernameTyped(){
	let attemptedUsername = document.getElementById("username").value;
	if (validUsername(attemptedUsername)) {
		let msg = new Message(0, ID, MessageType.USERNAME, lobbyID, {'username':attemptedUsername} );
		socket.send(msg.toJSON());
	}
	else {
		alert("Please type in a username with 1-20 ASCII characters and no spaces!")
		document.getElementById('username').value = '';
	}
}

function onJoinFromLink(urlSuffix) {
	lobbyID = urlSuffix;
	if (lobbyID != null) {
		let msg = new Message(0, ID, MessageType.PLAYER_JOIN, lobbyID);
		socket.send(msg.toJSON());
	}
}

/**  Called when the player changes their ready status. Sends a msg to the server.
 * */
function onReadyStatusChange(){
	readyStatus = !readyStatus; //flip ready status
	let msg = new Message(0, ID, MessageType.READY, lobbyID, {'ready':readyStatus});
	socket.send(msg.toJSON());
}

/** Called when the player submits the changed settings. Sends a message to the server containing information about the settings.
 * */
function onChangeSettings(){
	// display settings info
	document.getElementById('settingsInfo').style.display = 'block';
	settingsButton.style.display = 'block';
	changeSettings.style.display = 'none';
	// get values of inputs
	let turnTimeLimit = document.getElementById('timeLimit').value;
	let gameLength = document.getElementById('sentenceLimit').value;
	document.getElementById('numSentencesDisplay').textContent = 'Number of Sentences: ' + turnTimeLimit;
	document.getElementById('turnTimeLimitDisplay').textContent = 'Turn Time Limit: ' + gameLength + ' seconds';
	// inform the server of the changes
	let msg = new Message(0, ID, MessageType.SETTINGS, lobbyID, {'turnTimeLimit':turnTimeLimit, 'gameLength':gameLength});
	socket.send(msg.toJSON());
}

/**
 * Checks to see if a username is valid 
 * @param {String} word The string that the user has input
 * @return {Boolean} Returns whether the username was valid
 * */ 
function validUsername(word){
	if(/^[\x00-\x7F]+$/.test(word)===false || /\s/g.test(word)==true) return false;
	if(word.length > 20 || word.length < 1) return false;
	else return true;
}

initialize();

/*
Can't test with mocha normally bc  you can't use
 non-ES6 functions (i.e. require) with vanilla JS. Can't access functions 
 functions from other files with either an export or the use of the 
 rewire library, which apparently can cause problems with mocha, 
 so according to some dude stack overflow, this is the best way to do things.
 IDK tbh 
*/
export const exportedForTesting = {
	initialize, 
	onOpen,
	onClose,
	websocketCallback,
	onJoinMessage,
	onPlayerDataMessage,
	onUsernameMessage,
	onPlayerDataMessage,
	onLobbyStateMessage,
	onSettingsMessage,
	onReadyMessage,
	initializePlayersInLobby,
	removePlayerDiv,
	removePlayerDivs,
	addPlayerDivs,
	createPlayerDiv,
	handleGameStart,
	onCreateLobby,
	onUsernameTyped,
	onJoinFromLink,
	onReadyStatusChange,
	onChangeSettings,
	validUsername
}
