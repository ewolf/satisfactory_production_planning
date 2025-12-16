const gd = require('./gameData.js');

console.log('Verifying Aluminum Scrap recipe:\n');

const r = gd.recipes.find(x => x.name === 'Aluminum Scrap' && !x.is_alternative);
console.log('Inputs:');
r.inputs.forEach((rate, idx) => {
  console.log(' ', gd.items[idx].name, '(idx', idx + '):', rate);
});
console.log('Outputs:');
r.outputs.forEach((rate, idx) => {
  console.log(' ', gd.items[idx].name, '(idx', idx + '):', rate);
});
