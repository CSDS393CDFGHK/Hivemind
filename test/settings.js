const assert = require("assert");
const Settings = require("../shared/Settings.js")

describe('Settings', function() {
  let s = new Settings(1, 2);

  it("Should convert to JSON", function() {
    let json = s.toJSON();
    assert.strictEqual(json, "{\"turnTimeLimit\":1,\"gameLength\":2}");
  });

  it("Should convert from JSON to an equal object", function() {
    assert.deepStrictEqual(Settings.fromJSON(s.toJSON()), s);
  });

});
