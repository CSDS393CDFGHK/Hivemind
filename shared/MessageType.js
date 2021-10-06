/**
 * @fileoverview This Enum defines the type of data that is sent from
 * client <--> server over the websocket connection.
 */
const MessageType = {
    USERNAME: "username",
    SETTINGS: "settings",
    READY: "ready",
    PLAYER_JOIN: "player_join",
    PLAYER_LEAVE: "player_leave",
    WORD: "word",
    PLAYER_DATA: "player_data",
    NEXT_TURN: "next_turn",
    LOBBY_STATE: "lobby_state",
}

module.exports = MessageType;
