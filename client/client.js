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
let nextWordNum = 1; //TBH likely not necessary, we'll see
let readyStatus = false;
let lobbyLink = document.getElementById('lobbyLink')
//player_join can come before player_data, which can cause formatting inconsistency. This blocks that from occuring.
let playerDataReceived = false; 
let curState = null;

//Enum to describe current page state
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


	//give buttons (including those not shown) functionality
	var createLobby = document.getElementById('CreateLobby'); 
	var readyButton = document.getElementById('readyButton');
	var submitButton = document.getElementById('submitButton');
	var settingsButton = document.getElementById('settingsButton');
	var settingsSubmitButton = document.getElementById('settingsSubmitButton');
	var submitWordButton = document.getElementById('SubmitWord');
	
	createLobby.onclick = onCreateLobby;
	readyButton.onclick = onReadyStatusChange;
	submitButton.onclick = onUsernameTyped;
	settingsButton.onclick = allowSettingsChange;
	settingsSubmitButton.onclick = onChangeSettings;
	submitWordButton.onclick = onWordSubmit;

	changeState(PageState.LANDING)
}

function changeState(toState) {
	switch (toState) {
		case PageState.LANDING:
			displayLandingPage();
			curState = PageState.LANDING;
			break;
		case PageState.LOBBY:
			displayLobbyPage();
			curState = PageState.LOBBY;
			break;
		case PageState.GAME:
			curState = PageState.GAME;
			displayGamePage();
			transferPlayerDivs();
			break;
		//when unsure, display landing 
		default:
			displayLandingPage();
	}
}

function setUsernameCookie(username) {
	document.cookie = `username=${username};`;
}
function getUsernameCookie() {
	const value = `; ${document.cookie}`;
  	const c = value.split("; username=");
  	if (c.length === 2) 
	  return c.pop().split(';').shift();
}

function hideIDs(lis) {
	lis.forEach(id => document.getElementById(id).style.display = 'none');
}

function showIDs(lis) {
	lis.forEach(id => document.getElementById(id).style.display = 'block');
}

function displayLandingPage() {
	hideIDs(['lobby', 'ready', 'player0', 'lobbyLink', 'settingsButton', 'changeSettings', 'game', 'input']);
	showIDs(['landing']);
}

function displayLobbyPage() {
	hideIDs(['landing', 'game']);
	showIDs(['lobby', 'ready']);
}

function displayGamePage() {
	hideIDs(['landing', 'lobby', 'ready']);
	showIDs(['game', 'input']);
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
	document.getElementById('main').innerHTML = "";
	document.getElementById('main').textContent = "Disconnected from server. Please refresh the page.";
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
			console.log('here');
			onPlayerJoinMessage(message);
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
		case MessageType.READY:
			onReadyMessage(message);
			break;
		case MessageType.WORD:
			onWordMessage(message);
			break;
		case MessageType.NEXT_TURN:
			onNextTurnMessage(message);
			break;
		default:
			console.log('Messages of type ' + message.type + ' have not been configured yet.');
			break;

	}
}

function onWordMessage(message) {
	var word = message.data.word;
	var original = document.getElementById('word0');

	//copy the div, change its ID, append it 
	var clone = original.cloneNode(true);
	clone.id = "word" + nextWordNum;
	original.parentNode.appendChild(clone);
	let cloneDiv = document.getElementById(clone.id);
	cloneDiv.innerText = word;

	cloneDiv.style.display = "block";

	//probably want some logic to hide previous divs
}

/**
 * Handle next turn messages in game.
 * @param {Message} message The incoming msg
 */
function onNextTurnMessage(message) {
	var activePlayer = message.data.player;
	var textbox = document.getElementById('wordInput');
	indicateActivePlayer(activePlayer);
	if (activePlayer.id == ID) {
		textbox.readOnly = false; //allow typing 
	}
	else {
		textbox.value = ""; //clear what might be in text box
		textbox.readOnly = true; //don't allow more typing
	}
}

