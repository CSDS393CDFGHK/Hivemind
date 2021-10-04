/**
 * @fileoverview This Enum defines the type of data that is sent from
 * client <--> server over the websocket connection. 
 */
const MessageType = {
    USERNAME: "username",
    SETTINGS: "settings",
    READY: "ready",
    PLAYERJOIN: "playerjoin",
    PLAYERLEAVE: "playerleave",
    WORD: "word",
    PLAYERDATA: "playerdata",
    NEXTTURN: "nextturn",
    LOBBYSTATE: "lobbystate",
}
