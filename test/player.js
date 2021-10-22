const assert = require("assert");
const Player = require("../shared/Player.js")

describe('Player', function() {
  let p = new Player("asdlkda", "Bob", "#FF0000", false, true);

  it("Should convert to JSON", function() {
    let json = p.toJSON();
    assert.strictEqual(json, '{"id":"asdlkda","username":"Bob","color":"#FF0000","ready":false,"isOwner":true}');
  });

  it("Should convert from JSON to an equal object", function() {
    assert.deepStrictEqual(Player.fromJSON(p.toJSON()), p);
  });

});