function indicateActivePlayer(activePlayer) {
	let activePlayerID = activePlayer.id;
	for (let i = 1; i <= nextDivNum; i++) {
		var playerDiv = document.getElementById("gamePlayer" + i);
		if (playerDiv !== null && playerDiv.getElementsByClassName("p_id") == activePlayerID) {
			//TODO: set border to diff color? Diff background color? idk, something to indicate it's this player's turn
		}
	}
}

function createGamePlayerDiv(message) {
	//make new div from copy, assign ID
	let player = message.data;
	let original = document.getElementById("gamePlayer0")
	let gameDiv = original.cloneNode(true);

	original.parentNode.appendChild(gameDiv);

	gameDiv.id = "gamePlayer" + nextDivNum;

	gameDiv.getElementsByClassName('name')[0].textContent = player.username;
	gameDiv.getElementsByClassName('p_id')[0].textContent = player.id;
	gameDiv.getElementsByClassName('dot')[0].style.backgroundColor = player.color;


	if (player.id == ID) { 
		gameDiv.getElementsByClassName('you')[0].style.display = 'block';
	}

	gameDiv.style.display = "block";
	nextDivNum++;
}

/**
 * Handle player join messages.
 * @param {Message} message The incoming msg
 */
function onPlayerJoinMessage(message) {
	lobbyID = message.lobbyID;
	if (curState !== PageState.GAME) {
		if(lobbyID !=null && lobbyLink.style.display==='none'){
			lobbyLink.style.display = 'block';
			lobbyLink.textContent += '?' + lobbyID;
		}
		if (message.data != null && message.data.username != null && playerDataReceived) {
			createPlayerDiv(message.data, nextDivNum);
		}
	}
	else {
		createGamePlayerDiv(message);
	}
	let savedUsername = getUsernameCookie()
	if (savedUsername !== 'undefined') {
		let msg = new Message(0, ID, MessageType.USERNAME, lobbyID, {'username':savedUsername});
		socket.send(msg.toJSON());
	}
}


/**
 * Handle player data messages. 
 * Player data messages are sent when a player joins a lobby, so change the state appropriately
 * @param {Message} message The incoming msg
 */
function onPlayerDataMessage(message) {
	changeState(PageState.LOBBY);
    initializePlayersInLobby(message.data);
	playerDataReceived = true;
}

/**
 * Handle player data messages.
 * @param {Message} message The incoming msg
 */
function onUsernameMessage(message) {
	let found = false;
	let playerid = message.data.id;
	let name = message.data.username;
	if (playerid == ID) {
		setUsernameCookie(name);
	}
	//iterating over divs and stopping when a boolean condition is met is done often and could be abstracted
	for (let i = 0; i <= nextDivNum && !found; i++) {
		let div = (curState === PageState.LOBBY) ? document.getElementById('player' + i) : document.getElementById('gamePlayer' + i);
		if (div != null && div.getElementsByClassName('p_id')[0].textContent == playerid) {
			div.getElementsByClassName('name')[0].textContent = name;
			found = true;
		}
	}
}

/**
 * Handle player leave messages.
 * @param {Message} message The incoming msg
 */
function onPlayerLeaveMessage(message) {
	if(message.data.ownerID==ID && curState === PageState.LOBBY) {
		settingsButton.style.display = 'block';	
	}
	removePlayerDiv(message.data.id, message.data.ownerID);
}

/**
 * Handle Lobby State messages.
 * @param {Message} message The incoming msg
 */
function onLobbyStateMessage(message) {
	let state = message.data.state == undefined ? message.data : message.data.state;
	if (state == 'lobby' && curState != PageState.LOBBY) {
		changeState(PageState.LOBBY);
	}
	else if (state == 'game' && curState != PageState.GAME) {
		changeState(PageState.GAME)
	}
	
}

/**
 * Handle Settings messages.
 * @param {Message} message The incoming msg
 */
