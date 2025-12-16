const stateModel2 = require('./model/stateModel2.js');
const gameData2 = require('./model/gameData2.js');

console.log('=== Test Production Shortfalls ===\n');

const maxBeltRate = gameData2.belts[0].flow_rate;
const maxPipeRate = gameData2.pipes[0].flow_rate;

// Test 1: Production config with insufficient inputs
console.log('Test 1: Production without sufficient inputs');
console.log('----------------------------------------');

const line1 = stateModel2.createProductionLine('Insufficient Inputs');

// Add iron smelter that needs 30/min iron ore, but don't provide it
const ironIngotRecipeIdx = gameData2.StandardRecipeList.find(idx =>
    gameData2.recipes[idx].name === 'Iron Ingot'
);
const prodConfig1 = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line1.productionConfigs.push(prodConfig1);

stateModel2.updateProductionLineCalculations(line1, maxBeltRate, maxPipeRate);

console.log('No extraction configs provided');
console.log('Smelter needs 30/min iron ore');
console.log('Available: 0/min');
console.log('Shortfalls:', Array.from(line1.itemShortfalls.entries()).map(([idx, rate]) =>
    `${gameData2.items[idx].name}: ${rate.toFixed(2)}/min`
).join(', '));
console.log('Production outputs:', prodConfig1.outputs.size === 0 ? 'ZERO (correct)' : 'ERROR - should be zero');
console.log('');

// Test 2: Production config with sufficient inputs
console.log('Test 2: Production with sufficient inputs');
console.log('----------------------------------------');

const line2 = stateModel2.createProductionLine('Sufficient Inputs');

// Add miner producing 60/min iron ore
const minerIdx = gameData2.ExtractionBuildingList.find(idx =>
    gameData2.buildings[idx].name === 'Miner Mk.1'
);
const ironOreIdx = gameData2.items.findIndex(item => item.name === 'Iron Ore');
const extractConfig = stateModel2.createExtractionConfig(minerIdx, ironOreIdx, 'normal', 100, 1);
line2.extractionConfigs.push(extractConfig);

// Add smelter needing 30/min
const prodConfig2 = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line2.productionConfigs.push(prodConfig2);

stateModel2.updateProductionLineCalculations(line2, maxBeltRate, maxPipeRate);

console.log('Miner produces 60/min iron ore');
console.log('Smelter needs 30/min iron ore');
console.log('Shortfalls:', line2.itemShortfalls.size === 0 ? 'NONE (correct)' : 'ERROR - should have none');
const ironIngotIdx = gameData2.items.findIndex(item => item.name === 'Iron Ingot');
const ironIngotProduced = prodConfig2.outputs.get(ironIngotIdx) || 0;
console.log('Iron ingot produced:', ironIngotProduced.toFixed(2), '/min (expected: 30)');
console.log('');

// Test 3: Two production configs, first one works, second one has insufficient inputs
console.log('Test 3: Chained production with insufficient inputs');
console.log('----------------------------------------');

const line3 = stateModel2.createProductionLine('Chained Insufficient');

// Add miner producing 60/min iron ore
const extractConfig3 = stateModel2.createExtractionConfig(minerIdx, ironOreIdx, 'normal', 100, 1);
line3.extractionConfigs.push(extractConfig3);

// Add smelter that consumes all iron ore (30/min) and produces 30/min iron ingot
const prodConfig3a = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line3.productionConfigs.push(prodConfig3a);

// Add iron plate maker that needs 30/min iron ingot - this should work
const ironPlateRecipeIdx = gameData2.StandardRecipeList.find(idx =>
    gameData2.recipes[idx].name === 'Iron Plate'
);
const prodConfig3b = stateModel2.createProductionConfig(ironPlateRecipeIdx, 100, 0, 1);
line3.productionConfigs.push(prodConfig3b);

stateModel2.updateProductionLineCalculations(line3, maxBeltRate, maxPipeRate);

