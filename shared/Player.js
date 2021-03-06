/**
 * @fileoverview The Player class stores data associated with a Player.
 */

/**
 * @constructor
 * @param {String} id Unique, secret identifier of this player
 * @param {String} username Display name of this player
 * @param {String} color Stores player's color as in integer representation of hex code
 * @param {Boolean} ready Is this player ready to start the game
 */
 function Player(id, username, color, ready) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.ready = ready;
}

/**
 * Converts this object to a dictionary.
 * @return {String}
 */
Player.prototype.toDict = function() {
    properties = {
        id: this.id,
        username: this.username,
        color: this.color,
        ready: this.ready,
    }
    return properties;
}

/**
 * Static method to convert a json string to a Player object.
 * @param {String} json
 * @return {Player}
 */
Player.fromJSON = function(json) {
    // Need to transfer bare data to an actual object
    data = JSON.parse(json);
    return new Player(data.id, data.username, data.color, data.ready);
}

/**
 * Converts this object to a string.
 * @return {String}
 */
 Player.prototype.toString = function() {
    return JSON.stringify(this.toDict());
}

if (typeof module === 'object') {
    module.exports = Player;
} else {
    window.Player = Player;
}
