const assert = require("assert");
const Message = require("../shared/Message.js")
const MessageType = require("../shared/MessageType.js")
const LobbyState = require("../shared/LobbyState.js")


describe('Message', function() {
  let m = new Message("asdrlkda", "wqkrlamn", MessageType.USERNAME, "opwnjhqa", {username: "Bob", state: LobbyState.LOBBY});

  it("Should convert to JSON", function() {
    let json = m.toJSON();
    let expected =  '{"targetID":"asdrlkda","sourceID":"wqkrlamn","type":"username","lobbyID":"opwnjhqa","data":{"username":"Bob","state":"lobby"}}';
    assert.strictEqual(json, expected);
  });

  it("Should convert from JSON to an equal object", function() {
    assert.deepStrictEqual(Message.fromJSON(m.toJSON()), m);
  });

});
