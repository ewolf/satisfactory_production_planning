// Alias module to keep compatibility with legacy requires that expect gameData2
const gameData = require('./gameData.js');

// Export for Node.js
module.exports = gameData;

// Also attach to browser global for scripts that look for window.gameData2
if (typeof window !== 'undefined') {
  window.gameData2 = gameData;
}
