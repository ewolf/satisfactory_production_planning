/**
 * Test for Smart Plating production with Belt Mk.1 constraints
 * Tests the SatisfactoryCalculator with belt limit constraints per machine
 */

const { SatisfactoryCalculator } = require('./satisfactoryCalculator.js');

// Test helper functions
let testsPassed = 0;
let testsFailed = 0;

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

function assert(condition, message) {
  if (condition) {
    console.log('✓ PASS:', message);
    testsPassed++;
  } else {
    console.log('✗ FAIL:', message);
    testsFailed++;
  }
}

function findProdConfig(configs, building, item) {
  return configs.find(c => c.building === building && c.item === item);
}

console.log('=== Test: Smart Plating Production (4/min with Belt Mk.1) ===\n');
console.log('Belt Mk.1 capacity: 60/min');
console.log('Miner: Mk.1');
console.log('Target: 4/min Smart Plating\n');

// Create calculator
const calculator = new SatisfactoryCalculator();
calculator.setTargetProduction('Smart Plating', 4);
calculator.setBeltTier('Mk.1');
calculator.setMinerTier('Mk.1');
calculator.setResourcePurity('Normal');

// Calculate
const prodConfigs = calculator.calculate();
console.log( prodConfigs );
console.log('--- Production Configurations ---\n');

// Sort by building type and item for consistent output
prodConfigs.sort((a, b) => {
  const order = ['Miner Mk.1', 'Smelter', 'Constructor', 'Assembler'];
  const aOrder = order.indexOf(a.building);
  const bOrder = order.indexOf(b.building);
  if (aOrder !== bOrder) return aOrder - bOrder;
  return a.item.localeCompare(b.item);
});

// Display all configs
prodConfigs.forEach(config => {
  console.log(`${config.building} → ${config.item}:`);
  console.log(`  Count: ${config.count}, Clock: ${config.clockSpeed.toFixed(1)}%`);
  console.log(`  Rate per machine: ${config.ratePerMachine.toFixed(2)}/min`);
  console.log(`  Total rate: ${config.totalRate.toFixed(2)}/min`);
  console.log('');
});

console.log('--- Verification ---\n');

// Test Smart Plating: 2 assemblers at 100% making 4/min total
console.log('Smart Plating:');
const smartPlating = findProdConfig(prodConfigs, 'Assembler', 'Smart Plating');
assert(smartPlating !== undefined, 'Smart Plating config exists');
if (smartPlating) {
  assertApprox(smartPlating.count, 2, 0.01, 'Smart Plating: 2 assemblers');
  assertApprox(smartPlating.clockSpeed, 100, 0.5, 'Smart Plating: 100% clock speed');
  assertApprox(smartPlating.totalRate, 4, 0.01, 'Smart Plating: 4/min total');
  assertApprox(smartPlating.ratePerMachine, 2, 0.01, 'Smart Plating: 2/min per machine');
}
console.log('');

// Test Reinforced Iron Plate: 1 assembler at 80% making 4/min
console.log('Reinforced Iron Plate:');
const reinforcedPlate = findProdConfig(prodConfigs, 'Assembler', 'Reinforced Iron Plate');
assert(reinforcedPlate !== undefined, 'Reinforced Iron Plate config exists');
if (reinforcedPlate) {
  assertApprox(reinforcedPlate.count, 1, 0.01, 'Reinforced Iron Plate: 1 assembler');
  assertApprox(reinforcedPlate.clockSpeed, 80, 0.5, 'Reinforced Iron Plate: 80% clock speed');
  assertApprox(reinforcedPlate.totalRate, 4, 0.01, 'Reinforced Iron Plate: 4/min total');
}
console.log('');

// Test Rotor: 2 assemblers at 50% making 2/min each (4/min total)
console.log('Rotor:');
const rotor = findProdConfig(prodConfigs, 'Assembler', 'Rotor');
assert(rotor !== undefined, 'Rotor config exists');
if (rotor) {
  assertApprox(rotor.count, 2, 0.01, 'Rotor: 2 assemblers');
  assertApprox(rotor.clockSpeed, 50, 0.5, 'Rotor: 50% clock speed (belt limited: 100/min screws -> 60/min at 60%)');
  assertApprox(rotor.totalRate, 4, 0.01, 'Rotor: 4/min total');
  assertApprox(rotor.ratePerMachine, 2, 0.01, 'Rotor: 2/min per machine');
}
console.log('');

