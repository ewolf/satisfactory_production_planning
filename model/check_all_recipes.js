const gd = require('./gameData.js');

console.log('Checking all recipes for suspicious index usage:\n');

// Biomass fuels that shouldn't normally be recipe inputs/outputs
const biomassFuels = [10, 11, 12, 13, 14]; // Leaves, Wood, Biomass, Solid Biofuel, Packaged Liquid Biofuel

let issuesFound = 0;

gd.recipes.forEach((recipe, recipeIdx) => {
  let hasIssue = false;
  let issues = [];

  // Check inputs
  recipe.inputs.forEach((rate, itemIdx) => {
    if (biomassFuels.includes(itemIdx)) {
      issues.push(`  Input uses biomass fuel: ${gd.items[itemIdx].name} (idx ${itemIdx})`);
      hasIssue = true;
    }
  });

  // Check outputs for biomass fuels (except recipes that actually produce them)
  recipe.outputs.forEach((rate, itemIdx) => {
    if (biomassFuels.includes(itemIdx) && !recipe.name.includes('Biomass') && !recipe.name.includes('Biofuel')) {
      issues.push(`  Output uses biomass fuel: ${gd.items[itemIdx].name} (idx ${itemIdx})`);
      hasIssue = true;
    }
  });

  if (hasIssue) {
    console.log(`Recipe ${recipeIdx}: ${recipe.name}`);
    issues.forEach(issue => console.log(issue));
    console.log('');
    issuesFound++;
  }
});

console.log(`Total recipes with issues: ${issuesFound}`);
