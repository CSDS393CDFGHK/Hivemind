const assert = require("assert");
const Message = require("../shared/Message.js")
const MessageType = require("../shared/MessageType.js")


describe('Message', function() {
  let m = new Message("asdrlkda", "wqkrlamn", MessageType.USERNAME, "opwnjhqa", {username: "Bob"});

  it("Should convert to JSON", function() {
    let json = m.toJSON();
    assert.strictEqual(json, '{"targetID":"asdrlkda","sourceID":"wqkrlamn","type":"username","lobbyID":"opwnjhqa","data":{"username":"Bob"}}');
  });

  it("Should convert from JSON to an equal object", function() {
    assert.deepStrictEqual(Message.fromJSON(m.toJSON()), m);
  });

});
