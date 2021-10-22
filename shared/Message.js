/**
 * @fileoverview The Message class is used to standardize the data being sent
 * from client <--> server via websockets.
 */

/**
 * @constructor
 * @param {int} targetID For use by server only. The id of the player to send the message to.
 *              A value of -1 indicates the message should be sent to all players.
 * @param {int} sourceID For use by client only. The id of the player sending the message.
 * @param {MessageType} type The type of data being sent.
 * @param {String} lobbyID The lobby's unique random identifier.
 * @param {Object} data The content of the message.
 */
 function Message(targetID, sourceID, type, lobbyID, data) {
    this.targetID = targetID;
    this.sourceID = sourceID;
    this.type = type;
    this.lobbyID = lobbyID;
    this.data = data;
}

/**
 * Converts this object to a json string.
 * @return {String}
 */
Message.prototype.toJSON = function() {
    // If you pass the object itself with "this", it will stringify the function names which we don't want
    properties = {
        targetID: this.targetID,
        sourceID: this.sourceID,
        type: this.type,
        lobbyID: this.lobbyID,
        data: this.data
    }
    return JSON.stringify(properties);
}

/**
 * Static method to convert a json string to a Message object.
 * @param {String} json
 * @return {Message}
 */
Message.fromJSON = function(json) {
    // Need to transfer bare data to an actual object
    data = JSON.parse(json);
    return new Message(data.targetID, data.sourceID, data.type, data.lobbyID, data.data);
}

module.exports = Message;
