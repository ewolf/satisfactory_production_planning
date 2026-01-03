// Check which raw resources are missing extraction methods

const RAW_RESOURCES = new Set([
  'Iron Ore', 'Copper Ore', 'Limestone', 'Coal', 'Caterium Ore',
  'Raw Quartz', 'Sulfur', 'Bauxite', 'Uranium', 'Crude Oil',
  'Water', 'Nitrogen Gas', 'Heavy Oil Residue', 'Copper Powder',
  'Pressure Conversion Cube', 'Fabric', 'Alumina Solution'
]);

const RESOURCE_EXTRACTION = {
  'Iron Ore': 'Miner Mk.3',
  'Copper Ore': 'Miner Mk.3',
  'Limestone': 'Miner Mk.3',
  'Coal': 'Miner Mk.3',
  'Caterium Ore': 'Miner Mk.3',
  'Raw Quartz': 'Miner Mk.3',
  'Sulfur': 'Miner Mk.3',
  'Bauxite': 'Miner Mk.3',
  'Uranium': 'Miner Mk.3',
  'Water': 'Water Extractor',
  'Crude Oil': 'Oil Extractor',
  'Nitrogen Gas': 'Resource Well Extractor',
};

const RECIPES = {
  'Alumina Solution': { building: 'Refinery', time: 6, inputs: { 'Bauxite': 12, 'Water': 18 }, output: 12 },
};

console.log('=== Raw Resources Analysis ===\n');
console.log('Raw resources without extraction methods:');

for (const resource of RAW_RESOURCES) {
  if (!RESOURCE_EXTRACTION[resource]) {
    const hasRecipe = RECIPES[resource] ? 'YES (has recipe!)' : 'NO';
    console.log(`  - ${resource} (Recipe: ${hasRecipe})`);
  }
}

console.log('\n=== Nuclear Pasta Dependencies ===');
console.log('Nuclear Pasta requires:');
console.log('  - 200/min Copper Powder (❌ No extraction method, ❌ No recipe)');
console.log('  - 1/min Pressure Conversion Cube (❌ No extraction method, ❌ No recipe)');
console.log('\nThese items are marked as RAW_RESOURCES but have no way to obtain them!');
