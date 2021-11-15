import { exportedForTesting } from "../client/client.js";

var expect = chai.expect;

describe('client', function() {
  
    it("should say this is a valid username ", function() {
        expect(exportedForTesting.validUsername('robbie')).to.equal(true);
    });
});