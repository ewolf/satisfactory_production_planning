const stateModel2 = require('./model/stateModel2.js');
const gameData2 = require('./model/gameData2.js');

console.log('=== Test Circuit Board Production ===\n');

const maxBeltRate = gameData2.belts[0].flow_rate;
const maxPipeRate = gameData2.pipes[0].flow_rate;

// Find circuit board recipe
const circuitBoardRecipeIdx = gameData2.StandardRecipeList.find(idx =>
    gameData2.recipes[idx].name === 'Circuit Board'
);

if (!circuitBoardRecipeIdx && circuitBoardRecipeIdx !== 0) {
    console.log('ERROR: Circuit Board recipe not found!');
    process.exit(1);
}

const recipe = gameData2.recipes[circuitBoardRecipeIdx];
console.log('Circuit Board Recipe:', recipe.name);
console.log('Inputs:', Array.from(recipe.inputHash.entries()).map(([idx, rate]) =>
    `${gameData2.items[idx].name}: ${rate}/min`
).join(', '));
console.log('Outputs:', Array.from(recipe.outputHash.entries()).map(([idx, rate]) =>
    `${gameData2.items[idx].name}: ${rate}/min`
).join(', '));
console.log('');

// Test 1: Circuit board config without inputs
console.log('Test 1: Circuit board config WITHOUT required inputs');
console.log('-----------------------------------------------');

const line1 = stateModel2.createProductionLine('Circuit Board Line');
line1.isEnabled = true;
line1.isOn = true;  // Assume has power

const circuitBoardIdx = gameData2.items.findIndex(item => item.name === 'Circuit Board');
line1.productionGoals.set(circuitBoardIdx, 12);  // Goal: 12/min circuit boards

const prodConfig1 = stateModel2.createProductionConfig(circuitBoardRecipeIdx, 100, 0, 1);
line1.productionConfigs.push(prodConfig1);

stateModel2.updateProductionLineCalculations(line1, maxBeltRate, maxPipeRate);

console.log('Production goals: 12/min circuit boards');
console.log('Circuit boards produced:', (line1.itemsProduced.get(circuitBoardIdx) || 0).toFixed(2), '/min');
console.log('Expected: 0/min (no inputs available)');
console.log('Shortfalls:', Array.from(line1.itemShortfalls.entries()).map(([idx, rate]) =>
    `${gameData2.items[idx].name}: ${rate.toFixed(2)}/min`
).join(', '));
console.log('');

// Test 2: Circuit board config WITH inputs
console.log('Test 2: Circuit board config WITH required inputs');
console.log('-----------------------------------------------');

const line2 = stateModel2.createProductionLine('Circuit Board Line with Inputs');
line2.isEnabled = true;
line2.isOn = true;

line2.productionGoals.set(circuitBoardIdx, 12);

// Find the input items for circuit board
const copperIngotIdx = gameData2.items.findIndex(item => item.name === 'Copper Ingot');
const plasticIdx = gameData2.items.findIndex(item => item.name === 'Plastic');

// Provide inputs via imports (simulating they come from another line)
const copperIngotsNeeded = recipe.inputHash.get(copperIngotIdx) || 0;
const plasticNeeded = recipe.inputHash.get(plasticIdx) || 0;

line2.itemsImported.set(copperIngotIdx, copperIngotsNeeded);
line2.itemsImported.set(plasticIdx, plasticNeeded);

const prodConfig2 = stateModel2.createProductionConfig(circuitBoardRecipeIdx, 100, 0, 1);
line2.productionConfigs.push(prodConfig2);

stateModel2.updateProductionLineCalculations(line2, maxBeltRate, maxPipeRate);

console.log('Production goals: 12/min circuit boards');
console.log('Copper ingots imported:', copperIngotsNeeded, '/min');
console.log('Plastic imported:', plasticNeeded, '/min');
console.log('Circuit boards produced:', (line2.itemsProduced.get(circuitBoardIdx) || 0).toFixed(2), '/min');
console.log('Expected:', recipe.outputHash.get(circuitBoardIdx) || 0, '/min');
console.log('Shortfalls:', line2.itemShortfalls.size === 0 ? 'NONE' :
    Array.from(line2.itemShortfalls.entries()).map(([idx, rate]) =>
        `${gameData2.items[idx].name}: ${rate.toFixed(2)}/min`
    ).join(', '));
console.log('');

console.log('✓ Tests completed');
