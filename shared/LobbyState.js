/**
 * @fileoverview This Enum defines the states of the game/lobby.
 * Lobby: Players are in the lobby waiting for the game to start.
 * Game: Players are playing the game.
 * GameEnd: The game has ended, players wait for the Lobby Owner to bring them back to the lobby.
 */
const LobbyState = {
    LOBBY: "lobby",
    GAME: "game",
    GAME_END: "game_end",
}

if (typeof module === 'object') {
    module.exports = LobbyState;
} else {
    window.LobbyState = LobbyState;
}
