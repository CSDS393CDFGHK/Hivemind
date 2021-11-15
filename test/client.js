import { exportedForTesting } from "../client/client.js";


describe('client', function() {
  
    it("should say this is a valid username ", function() {
        expect(exportedForTesting.validUsername('robbie')).to.equal(true);
    });
});