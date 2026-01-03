// Enhanced script to show input rates for each production configuration

const RECIPES = {
  // Smelter recipes
  'Iron Ingot': { building: 'Smelter', time: 2, inputs: { 'Iron Ore': 1 }, output: 1 },
  'Copper Ingot': { building: 'Smelter', time: 2, inputs: { 'Copper Ore': 1 }, output: 1 },
  'Caterium Ingot': { building: 'Smelter', time: 4, inputs: { 'Caterium Ore': 3 }, output: 1 },

  // Constructor recipes
  'Iron Plate': { building: 'Constructor', time: 6, inputs: { 'Iron Ingot': 3 }, output: 2 },
  'Iron Rod': { building: 'Constructor', time: 4, inputs: { 'Iron Ingot': 1 }, output: 1 },
  'Screw': { building: 'Constructor', time: 6, inputs: { 'Iron Rod': 1 }, output: 4 },
  'Wire': { building: 'Constructor', time: 4, inputs: { 'Copper Ingot': 1 }, output: 2 },
  'Cable': { building: 'Constructor', time: 2, inputs: { 'Wire': 2 }, output: 1 },
  'Concrete': { building: 'Constructor', time: 4, inputs: { 'Limestone': 3 }, output: 1 },
  'Copper Sheet': { building: 'Constructor', time: 6, inputs: { 'Copper Ingot': 2 }, output: 1 },
  'Steel Beam': { building: 'Constructor', time: 4, inputs: { 'Steel Ingot': 4 }, output: 1 },
  'Steel Pipe': { building: 'Constructor', time: 6, inputs: { 'Steel Ingot': 3 }, output: 2 },
  'Quickwire': { building: 'Constructor', time: 5, inputs: { 'Caterium Ingot': 1 }, output: 5 },
  'Quartz Crystal': { building: 'Constructor', time: 8, inputs: { 'Raw Quartz': 5 }, output: 3 },
  'Silica': { building: 'Constructor', time: 8, inputs: { 'Raw Quartz': 3 }, output: 5 },
  'Aluminum Casing': { building: 'Constructor', time: 2, inputs: { 'Aluminum Ingot': 3 }, output: 2 },
  'Empty Canister': { building: 'Constructor', time: 4, inputs: { 'Plastic': 2 }, output: 4 },

  // Foundry recipes
  'Steel Ingot': { building: 'Foundry', time: 4, inputs: { 'Iron Ore': 3, 'Coal': 3 }, output: 3 },
  'Aluminum Ingot': { building: 'Foundry', time: 4, inputs: { 'Aluminum Scrap': 6, 'Silica': 5 }, output: 4 },

  // Assembler recipes
  'Reinforced Iron Plate': { building: 'Assembler', time: 12, inputs: { 'Iron Plate': 6, 'Screw': 12 }, output: 1 },
  'Modular Frame': { building: 'Assembler', time: 60, inputs: { 'Reinforced Iron Plate': 3, 'Iron Rod': 12 }, output: 2 },
  'Rotor': { building: 'Assembler', time: 15, inputs: { 'Iron Rod': 5, 'Screw': 25 }, output: 1 },
  'Stator': { building: 'Assembler', time: 12, inputs: { 'Steel Pipe': 3, 'Wire': 8 }, output: 1 },
  'Motor': { building: 'Assembler', time: 12, inputs: { 'Rotor': 2, 'Stator': 2 }, output: 1 },
  'Circuit Board': { building: 'Assembler', time: 8, inputs: { 'Copper Sheet': 2, 'Plastic': 4 }, output: 1 },
  'AI Limiter': { building: 'Assembler', time: 12, inputs: { 'Copper Sheet': 5, 'Quickwire': 20 }, output: 1 },
  'Encased Industrial Beam': { building: 'Assembler', time: 10, inputs: { 'Steel Beam': 3, 'Concrete': 6 }, output: 1 },
  'Heat Sink': { building: 'Assembler', time: 8, inputs: { 'Alclad Aluminum Sheet': 5, 'Copper Sheet': 3 }, output: 1 },
  'Alclad Aluminum Sheet': { building: 'Assembler', time: 6, inputs: { 'Aluminum Ingot': 3, 'Copper Ingot': 1 }, output: 3 },
  'Electromagnetic Control Rod': { building: 'Assembler', time: 30, inputs: { 'Stator': 3, 'AI Limiter': 2 }, output: 2 },
  'Smart Plating': { building: 'Assembler', time: 30, inputs: { 'Reinforced Iron Plate': 1, 'Rotor': 1 }, output: 1 },
  'Versatile Framework': { building: 'Assembler', time: 24, inputs: { 'Modular Frame': 1, 'Steel Beam': 12 }, output: 2 },
  'Automated Wiring': { building: 'Assembler', time: 24, inputs: { 'Stator': 1, 'Cable': 20 }, output: 1 },
  'Black Powder': { building: 'Assembler', time: 4, inputs: { 'Coal': 1, 'Sulfur': 1 }, output: 2 },

  // Refinery recipes
  'Plastic': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 3 }, output: 2 },
  'Rubber': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 3 }, output: 2 },
  'Fuel': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 6 }, output: 4 },
  'Petroleum Coke': { building: 'Refinery', time: 6, inputs: { 'Heavy Oil Residue': 4 }, output: 12 },
  'Alumina Solution': { building: 'Refinery', time: 6, inputs: { 'Bauxite': 12, 'Water': 18 }, output: 12 },
  'Aluminum Scrap': { building: 'Refinery', time: 1, inputs: { 'Alumina Solution': 4, 'Coal': 2 }, output: 6 },
  'Sulfuric Acid': { building: 'Refinery', time: 6, inputs: { 'Sulfur': 5, 'Water': 5 }, output: 5 },

  // Manufacturer recipes
  'Heavy Modular Frame': { building: 'Manufacturer', time: 30, inputs: { 'Modular Frame': 5, 'Steel Pipe': 15, 'Encased Industrial Beam': 5, 'Screw': 90 }, output: 1 },
  'Computer': { building: 'Manufacturer', time: 24, inputs: { 'Circuit Board': 10, 'Cable': 9, 'Plastic': 18, 'Screw': 52 }, output: 1 },
  'Supercomputer': { building: 'Manufacturer', time: 32, inputs: { 'Computer': 2, 'AI Limiter': 2, 'High-Speed Connector': 3, 'Plastic': 28 }, output: 1 },
  'High-Speed Connector': { building: 'Manufacturer', time: 16, inputs: { 'Quickwire': 56, 'Cable': 10, 'Circuit Board': 1 }, output: 1 },
  'Crystal Oscillator': { building: 'Manufacturer', time: 120, inputs: { 'Quartz Crystal': 36, 'Cable': 28, 'Reinforced Iron Plate': 5 }, output: 2 },
  'Adaptive Control Unit': { building: 'Manufacturer', time: 120, inputs: { 'Automated Wiring': 15, 'Circuit Board': 10, 'Heavy Modular Frame': 2, 'Computer': 2 }, output: 2 },
  'Modular Engine': { building: 'Manufacturer', time: 60, inputs: { 'Motor': 2, 'Rubber': 15, 'Smart Plating': 2 }, output: 1 },
  'Radio Control Unit': { building: 'Manufacturer', time: 48, inputs: { 'Aluminum Casing': 32, 'Crystal Oscillator': 1, 'Computer': 1 }, output: 2 },
  'Turbo Motor': { building: 'Manufacturer', time: 32, inputs: { 'Cooling System': 4, 'Radio Control Unit': 2, 'Motor': 4, 'Rubber': 24 }, output: 1 },
  'Gas Filter': { building: 'Manufacturer', time: 8, inputs: { 'Coal': 5, 'Rubber': 2, 'Fabric': 2 }, output: 1 },

  // Blender recipes
  'Cooling System': { building: 'Blender', time: 10, inputs: { 'Heat Sink': 2, 'Rubber': 2, 'Water': 5, 'Nitrogen Gas': 25 }, output: 1 },
  'Fused Modular Frame': { building: 'Blender', time: 40, inputs: { 'Heavy Modular Frame': 1, 'Aluminum Casing': 50, 'Nitrogen Gas': 25 }, output: 1 },
  'Battery': { building: 'Blender', time: 3, inputs: { 'Sulfuric Acid': 2.5, 'Alumina Solution': 2, 'Aluminum Casing': 1 }, output: 1 },
  'Encased Uranium Cell': { building: 'Blender', time: 12, inputs: { 'Uranium': 10, 'Concrete': 3, 'Sulfuric Acid': 8 }, output: 5 },

  // Particle Accelerator recipes
  'Nuclear Pasta': { building: 'Particle Accelerator', time: 120, inputs: { 'Copper Powder': 200, 'Pressure Conversion Cube': 1 }, output: 1 },
};

