// Test for Nuclear Pasta production calculation

const RECIPES = {
  'Nuclear Pasta': {
    building: 'Particle Accelerator',
    time: 120,
    inputs: { 'Copper Powder': 200, 'Pressure Conversion Cube': 1 },
    output: 1
  },
};

const BUILDINGS = {
  'Particle Accelerator': { power: 500 }
};

const RAW_RESOURCES = new Set([
  'Copper Powder',
  'Pressure Conversion Cube'
]);

function calculateNuclearPasta(targetRate) {
  const recipe = RECIPES['Nuclear Pasta'];
  const buildingName = recipe.building;

  // Calculate base items per minute at 100%
  const baseItemsPerMinute = (recipe.output / recipe.time) * 60;
  console.log(`Base production rate: ${baseItemsPerMinute}/min at 100% clock`);

  // Calculate exact buildings needed
  const exactBuildingsNeeded = targetRate / baseItemsPerMinute;
  const buildingsNeeded = Math.ceil(exactBuildingsNeeded);

  console.log(`\nTarget: ${targetRate} Nuclear Pasta/min`);
  console.log(`Exact buildings needed: ${exactBuildingsNeeded}`);
  console.log(`Buildings (rounded up): ${buildingsNeeded}`);

  // Calculate the clock speed needed for exact production
  const finalClock = (targetRate / (buildingsNeeded * baseItemsPerMinute)) * 100;
  console.log(`Clock speed: ${finalClock.toFixed(1)}%`);

  // Calculate resource requirements
  console.log(`\nRaw Resource Requirements:`);
  for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
    const inputPerMinute = (inputAmount / recipe.time) * 60;
    const totalInputNeeded = inputPerMinute * targetRate / baseItemsPerMinute;
    console.log(`  ${inputItem}: ${totalInputNeeded.toFixed(2)}/min`);
  }

  // Calculate power
  const basePower = BUILDINGS[buildingName].power;
  let totalPower;

  if (finalClock < 100) {
    // Underclocked
    const clockSpeed = finalClock / 100;
    const actualPower = basePower * Math.pow(clockSpeed, 1.321928);
    totalPower = actualPower * buildingsNeeded;
  } else {
    totalPower = basePower * buildingsNeeded;
  }

  console.log(`\nPower Required: ${totalPower.toFixed(2)} MW`);
  console.log(`  (${buildingsNeeded} x ${buildingName} @ ${basePower} MW base)`);

  return {
    buildings: buildingsNeeded,
    clockSpeed: finalClock,
    power: totalPower
  };
}

console.log('=== Nuclear Pasta Production Test ===\n');
calculateNuclearPasta(1);
