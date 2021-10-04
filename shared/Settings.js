/**
 * @fileoverview The Settings class defines the game settings
 */

/**
 * @constructor
 * @param {int} turnTimeLimit How many seconds a player has to play a word.
 * @param {int} gameLength How long the game lasts, in number of sentences.
 */
function Settings(turnTimeLimit, gameLength) {
    this.turnTimeLimit = turnTimeLimit;
    this.gameLength = gameLength;
}

/**
 * Converts this object to a json string.
 * @return {String}
 */
Settings.prototype.toJSON = function() {
    return JSON.stringify(this);
}
