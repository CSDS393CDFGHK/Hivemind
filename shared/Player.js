/**
 * @fileoverview The Player class stores data associated with a Player.
 */

/**
 * @constructor
 * @param {int} id Unique, secret identifier of this player
 * @param {String} username Display name of this player
 * @param {int} color Stores player's color as in integer representation of hex code
 * @param {Boolean} ready Is this player ready to start the game
 * @param {isOwner} isOwner Is this player the owner of the lobby
 */
 function Player(id, username, color, ready, isOwner) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.ready = ready;
    this.isOwner = isOwner;
}

/**
 * Converts this object to a json string.
 * @return {String}
 */
Player.prototype.toJSON = function() {
    // The id is private, only send the other data    
    properties = {
        username: this.username,
        color: this.color,
        ready: this.ready,
        isOwner: this.isOwner,
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
    // The id's of other players are not transfered in json, nor are they needed
    // on the client side, so id will be set to 0
    data = JSON.parse(json);
    return new Player(0, data.username, data.color, data.ready, data.isOwner);
}

module.exports = Player;