function onSettingsMessage(message) {
	let turnTimeLimit = message.data['turnTimeLimit'];
	let gameLength = message.data['gameLength'];
	document.getElementById('numSentencesDisplay').textContent = 'Number of Sentences: ' + gameLength;
	document.getElementById('turnTimeLimitDisplay').textContent = 'Turn Time Limit: ' + turnTimeLimit + ' seconds';
}

/**
 * Handle Ready messages.
 * @param {Message} message The incoming msg
 */
function onReadyMessage(message) {
	var found = false;
	let playerid = message.data['id'];
	let r = message.data['ready'];
	for (let i = 1; i <= nextDivNum && !found; i++) {
		let div = document.getElementById('player' + i);
		if (div != null && div.getElementsByClassName('p_id')[0].textContent == playerid) {

			//if now ready and not being displayed, display check
			if (r && div.getElementsByClassName('check')[0].innerHTML.length == 0) 
				div.getElementsByClassName('check')[0].innerHTML = '<span>&#10003;</span>'
			
			//if not ready and check currently being displayed, remove it
			else if (!r && div.getElementsByClassName('check')[0].innerHTML.length > 0)
				div.getElementsByClassName('check')[0].innerHTML = ''

		}

	}
}

/**
 * Update the players in lobby based on the number of active connections.
 * Update by removing all, and then adding all back.
 * @param {LobbyData} lobbyData incoming msg
 */
function initializePlayersInLobby(lobbyData) {
	if (lobbyData.players != null) { 
		let players = lobbyData.players;
		let ownerID = lobbyData.ownerID;
		addPlayerDivs(players, players.length, ownerID);
	}
}

/**
 * Remove all divs currently in the lobby.
 * @param {int} numPlayers of divs to possibly remove
 */
function removePlayerDivs(numPlayers) {
	for (let i = 1; i <= numPlayers; i++) {
		if (document.getElementById('player' + i) !== null)
			document.getElementById('player' + i).remove();
	}
}

/**
 * Remove the div corresponding to a specific player.
 * @param {int} playerid the ID of the player to remove
 * @param {int} ownerID the ID of this lobby's owner
 */
function removePlayerDiv(playerid, ownerID) {
	let found = false
	//if other players have left, nextDivNum != numPlayers, so iterate over all possible
	//In case owner left, look for new owner, assign their color appropriately
	if (curState === PageState.LOBBY) {
		for (let i = 1; i <=  nextDivNum && !found; i++) {
			let div = document.getElementById('player' + i);
			if (div != null && div.getElementsByClassName('p_id')[0].textContent == playerid) {
				div.remove();
			}
			if (div != null && div.getElementsByClassName('p_id')[0].textContent == ownerID)
				div.getElementsByClassName('container')[0].style.backgroundColor = '#F1E5AC';
		}
	}
	else if (curState === PageState.GAME) {
		for (let i = 1; i <= nextDivNum && !found; i++) {
			let div = document.getElementById('gamePlayer' + i);
			if (div != null && div.getElementsByClassName('p_id')[0].textContent == playerid) {
				div.remove();
			}
		}
	}
}

/**
 * Adds all the divs based on the players list.
 * @param {Player} players the list of players to add
 * @param {int} ownerID the ID of this lobby's owner
 * @param {int} numPlayers number of players in the list
 */
function addPlayerDivs(players, numPlayers, ownerID) {
	//(i - 1) = id of last player div displayed (i.e. when i == 0, no player divs have been displayed)
	for (let i = 0; i < numPlayers; i++) {
		createPlayerDiv(players[i], i + 1, ownerID);
	}
	//possibly update the div num
	nextDivNum = nextDivNum < numPlayers ? numPlayers : nextDivNum;
}

/**
 * Create a single player div
 * @param {int} divNum identifier used on the frontend to create identifiable, iterable divs
 * @param {Player} player data of the player to add
 * @param {int} ownerID ID of this lobby's owner
 */