const FLUID_ITEMS = new Set([
  'Water', 'Crude Oil', 'Heavy Oil Residue', 'Fuel', 'Turbofuel',
  'Liquid Biofuel', 'Alumina Solution', 'Sulfuric Acid',
  'Nitric Acid', 'Nitrogen Gas', 'Dissolved Silica'
]);

const BELT_TIERS = {
  'Mk.1': 60,
  'Mk.2': 120,
  'Mk.3': 270,
  'Mk.4': 480,
  'Mk.5': 780,
  'Mk.6': 1200
};

const PIPE_TIERS = {
  'Mk.1': 300,
  'Mk.2': 600
};

function getRequiredTier(rate, isFluid) {
  const tiers = isFluid ? PIPE_TIERS : BELT_TIERS;

  for (const [tier, capacity] of Object.entries(tiers)) {
    if (rate <= capacity) {
      return tier;
    }
  }

  return isFluid ? 'EXCEEDS Mk.2 PIPE' : 'EXCEEDS Mk.6 BELT';
}

// Example: Calculate for Heavy Modular Frame at 2/min with Mk.1 belt
const targetItem = process.argv[2] || 'Heavy Modular Frame';
const targetRate = parseFloat(process.argv[3]) || 2;
const selectedBelt = process.argv[4] || 'Mk.1';
const selectedPipe = process.argv[5] || 'Mk.1';

