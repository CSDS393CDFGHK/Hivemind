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
    // If you pass the object itself with "this", it will stringify the function names which we don't want
    properties = {
        turnTimeLimit: this.turnTimeLimit,
        gameLength: this.gameLength,
    }
    return JSON.stringify(properties);
}

/**
 * Static method to convert a json string to a Settings object.
 * @param {String} json
 * @return {Settings}
 */
Settings.fromJSON = function(json) {
    // Need to transfer bare data to an actual object
    data = JSON.parse(json);
    return new Settings(data.turnTimeLimit, data.gameLength);
}

module.exports = Settings;
