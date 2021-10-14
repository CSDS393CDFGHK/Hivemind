/**
 * @fileoverview Client.js handles client-side sockets and events.
 */

/**
 * Called when websocket makes connection
 * @param {Socket} socket The socket that is being opened
 */
 function onOpen(socket){
    // does socket stuff
}

/**
 * Called when socket is closed
 * @param {Socket} socket The socket that is being closed
 */
function onClose(socket){
    // does socket stuff
}

/**
 * Called when the websocket sends/receives a JSON message
 * @param {Message} msg The incoming msg
 */
function onMessage(msg){
    // does the right stuff with the message
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