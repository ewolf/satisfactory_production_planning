/**
 * Tests for the redesigned Satisfactory Production Planner model
 */

const gameData = require('./gameData2.js');
const stateModel = require('./stateModel2.js');

console.log('Running tests for redesigned model...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('✓ PASS:', message);
    testsPassed++;
  } else {
    console.log('✗ FAIL:', message);
    testsFailed++;
  }
}

function assertApprox(actual, expected, tolerance, message) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`✓ PASS: ${message} (${actual.toFixed(2)} ≈ ${expected.toFixed(2)})`);
    testsPassed++;
  } else {
    console.log(`✗ FAIL: ${message} (${actual.toFixed(2)} vs ${expected.toFixed(2)}, diff: ${diff.toFixed(2)})`);
    testsFailed++;
  }
}

// ============================================================================
// Test 1: Game Data Structure
// ============================================================================

console.log('=== Test 1: Game Data Structure ===\n');

assert(gameData.belts.length === 5, 'Should have 5 belt levels');
assert(gameData.pipes.length === 2, 'Should have 2 pipe levels');
assert(gameData.items.length > 0, 'Should have items defined');
assert(gameData.buildings.length > 0, 'Should have buildings defined');
assert(gameData.recipes.length > 0, 'Should have recipes defined');

// Check subset lists
assert(gameData.PowerBuildingList.length > 0, 'Should have power buildings');
assert(gameData.ExtractionBuildingList.length > 0, 'Should have extraction buildings');
assert(gameData.ProductionBuildingList.length > 0, 'Should have production buildings');
assert(gameData.FuelList.length > 0, 'Should have fuels');
assert(gameData.FluidList.length > 0, 'Should have fluids');
assert(gameData.ResourceItemList.length > 0, 'Should have resources');

console.log('');

// ============================================================================
// Test 2: Formula Calculations
// ============================================================================

console.log('=== Test 2: Formula Calculations ===\n');

// Clock rate multiplier at 100% should be 1.0
assertApprox(stateModel.clockRateMultiplier(100), 1.0, 0.001, 'Clock rate multiplier at 100%');

// Clock rate multiplier at 250% should be 2.5
assertApprox(stateModel.clockRateMultiplier(250), 2.5, 0.001, 'Clock rate multiplier at 250%');

// Clock power multiplier at 100% should be 1.0
assertApprox(stateModel.clockPowerMultiplier(100), 1.0, 0.001, 'Clock power multiplier at 100%');

// Clock power multiplier at 250% should be ~3.36 (2.5^1.321928)
assertApprox(stateModel.clockPowerMultiplier(250), 3.36, 0.1, 'Clock power multiplier at 250%');

// Sommersloop item factor with 1 sommersloop should be 1.25
assertApprox(stateModel.sommerloopItemFactor(1), 1.25, 0.001, 'Sommersloop item factor with 1');

// Sommersloop power factor with 1 sommersloop and max 2 should be 2.25 ((1 + 1/2)^2 = 1.5^2)
assertApprox(stateModel.sommerloopPowerFactor(1, 2), 2.25, 0.001, 'Sommersloop power factor (1/2)');

console.log('');

// ============================================================================
// Test 3: Power Grid Calculations
// ============================================================================

console.log('=== Test 3: Power Grid Calculations ===\n');

const grid = stateModel.createPowerGrid('Test Grid');

// Add a biomass burner config
const biomassBurnerIdx = gameData.PowerBuildingList.find(idx => gameData.buildings[idx].name === "Biomass Burner");
const biomassIdx = gameData.items.findIndex(item => item.name === "Biomass");

const config1 = stateModel.createPowerConfig(biomassBurnerIdx, biomassIdx, 100, 2);
grid.powerConfigs.push(config1);

// Set fuel input (6/min biomass available)
grid.fuelInputHash.set(biomassIdx, 12);

// Update calculations
stateModel.updatePowerGridCalculations(grid);

// At 100% clock speed, 2 biomass burners should produce 60 MW (2 * 30)
assertApprox(grid.maxAvgPowerOutput, 60, 0.1, 'Max power output for 2 biomass burners at 100%');

// With enough fuel, current output should equal max
assertApprox(grid.currAvgPowerOutput, 60, 0.1, 'Current power output with sufficient fuel');

// Efficiency should be 100%
assertApprox(grid.efficiency, 100, 0.1, 'Power grid efficiency at 100%');

console.log('');

// ============================================================================
// Test 4: Extraction Config Calculations
// ============================================================================

console.log('=== Test 4: Extraction Config Calculations ===\n');

const line = stateModel.createProductionLine('Test Line');

// Add miner mk.1 on normal iron ore
const minerIdx = gameData.ExtractionBuildingList.find(idx => gameData.buildings[idx].name === "Miner Mk.1");
const ironOreIdx = gameData.items.findIndex(item => item.name === "Iron Ore");