const beltCapacity = BELT_TIERS[selectedBelt];
const pipeCapacity = PIPE_TIERS[selectedPipe];

console.log(`\n${'='.repeat(100)}`);
console.log(`Production Analysis: ${targetItem} @ ${targetRate}/min`);
console.log(`Current Settings: Belt ${selectedBelt} (${beltCapacity}/min) | Pipe ${selectedPipe} (${pipeCapacity} m³/min)`);
console.log(`${'='.repeat(100)}\n`);

// Recursive function to build the full production tree
const RAW_RESOURCES = new Set([
  'Iron Ore', 'Copper Ore', 'Limestone', 'Coal', 'Caterium Ore',
  'Raw Quartz', 'Sulfur', 'Bauxite', 'Uranium', 'Crude Oil',
  'Water', 'Nitrogen Gas', 'Heavy Oil Residue', 'Copper Powder',
  'Pressure Conversion Cube', 'Fabric', 'Alumina Solution'
]);

const itemNeeds = {};

function calculateRequirements(item, rateNeeded) {
  const recipe = RECIPES[item];

  if (!recipe || RAW_RESOURCES.has(item)) {
    return;
  }

  itemNeeds[item] = (itemNeeds[item] || 0) + rateNeeded;

  for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
    const inputPerMinute = (inputAmount / recipe.time) * 60;
    const totalInputNeeded = inputPerMinute * rateNeeded / ((recipe.output / recipe.time) * 60);

    if (!RAW_RESOURCES.has(inputItem)) {
      calculateRequirements(inputItem, totalInputNeeded);
    }
  }
}

calculateRequirements(targetItem, targetRate);

// Now display each prodconf with input rates
const prodconfs = [];
for (const [item, rateNeeded] of Object.entries(itemNeeds)) {
  const recipe = RECIPES[item];
  const baseOutputRate = (recipe.output / recipe.time) * 60;
  const machinesNeeded = rateNeeded / baseOutputRate;

  prodconfs.push({
    item,
    building: recipe.building,
    rate: rateNeeded,
    machinesNeeded,
    recipe
  });
}

// Sort by building type
prodconfs.sort((a, b) => a.building.localeCompare(b.building) || a.item.localeCompare(b.item));

// Display each prodconf
for (const pc of prodconfs) {
  console.log(`┌─ ${pc.building} → ${pc.item}`);
  console.log(`│  Machines: ${pc.machinesNeeded.toFixed(2)} (⌈${Math.ceil(pc.machinesNeeded)}⌉)`);
  console.log(`│  Output: ${pc.rate.toFixed(2)}/min`);
  console.log(`│`);
  console.log(`│  Inputs per machine → total:`);

  const inputs = Object.entries(pc.recipe.inputs);
  for (let i = 0; i < inputs.length; i++) {
    const [inputItem, inputAmount] = inputs[i];
    const isLast = i === inputs.length - 1;
    const prefix = isLast ? '└─' : '├─';

    const inputPerMinute = (inputAmount / pc.recipe.time) * 60;
    const totalInputRate = inputPerMinute * pc.rate / ((pc.recipe.output / pc.recipe.time) * 60);

    const isFluid = FLUID_ITEMS.has(inputItem);
    const capacity = isFluid ? pipeCapacity : beltCapacity;
    const transportType = isFluid ? 'pipe' : 'belt';

    const perMachineCapped = inputPerMinute > capacity;
    const totalCapped = totalInputRate > capacity;

    const requiredTier = getRequiredTier(Math.max(inputPerMinute, totalInputRate), isFluid);

    let status = '';
    if (perMachineCapped) {
      status = ` 🔴 PER-MACHINE CAP (need ${requiredTier})`;
    } else if (totalCapped) {
      status = ` 🟡 TOTAL CAP (need ${requiredTier})`;
    } else {
      status = ` ✓`;
    }

    console.log(`│  ${prefix} ${inputItem}: ${inputPerMinute.toFixed(2)}/min → ${totalInputRate.toFixed(2)}/min${status}`);
  }
  console.log('');
}

console.log(`${'='.repeat(100)}`);
console.log('\nLegend:');
console.log('  ✓ = Within capacity');
console.log('  🟡 TOTAL CAP = Total flow exceeds capacity (split across multiple belts/pipes)');
console.log('  🔴 PER-MACHINE CAP = Single machine exceeds capacity (requires manifold or higher tier)');
console.log(`${'='.repeat(100)}\n`);
