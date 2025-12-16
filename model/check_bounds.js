const gd = require('./gameData.js');

console.log('Total items:', gd.items.length);
console.log('Checking for out-of-bounds indices in recipes:\n');

gd.recipes.forEach((recipe, recipeIdx) => {
  recipe.inputs.forEach((rate, itemIdx) => {
    if (itemIdx >= gd.items.length || itemIdx < 0) {
      console.log('ERROR in recipe', recipeIdx, '(', recipe.name, '): Input index', itemIdx, 'is out of bounds!');
    }
  });

  recipe.outputs.forEach((rate, itemIdx) => {
    if (itemIdx >= gd.items.length || itemIdx < 0) {
      console.log('ERROR in recipe', recipeIdx, '(', recipe.name, '): Output index', itemIdx, 'is out of bounds!');
    }
  });
});

console.log('Done checking bounds.');