const extractConfig = stateModel.createExtractionConfig(minerIdx, ironOreIdx, 'normal', 100, 1);
line.extractionConfigs.push(extractConfig);

// Update calculations
stateModel.updateProductionLineCalculations(line, gameData.belts[0].flow_rate, gameData.pipes[0].flow_rate);

// Miner Mk.1 at 100% on normal node should produce 60/min
assertApprox(extractConfig.productionRate, 60, 0.1, 'Miner Mk.1 production rate on normal node');

// Power consumption should be 5 MW at 100% (1 miner * 5 MW)
assertApprox(extractConfig.powerConsumption, 5, 0.1, 'Miner Mk.1 power consumption');

console.log('');

// ============================================================================
// Test 5: Production Config Calculations
// ============================================================================

console.log('=== Test 5: Production Config Calculations ===\n');

// Find Iron Ingot recipe
const ironIngotRecipeIdx = gameData.recipes.findIndex(r => r.name === "Iron Ingot");

const prodConfig = stateModel.createProductionConfig(ironIngotRecipeIdx, 100, 0, 1);
line.productionConfigs.push(prodConfig);

// Update calculations
stateModel.updateProductionLineCalculations(line, gameData.belts[0].flow_rate, gameData.pipes[0].flow_rate);

// Should consume 30/min iron ore
const ironOreConsumed = prodConfig.inputs.get(ironOreIdx) || 0;
assertApprox(ironOreConsumed, 30, 0.1, 'Iron Ingot recipe consumes 30/min iron ore');

// Should produce 30/min iron ingot
const ironIngotIdx = gameData.items.findIndex(item => item.name === "Iron Ingot");
const ironIngotProduced = prodConfig.outputs.get(ironIngotIdx) || 0;
assertApprox(ironIngotProduced, 30, 0.1, 'Iron Ingot recipe produces 30/min iron ingot');

// Smelter power consumption at 100% should be 4 MW
assertApprox(prodConfig.powerConsumption, 4, 0.1, 'Smelter power consumption');

console.log('');

// ============================================================================
// Test 6: Production Line Totals
// ============================================================================

console.log('=== Test 6: Production Line Totals ===\n');

// Total power consumption should be extractor + smelter
const expectedPower = extractConfig.powerConsumption + prodConfig.powerConsumption;
assertApprox(line.powerConsumption, expectedPower, 0.1, 'Total power consumption');

// Items produced should include iron ore and iron ingot
const ironOreProduced = line.itemsProduced.get(ironOreIdx) || 0;
assertApprox(ironOreProduced, 60, 0.1, 'Iron ore produced by extractor');

const ironIngotLineProduced = line.itemsProduced.get(ironIngotIdx) || 0;
assertApprox(ironIngotLineProduced, 30, 0.1, 'Iron ingot produced by production');

// Items consumed should include iron ore
const ironOreLineConsumed = line.itemsConsumed.get(ironOreIdx) || 0;
assertApprox(ironOreLineConsumed, 30, 0.1, 'Iron ore consumed by smelter');

console.log('');

// ============================================================================
// Test 7: Sommersloop Effects
// ============================================================================

console.log('=== Test 7: Sommersloop Effects ===\n');

// Create a production config with 1 sommersloop
const line2 = stateModel.createProductionLine('Sommersloop Test');

// Add extraction config to provide iron ore input
const extractConfig2 = stateModel.createExtractionConfig(minerIdx, ironOreIdx, 'normal', 100, 1);
line2.extractionConfigs.push(extractConfig2);

const prodConfigWithSommersloop = stateModel.createProductionConfig(ironIngotRecipeIdx, 100, 1, 1);
line2.productionConfigs.push(prodConfigWithSommersloop);

stateModel.updateProductionLineCalculations(line2, gameData.belts[0].flow_rate, gameData.pipes[0].flow_rate);

// With 1 sommersloop, output should be 30 * 1.25 = 37.5
const ironIngotWithSommersloop = prodConfigWithSommersloop.outputs.get(ironIngotIdx) || 0;
assertApprox(ironIngotWithSommersloop, 37.5, 0.1, 'Iron ingot with 1 sommersloop');

// Power should increase by sommersloop power factor
// Smelter has max 1 sommersloop, so factor is (1 + 1/1)^2 = 4
// Power = 4 * 4 = 16 MW
assertApprox(prodConfigWithSommersloop.powerConsumption, 16, 0.1, 'Smelter power with 1 sommersloop');

console.log('');

// ============================================================================
// Test Results
// ============================================================================

console.log('============================================================');
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ ALL TESTS PASSED');
  process.exit(0);
} else {
  console.log('\n✗ SOME TESTS FAILED');
  process.exit(1);
}
