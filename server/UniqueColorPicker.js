/**
 * @fileoverview The UniqueColorPicker helps assign each player in a lobby a unique display color.
 * It has the following requirements:
 * Each player gets a different, unique color
 * When a player leaves the lobby, their color becomes available again.
 * The order at which colors are assinged to players in a lobby should be different every time
 *
 * This is done by shuffling an array of colors, and stepping through it when a player joins.
 */

// Selection of colors available. Always have more than the max number of players allowed in a lobby
const availableColors = [
   "#9E0000",
   "#E38A1E",
   "#0E9931",
   "#379E7A",
   "#49A3C9",
   "#2031C9",
   "#6D07BA",
   "#BF00B3",
   "#DB86B6",
   "#FF2E3C",
   "#410142",
   "#054543",
];

/**
 * @constructor
 * Initializes this color picker with a random list of colors, all of which are available
 */
 function UniqueColorPicker() {
    this.colors = UniqueColorPicker.shuffleColors(availableColors); // Create a random ordering
    this.available = Array(this.colors.length).fill(true); // All colors are available to start with (fill with trues)
    this.currIndex = 0; // Start at the first color
}

/**
 * Picks a unique color by finding the first available free color
 */
UniqueColorPicker.prototype.pickColor = function() {
   let start = this.currIndex;  // Where we started
   let colorIndex = start;  // Where we're currently looking

   // Loop until color is free. The majority of the time, this will be immediatley.
   // Only if a lobby is full, and someone leaves and joins multiple times, will this ever loop around. 
   while (!this.available[colorIndex]) {
      colorIndex = (colorIndex + 1) % this.getNumColors();

      // If we make it back to the start, then nothing was available, return black
      if (colorIndex == start) {
         console.log("Error: No colors available");
         return "#000000";
      }
   }

   // When the while loop ends, we have found our color. Next time, start searching at the next color
   this.available[colorIndex] = false;
   this.currIndex = (colorIndex + 1) % this.getNumColors();
   return this.colors[colorIndex];
}

/**
 * Frees a color to be chosen again, such as when a player leaves
 * @param {String} colors The color of the player who is leaving
 */
UniqueColorPicker.prototype.freeColor = function(color) {
   for (let i = 0; i < this.getNumColors(); i++) {
      if (this.colors[i] == color) {
         this.available[i] = true;
         return;
      }
   }
   // Should never get down here
   console.log("Error: Color " + color + " not found");
}

/**
 * @static
 * Shuffles colors so each new lobby has a unique order to pick from
 * @param {String[]} colors The default colors available to all
 * @return {String[]} A newly shuffled order of the colors
 */
UniqueColorPicker.shuffleColors = function(availableColors) {
   let colors = [...availableColors]; // Copy array to avoid reference issues

   // For every element, swap it with another element
   for (let i = 0; i < colors.length; i++) {
      UniqueColorPicker.swapArrayElements(colors, i, Math.floor(Math.random() * colors.length));
   }

   return colors;
}

/**
 * @static
 * Swaps two elements in an array
 */
UniqueColorPicker.swapArrayElements = function(arr, i, j) {
   let temp = arr[i];
   arr[i] = arr[j];
   arr[j] = temp;
}

// Getters
UniqueColorPicker.prototype.getNumColors = function() {
   return this.colors.length;
}

module.exports = UniqueColorPicker;
