const gd = require('./gameData.js');

console.log('Checking for recipes that produce their own inputs:\n');

gd.recipes.forEach((recipe, idx) => {
  const inputIndices = Array.from(recipe.inputs.keys());
  const outputIndices = Array.from(recipe.outputs.keys());

  const overlap = inputIndices.filter(i => outputIndices.includes(i));

  if (overlap.length > 0) {
    console.log('CIRCULAR DEPENDENCY FOUND in recipe', idx, ':', recipe.name);
    console.log('  Items that are both input and output:');
    overlap.forEach(itemIdx => {
      console.log('    ', gd.items[itemIdx].name, '(idx', itemIdx, ')');
    });
    console.log('');
  }
});

console.log('Done checking for direct circular dependencies.');
