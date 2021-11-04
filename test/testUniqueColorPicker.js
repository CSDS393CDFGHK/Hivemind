const assert = require('assert');
const UniqueColorPicker = require("../server/UniqueColorPicker.js");

describe('UniqueColorPicker', function() {
  // Create two to make sure they are independent
  let p1 = new UniqueColorPicker();
  let p2 = new UniqueColorPicker();

  let colors1 = [];
  let colors2 = [];

  let N = p1.getNumColors();
  let numLess = 2;

  // Leave 2 colors free
  for (let i = 0; i < N - numLess; i++) {
      colors1.push(p1.pickColor());
      colors2.push(p2.pickColor());
  }

  it("Should have different color orders", function() {
    assert.notDeepStrictEqual(colors1, colors2);
  });

  // Free the third color for each
  let freedIndex = 2;
  p1.freeColor(colors1[freedIndex]);
  p2.freeColor(colors2[freedIndex]);

  // We should now be able to generate 4 more colors with no issues (N - 2 - 1) + 3 = N
  for (let i = 0; i < numLess + 1; i++) {
      colors1.push(p1.pickColor());
      colors2.push(p2.pickColor());
  }

  // Verify that the color that was freed was chosen last (N not N-1, because we chose this color twice)
  it("Should have the last color be the one that was freed", function() {
    assert.strictEqual(colors1[freedIndex], colors1[N]);
    assert.strictEqual(colors2[freedIndex], colors2[N]);
  });

  // Do one more to view error
  it("Should return black if there are no more colors", function() {
    assert.strictEqual(p1.pickColor(), "#000000");
    assert.strictEqual(p2.pickColor(), "#000000");
  });

});
