// Alias wrapper to preserve existing imports that expect stateModel2
const stateModel = require('./stateModel.js');

module.exports = stateModel;

if (typeof window !== 'undefined') {
  window.stateModel2 = stateModel;
}
