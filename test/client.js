import { exportedForTesting } from "../client/client.js";

var expect = chai.expect;

describe('client', function() {
  
    it("should say this is a valid username ", function() {
        expect(exportedForTesting.validUsername('robbie')).to.equal(true);
    });

    it("should say this is an invalid username ", function() {
        expect(exportedForTesting.validUsername('hi robbie')).to.equal(false);
    });

    it("should say this is an invalid username ", function() {
        expect(exportedForTesting.validUsername('ssssssssssssssssssssssssssss')).to.equal(false);
    });

    it("should say this is an invalid username ", function() {
        expect(exportedForTesting.validUsername('')).to.equal(false);
    });

    it("should say this is an invalid username ", function() {
        expect(exportedForTesting.validUsername('ssssssssssss ssssssssssssssss')).to.equal(false);
    });

    it("should say this is an invalid username ", function() {
        expect(exportedForTesting.validUsername(' ')).to.equal(false);
    });
});