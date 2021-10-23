/**
 * @fileoverview Utils holds utility functions.
 */

 function Utils() {
}

Utils.generateRandomCharacter = function() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

Utils.generateRandomString = function(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += generateRandomCharacter();
    }
    return result;
}

if (typeof module === 'object') {
    module.exports = Utils;
} else {
    window.Utils = Utils;
}