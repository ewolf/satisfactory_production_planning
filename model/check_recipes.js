const gd = require('./gameData.js');

const recipesToCheck = ['Heavy Modular Frame', 'Modular Frame', 'Encased Industrial Beam', 'Steel Pipe', 'Screw', 'Reinforced Iron Plate', 'Iron Plate', 'Steel Beam', 'Concrete'];

console.log('Checking all recipes in the dependency chain:\n');

recipesToCheck.forEach(name => {
  const r = gd.recipes.find(x => x.name === name && !x.is_alternative);
  console.log(name + ' recipe:');
  if (r) {
    console.log('  Inputs:');
    r.inputs.forEach((rate, idx) => {
      const item = gd.items[idx];
      console.log('    ', item.name, '(idx', idx, '):', rate, item.is_ore ? '[ORE]' : '');
    });
    console.log('  Outputs:');
    r.outputs.forEach((rate, idx) => {
      console.log('    ', gd.items[idx].name, '(idx', idx, '):', rate);
    });
  } else {
    console.log('  NOT FOUND');
  }
  console.log('');
});