function createPlayerDiv(player, divNum, ownerID) {
	var original = document.getElementById('player0');

	//copy the div, change its ID, append it 
	var clone = original.cloneNode(true);
	clone.id = "player" + (divNum); 
	original.parentNode.appendChild(clone);
	let cloneDiv = document.getElementById(clone.id)
	
	//get the 'name' field, change it to be this player's id
	cloneDiv.style.display = 'block'; //player0 may be inivisible, make sure it can be seen
	cloneDiv.getElementsByClassName('name')[0].textContent = player.username;
	cloneDiv.getElementsByClassName('p_id')[0].textContent = player.id;
	cloneDiv.getElementsByClassName('dot')[0].style.backgroundColor = player.color;

	if (player.ready) {
		cloneDiv.getElementsByClassName('check')[0].innerHTML = '<span>&#10003;</span>';
	}
	else {
		cloneDiv.getElementsByClassName('check')[0].innerHTML = '';

	}

	if (player.id == ID) { 
		cloneDiv.getElementsByClassName('you')[0].style.display = 'block';
	}

	if (player.id == ownerID) {
		cloneDiv.getElementsByClassName('container')[0].style.backgroundColor = '#F1E5AC';
	}
	else {
		cloneDiv.getElementsByClassName('container')[0].style.backgroundColor = '#FFFFFF';
	}

	if ((divNum) % 3 != 0) {
		cloneDiv.style.gridColumnStart = "auto";
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

function onWordSubmit() {
	//if it's my turn, do this. TODO: Add if statement 
	const text = document.getElementById("wordInput").value;
	let msg = new Message(0, ID, MessageType.WORD, lobbyID, {'word':text});
	socket.send(msg.toJSON());
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

/**
 * Called when a link was used to join the game.
 * @param {String} urlSuffix The last part of the URL (ex: http://3.144.98.109/?HK1z24J3 -> HK1z24J3)
 */
function onJoinFromLink(urlSuffix) {
	lobbyID = urlSuffix;
	if (lobbyID != null) {
		let msg = new Message(0, ID, MessageType.PLAYER_JOIN, lobbyID);
		socket.send(msg.toJSON());
	}
}

/**  
 * Called when the player changes their ready status. Sends a msg to the server.
 */
function onReadyStatusChange(){
	readyStatus = !readyStatus; //flip ready status
	let msg = new Message(0, ID, MessageType.READY, lobbyID, {'ready':readyStatus});
	socket.send(msg.toJSON());
}

/** 
 * Called when the player submits the changed settings. Sends a message to the server containing information about the settings.
 */
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



function transferPlayerDivs() {
	for (let i = 1; i < nextDivNum; i++) {
		var div = document.getElementById("player" + i);
		if (div !== null) {
			//make new div from copy, assign ID
			let original = document.getElementById("gamePlayer0")
			let gameDiv = original.cloneNode(true);

			original.parentNode.appendChild(gameDiv);

			let lobbyDiv = document.getElementById('player' + i);

			//probably could make this stuff its own function, a problem for later
			gameDiv.id = "gamePlayer" + i;
			gameDiv.getElementsByClassName('name')[0].textContent = lobbyDiv.getElementsByClassName('name')[0].textContent;
			gameDiv.getElementsByClassName('p_id')[0].textContent = lobbyDiv.getElementsByClassName('p_id')[0].textContent;
			gameDiv.getElementsByClassName('you')[0].textContent = lobbyDiv.getElementsByClassName('you')[0].textContent;
			gameDiv.getElementsByClassName('dot')[0].style.backgroundColor = lobbyDiv.getElementsByClassName('dot')[0].style.backgroundColor

			var visibility = window.getComputedStyle(lobbyDiv.getElementsByClassName("you")[0],null).getPropertyValue('display')
			console.log(visibility)
			if (visibility == 'block') {
				gameDiv.getElementsByClassName('you')[0].style.display = 'block';
			}
			else {
				gameDiv.getElementsByClassName('you')[0].style.display = 'none';

			}
			gameDiv.style.display = "block";			
		}
	}
}

initialize();

/*
Can't test with mocha normally bc you can't use
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
	onPlayerJoinMessage,
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