console.log('Miner produces 60/min iron ore');
console.log('Smelter consumes 30/min iron ore, produces 30/min iron ingot');
console.log('Constructor needs 30/min iron ingot for iron plates');
console.log('Shortfalls:', line3.itemShortfalls.size === 0 ? 'NONE (correct)' : 'ERROR');
const ironPlateIdx = gameData2.items.findIndex(item => item.name === 'Iron Plate');
const ironPlateProduced = prodConfig3b.outputs.get(ironPlateIdx) || 0;
console.log('Iron plate produced:', ironPlateProduced.toFixed(2), '/min (expected: 20)');
console.log('');

// Test 4: Two production configs competing for same resource
console.log('Test 4: Two configs competing for same input');
console.log('----------------------------------------');

const line4 = stateModel2.createProductionLine('Competing');

// Add miner producing 60/min iron ore
const extractConfig4 = stateModel2.createExtractionConfig(minerIdx, ironOreIdx, 'normal', 100, 1);
line4.extractionConfigs.push(extractConfig4);

// Add TWO smelters that each need 30/min (total 60/min needed)
const prodConfig4a = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line4.productionConfigs.push(prodConfig4a);

const prodConfig4b = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line4.productionConfigs.push(prodConfig4b);

stateModel2.updateProductionLineCalculations(line4, maxBeltRate, maxPipeRate);

console.log('Miner produces 60/min iron ore');
console.log('Smelter 1 needs 30/min iron ore');
console.log('Smelter 2 needs 30/min iron ore');
console.log('Total needed: 60/min, Available: 60/min');
console.log('Shortfalls:', line4.itemShortfalls.size === 0 ? 'NONE (correct)' : 'ERROR');
const smelter1Output = prodConfig4a.outputs.get(ironIngotIdx) || 0;
const smelter2Output = prodConfig4b.outputs.get(ironIngotIdx) || 0;
console.log('Smelter 1 output:', smelter1Output.toFixed(2), '/min (expected: 30)');
console.log('Smelter 2 output:', smelter2Output.toFixed(2), '/min (expected: 30)');
console.log('');

// Test 5: Two smelters but insufficient ore
console.log('Test 5: Two smelters, insufficient ore');
console.log('----------------------------------------');

const line5 = stateModel2.createProductionLine('Insufficient for both');

// Add miner producing 60/min, but 3 smelters need 90/min total
const extractConfig5 = stateModel2.createExtractionConfig(minerIdx, ironOreIdx, 'normal', 100, 1);
line5.extractionConfigs.push(extractConfig5);

const prodConfig5a = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line5.productionConfigs.push(prodConfig5a);

const prodConfig5b = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line5.productionConfigs.push(prodConfig5b);

const prodConfig5c = stateModel2.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line5.productionConfigs.push(prodConfig5c);

stateModel2.updateProductionLineCalculations(line5, maxBeltRate, maxPipeRate);

console.log('Miner produces 60/min iron ore');
console.log('Three smelters each need 30/min iron ore (90/min total)');
console.log('Shortfalls:', Array.from(line5.itemShortfalls.entries()).map(([idx, rate]) =>
    `${gameData2.items[idx].name}: ${rate.toFixed(2)}/min`
).join(', '));
const s1 = prodConfig5a.outputs.get(ironIngotIdx) || 0;
const s2 = prodConfig5b.outputs.get(ironIngotIdx) || 0;
const s3 = prodConfig5c.outputs.get(ironIngotIdx) || 0;
console.log('Smelter 1 output:', s1.toFixed(2), '/min (expected: 30, first come first served)');
console.log('Smelter 2 output:', s2.toFixed(2), '/min (expected: 30)');
console.log('Smelter 3 output:', s3.toFixed(2), '/min (expected: 0, insufficient ore)');
console.log('');

console.log('✓ All shortfall tests completed');
