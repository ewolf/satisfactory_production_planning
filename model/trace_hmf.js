const gd = require('./gameData.js');

// Find Heavy Modular Frame item index
const hmfIndex = gd.items.findIndex(item => item.name === 'Heavy Modular Frame');
console.log('Heavy Modular Frame index:', hmfIndex);

// Find recipe for HMF
function findStandardRecipeForItem(itemIndex) {
  for (let i = 0; i < gd.recipes.length; i++) {
    const recipe = gd.recipes[i];
    if (!recipe.is_alternative && recipe.outputs.has(itemIndex)) {
      return i;
    }
  }
  return null;
}

console.log('Tracing dependency chain for Heavy Modular Frame:\n');

function traceItem(itemIndex, depth = 0) {
  const indent = '  '.repeat(depth);
  const item = gd.items[itemIndex];

  console.log(indent + item.name, '(idx', itemIndex + ')');

  // Check if primary
  if (gd.primaries.includes(itemIndex)) {
    console.log(indent + '  [PRIMARY - stop here]');
    return;
  }

  // Find recipe
  const recipeIdx = findStandardRecipeForItem(itemIndex);
  if (recipeIdx === null) {
    console.log(indent + '  [NO RECIPE - treat as primary]');
    return;
  }

  const recipe = gd.recipes[recipeIdx];
  console.log(indent + '  Recipe:', recipe.name);
  console.log(indent + '  Inputs:');

  recipe.inputs.forEach((rate, inputIdx) => {
    if (depth < 10) {  // Limit depth to prevent infinite output
      traceItem(inputIdx, depth + 1);
    } else {
      console.log(indent + '    ... (depth limit reached)');
    }
  });
}

traceItem(hmfIndex);
