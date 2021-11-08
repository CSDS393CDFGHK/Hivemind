const assert = require("assert");
const Player = require("../shared/Player.js")

describe('Player', function() {
  let p = new Player("asdlkda", "Bob", "#FF0000", false, true);

  it("Should convert to dictionary", function() {
    let actual = p.toDict();
    let expected = {id:"asdlkda",username:"Bob",color:"#FF0000",ready:false};
    assert.deepStrictEqual(actual, expected);
  });

  it("Should convert from dictionary to an equal object", function() {
    assert.deepStrictEqual(Player.fromJSON(JSON.stringify(p.toDict())), p);
  });

  it("Should convert to a string", function() {
    let expected = '{"id":"asdlkda","username":"Bob","color":"#FF0000","ready":false}';
    assert.strictEqual(p.toString(), expected);
  });
});