// Test Iron Plate: 2 constructors at 60% making 12/min each (24/min total)
console.log('Iron Plate:');
const ironPlate = findProdConfig(prodConfigs, 'Constructor', 'Iron Plate');
assert(ironPlate !== undefined, 'Iron Plate config exists');
if (ironPlate) {
  assertApprox(ironPlate.count, 2, 0.01, 'Iron Plate: 2 constructors');
  assertApprox(ironPlate.clockSpeed, 60, 0.5, 'Iron Plate: 60% clock speed');
  assertApprox(ironPlate.totalRate, 24, 0.5, 'Iron Plate: 24/min total');
  assertApprox(ironPlate.ratePerMachine, 12, 0.5, 'Iron Plate: 12/min per machine');
}
console.log('');

// Test Iron Rod: 4 constructors at 95% making 14.25/min each (57/min total)
console.log('Iron Rod:');
const ironRod = findProdConfig(prodConfigs, 'Constructor', 'Iron Rod');
assert(ironRod !== undefined, 'Iron Rod config exists');
if (ironRod) {
  assertApprox(ironRod.count, 4, 0.01, 'Iron Rod: 4 constructors');
  assertApprox(ironRod.clockSpeed, 95, 0.5, 'Iron Rod: 95% clock speed');
  assertApprox(ironRod.totalRate, 57, 1, 'Iron Rod: 57/min total');
  assertApprox(ironRod.ratePerMachine, 14.25, 0.5, 'Iron Rod: 14.25/min per machine');
}
console.log('');

// Test Screw: 4 constructors at 92.5% making 37/min each (148/min total)
console.log('Screw:');
const screw = findProdConfig(prodConfigs, 'Constructor', 'Screw');
assert(screw !== undefined, 'Screw config exists');
if (screw) {
  assertApprox(screw.count, 4, 0.01, 'Screw: 4 constructors');
  assertApprox(screw.clockSpeed, 92.5, 0.5, 'Screw: 92.5% clock speed');
  assertApprox(screw.totalRate, 148, 1, 'Screw: 148/min total');
  assertApprox(screw.ratePerMachine, 37, 1, 'Screw: 37/min per machine');
}
console.log('');

// Test Iron Ingot: 4 smelters at 77.5% making 23.25/min each (93/min total)
console.log('Iron Ingot:');
const ironIngot = findProdConfig(prodConfigs, 'Smelter', 'Iron Ingot');
assert(ironIngot !== undefined, 'Iron Ingot config exists');
if (ironIngot) {
  assertApprox(ironIngot.count, 4, 0.01, 'Iron Ingot: 4 smelters');
  assertApprox(ironIngot.clockSpeed, 77.5, 0.5, 'Iron Ingot: 77.5% clock speed');
  assertApprox(ironIngot.totalRate, 93, 1, 'Iron Ingot: 93/min total');
  assertApprox(ironIngot.ratePerMachine, 23.25, 0.5, 'Iron Ingot: 23.25/min per machine');
}
console.log('');

// Test Iron Ore: 2 miners Mk.1 at 77.5% providing 46.5/min each (93/min total)
console.log('Iron Ore:');
const ironOre = findProdConfig(prodConfigs, 'Miner Mk.1', 'Iron Ore');
assert(ironOre !== undefined, 'Iron Ore config exists');
if (ironOre) {
  assertApprox(ironOre.count, 2, 0.01, 'Iron Ore: 2 miners');
  assertApprox(ironOre.clockSpeed, 77.5, 0.5, 'Iron Ore: 77.5% clock speed');
  assertApprox(ironOre.totalRate, 93, 1, 'Iron Ore: 93/min total');
  assertApprox(ironOre.ratePerMachine, 46.5, 0.5, 'Iron Ore: 46.5/min per machine');
}
console.log('');

// Test Results
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
