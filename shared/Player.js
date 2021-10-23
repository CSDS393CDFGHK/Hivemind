/**
 * @fileoverview The Player class stores data associated with a Player.
 */

 const Utils = require("../shared/Utils.js");

/**
 * @constructor
 * @param {int} id Unique, secret identifier of this player
 * @param {String} username Display name of this player
 * @param {int} color Stores player's color as in integer representation of hex code
 * @param {Boolean} ready Is this player ready to start the game
 */
 function Player(id, username, color, ready) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.ready = ready;
}

/**
 * @constructor
 * @param {int} id Unique, secret identifier of this player
 */
function Player(id) {
   this.id = id;
   this.username = Utils.generateRandomString();
   this.color = "000000";
   this.ready = false;
}

/**
 * Converts this object to a json string.
 * @return {String}
 */
Player.prototype.toJSON = function() {
    properties = {
        id: this.id,
        username: this.username,
        color: this.color,
        ready: this.ready,
    }
    return JSON.stringify(properties);
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

if (typeof module === 'object') {
    module.exports = Player;
} else {
    window.Player = Player;
}
