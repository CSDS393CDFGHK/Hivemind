const UniqueColorPicker = require("../server/UniqueColorPicker.js");

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

// Just print them for now
console.log("Expect N-2 random, different colors for each");
console.log(colors1);
console.log(colors2);
console.log();


// Free the third color for each
p1.freeColor(colors1[2]);
p2.freeColor(colors2[2]);

// We should now be able to generate 4 more colors with no issues (N - 2 - 1) + 3 = N
for (let i = 0; i < numLess + 1; i++) {
    colors1.push(p1.pickColor());
    colors2.push(p2.pickColor());
}

// Verify that the color that was freed was chosen last (N not N-1, because we chose this color twice)
console.log("Expect these colors to be equal")
console.log(colors1[2], colors1[N]);
console.log(colors2[2], colors2[N]);
console.log();


// Do one more to view error
console.log("We ran out of colors, these should be black")
colors1.push(p1.pickColor());
colors2.push(p2.pickColor());

console.log(colors1[N+1]);
console.log(colors1[N+1]);
console.log();


console.log("Here are the final orders, just for viewing")
console.log(colors1);
console.log(colors2);
console.log();
