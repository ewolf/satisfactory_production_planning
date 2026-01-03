const { useState, useEffect } = React;

// Building power consumption data
const BUILDINGS = {
  'Smelter': { power: 4 },
  'Constructor': { power: 4 },
  'Foundry': { power: 16 },
  'Assembler': { power: 15 },
  'Refinery': { power: 30 },
  'Manufacturer': { power: 55 },
  'Blender': { power: 75 },
  'Particle Accelerator': { power: 500 },
  'Miner Mk.1': { power: 5 },
  'Miner Mk.2': { power: 12 },
  'Miner Mk.3': { power: 30 },
  'Water Extractor': { power: 20 },
  'Oil Extractor': { power: 40 },
  'Resource Well Extractor': { power: 0 },
};

// Miner rates (per minute at 100% clock speed)
const MINER_TIERS = {
  'Mk.1': { base: 60, power: 5 },
  'Mk.2': { base: 120, power: 12 },
  'Mk.3': { base: 240, power: 30 }
};

const MINER_RATES = {
  'Miner Mk.1': { base: 60, purityMultipliers: { 'Impure': 0.5, 'Normal': 1.0, 'Pure': 2.0 } },
  'Miner Mk.2': { base: 120, purityMultipliers: { 'Impure': 0.5, 'Normal': 1.0, 'Pure': 2.0 } },
  'Miner Mk.3': { base: 240, purityMultipliers: { 'Impure': 0.5, 'Normal': 1.0, 'Pure': 2.0 } }
};

// Extractor rates (per minute)
const EXTRACTOR_RATES = {
  'Water Extractor': 120,
  'Oil Extractor': { base: 120, purityMultipliers: { 'Impure': 0.5, 'Normal': 1.0, 'Pure': 2.0 } },
  'Resource Well Extractor': { base: 60, purityMultipliers: { 'Impure': 0.5, 'Normal': 1.0, 'Pure': 2.0 } }
};

// Map resources to their extraction method
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

// Belt and Pipe tiers
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

// All recipes with their production rates
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

// Explicit list of fluid items
const FLUID_ITEMS = new Set([
  'Water', 'Crude Oil', 'Heavy Oil Residue', 'Fuel', 'Turbofuel',
  'Liquid Biofuel', 'Alumina Solution', 'Sulfuric Acid',
  'Nitric Acid', 'Nitrogen Gas', 'Dissolved Silica'
]);

// Raw resources (things that come from miners/extractors)
const RAW_RESOURCES = new Set([
  'Iron Ore', 'Copper Ore', 'Limestone', 'Coal', 'Caterium Ore',
  'Raw Quartz', 'Sulfur', 'Bauxite', 'Uranium', 'Crude Oil',
  'Water', 'Nitrogen Gas', 'Heavy Oil Residue', 'Copper Powder',
  'Pressure Conversion Cube', 'Fabric', 'Alumina Solution'
]);

// Helper function to calculate clock speed from shard count
const getClockSpeed = (shards) => {
  return 100 + (shards * 50); // 0=100%, 1=150%, 2=200%, 3=250%
};

function SatisfactoryCalculator() {
  const [targetItems, setTargetItems] = useState([
    { item: 'Heavy Modular Frame', rate: 2 }
  ]);
  const [resourcePurities, setResourcePurities] = useState({});
  const [powerShards, setPowerShards] = useState({});
  const [selectedBelt, setSelectedBelt] = useState('Mk.1');
  const [selectedPipe, setSelectedPipe] = useState('Mk.1');
  const [selectedMiner, setSelectedMiner] = useState('Mk.1');
  const [results, setResults] = useState(null);

  // Get all items that can be produced (have recipes)
  const producibleItems = Object.keys(RECIPES).filter(item => {
    const recipe = RECIPES[item];
    return ['Assembler', 'Manufacturer', 'Blender', 'Particle Accelerator', 'Refinery'].includes(recipe.building);
  }).sort();

  // Recalculate whenever global settings change
  useEffect(() => {
    if (results) {
      calculateProduction();
    }
  }, [selectedBelt, selectedPipe, selectedMiner]);

  // Helper function to calculate max clock speed based on belt/pipe limits per machine
  const calculateMaxClockSpeed = (recipe, beltCapacity, pipeCapacity) => {
    let maxClock = 100;

    // Check all inputs
    for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
      const inputPerMinute = (inputAmount / recipe.time) * 60;
      const isFluid = FLUID_ITEMS.has(inputItem);
      const capacity = isFluid ? pipeCapacity : beltCapacity;

      if (inputPerMinute > capacity) {
        const clockForInput = (capacity / inputPerMinute) * 100;
        maxClock = Math.min(maxClock, clockForInput);
      }
    }

    // Check output
    const outputPerMinute = (recipe.output / recipe.time) * 60;
    const isOutputFluid = FLUID_ITEMS.has(recipe.output);
    const outputCapacity = isOutputFluid ? pipeCapacity : beltCapacity;

    if (outputPerMinute > outputCapacity) {
      const clockForOutput = (outputCapacity / outputPerMinute) * 100;
      maxClock = Math.min(maxClock, clockForOutput);
    }

    return maxClock;
  };

  const calculateProduction = () => {
    const buildingProduction = {}; // Track building-item pairs with their consumers
    const resourceNeeds = {};
    const beltCapacity = BELT_TIERS[selectedBelt];
    const pipeCapacity = PIPE_TIERS[selectedPipe];
    let itemTotalProduction = {};

    // Helper function to optimize machine count with power shards
    const optimizeWithShards = (exactCount, totalShards, rateNeeded, baseRatePerMachine) => {
      if (totalShards === 0) {
        const intCount = Math.ceil(exactCount);
        const underclocking = (exactCount / intCount) * 100;
        return {
          intCount,
          shardDistribution: null,
          underclocking: underclocking < 100 ? underclocking : null
        };
      }

      // Try starting from 1 machine and work up to find minimum
      const maxMachines = Math.ceil(exactCount);

      for (let machines = 1; machines <= maxMachines; machines++) {
        if (totalShards > machines * 3) continue; // Skip if we have more shards than slots

        // Distribute shards greedily (fill to 3 per machine first)
        const distribution = new Array(machines).fill(0);
        let shardsLeft = totalShards;

        for (let i = 0; i < machines && shardsLeft > 0; i++) {
          const shardsToAdd = Math.min(3, shardsLeft);
          distribution[i] = shardsToAdd;
          shardsLeft -= shardsToAdd;
        }

        // Calculate total production with this distribution
        let totalProduction = 0;
        for (let shards of distribution) {
          const clockSpeed = getClockSpeed(shards);
          totalProduction += (baseRatePerMachine * clockSpeed / 100);
        }

        // If this meets or exceeds required production, use it (it's the minimum)
        if (totalProduction >= rateNeeded) {
          return {
            intCount: machines,
            shardDistribution: distribution,
            underclocking: null
          };
        }
      }

      // Fallback: use original count without shards if optimization fails
      const intCount = Math.ceil(exactCount);
      const underclocking = (exactCount / intCount) * 100;
      return {
        intCount,
        shardDistribution: null,
        underclocking: underclocking < 100 ? underclocking : null
      };
    };

    // Track total item needs (Phase 1)
    const itemNeeds = {};
    const itemConsumers = {};

    // Recursive function to calculate requirements (Phase 1: collect total needs)
    const calculateRequirements = (item, rateNeeded, forItem = null) => {
      const recipe = RECIPES[item];

      if (!recipe) {
        // Raw resource
        resourceNeeds[item] = (resourceNeeds[item] || 0) + rateNeeded;
        return;
      }

      // Add to total needs for this item
      itemNeeds[item] = (itemNeeds[item] || 0) + rateNeeded;

      // Track consumers
      if (forItem) {
        if (!itemConsumers[item]) {
          itemConsumers[item] = [];
        }
        itemConsumers[item].push(forItem);
      }

      // Calculate input requirements (don't apply belt limits yet)
      for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
        const inputPerMinute = (inputAmount / recipe.time) * 60;
        const totalInputNeeded = inputPerMinute * rateNeeded / ((recipe.output / recipe.time) * 60);

        if (RAW_RESOURCES.has(inputItem)) {
          resourceNeeds[inputItem] = (resourceNeeds[inputItem] || 0) + totalInputNeeded;
        } else {
          calculateRequirements(inputItem, totalInputNeeded, item);
        }
      }
    };

    // Calculate requirements for all target items
    targetItems.forEach(target => {
      calculateRequirements(target.item, target.rate, null);
    });

    // Phase 2: Create production configs with belt limits and underclocking
    for (const [item, rateNeeded] of Object.entries(itemNeeds)) {
      const recipe = RECIPES[item];
      const buildingName = recipe.building;

      // Calculate max clock speed based on belt limits per machine
      const maxClock = calculateMaxClockSpeed(recipe, beltCapacity, pipeCapacity);

      // Calculate base items per minute at 100%
      const baseItemsPerMinute = (recipe.output / recipe.time) * 60;

      // Calculate exact buildings needed at max allowable clock
      const itemsPerMinuteAtMaxClock = baseItemsPerMinute * (maxClock / 100);
      const exactBuildingsNeeded = rateNeeded / itemsPerMinuteAtMaxClock;

      // Round up to get integer count
      const buildingsNeeded = Math.ceil(exactBuildingsNeeded);

      // Calculate the clock speed needed for exact production with integer machines
      const finalClock = (rateNeeded / (buildingsNeeded * baseItemsPerMinute)) * 100;

      const key = `${buildingName}|${item}`;
      buildingProduction[key] = {
        building: buildingName,
        item: item,
        count: buildingsNeeded,
        rate: rateNeeded,
        clockSpeed: finalClock,
        consumers: itemConsumers[item] || []
      };
    }

    // Add miners and extractors for raw resources
    for (const [resource, rateNeeded] of Object.entries(resourceNeeds)) {
      const baseExtractionMethod = RESOURCE_EXTRACTION[resource];

      if (!baseExtractionMethod) continue;

      // Use selected miner tier for miners
      let extractionMethod = baseExtractionMethod;
      if (baseExtractionMethod.startsWith('Miner')) {
        extractionMethod = `Miner ${selectedMiner}`;
      }

      // Get purity for this resource, default to Normal
      const purity = resourcePurities[resource] || 'Normal';

      let ratePerBuilding;

      if (extractionMethod === 'Water Extractor') {
        ratePerBuilding = EXTRACTOR_RATES['Water Extractor'];
      } else if (MINER_RATES[extractionMethod]) {
        const minerData = MINER_RATES[extractionMethod];
        ratePerBuilding = minerData.base * minerData.purityMultipliers[purity];
      } else if (EXTRACTOR_RATES[extractionMethod]) {
        const extractorData = EXTRACTOR_RATES[extractionMethod];
        ratePerBuilding = extractorData.base * extractorData.purityMultipliers[purity];
      }

      if (ratePerBuilding) {
        const exactBuildingsNeeded = rateNeeded / ratePerBuilding;
        const buildingsNeeded = Math.ceil(exactBuildingsNeeded);
        const clockSpeed = (exactBuildingsNeeded / buildingsNeeded) * 100;

        const key = `${extractionMethod}|${resource}`;
        buildingProduction[key] = {
          building: extractionMethod,
          item: resource,
          count: buildingsNeeded,
          rate: rateNeeded,
          clockSpeed: clockSpeed,
          purity: purity,
          consumers: []
        };
      }
    }

    // Create final production configs (no splitting needed since we handle belt limits per machine)
    const finalProdconfs = [];
    let prodconfId = 0;

    for (const [key, data] of Object.entries(buildingProduction)) {
      finalProdconfs.push({
        id: prodconfId++,
        building: data.building,
        item: data.item,
        count: data.count,
        rate: data.rate,
        clockSpeed: data.clockSpeed,
        purity: data.purity,
        consumers: data.consumers,
        isCapped: false
      });
    }

    // Create set of target items for later use
    const targetItemSet = new Set(targetItems.map(t => t.item));

    // Recalculate total production
    itemTotalProduction = {};
    finalProdconfs.forEach(entry => {
      itemTotalProduction[entry.item] = (itemTotalProduction[entry.item] || 0) + entry.rate;
    });

    // Recalculate raw resource needs based on actual production
    const actualResourceNeeds = {};

    finalProdconfs.forEach(entry => {
      const recipe = RECIPES[entry.item];
      if (!recipe) return;

      // Calculate actual input consumption based on actual production rate
      for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
        const inputPerMinute = (inputAmount / recipe.time) * 60;
        const actualInputNeeded = inputPerMinute * (entry.rate / ((recipe.output / recipe.time) * 60));

        if (RAW_RESOURCES.has(inputItem)) {
          actualResourceNeeds[inputItem] = (actualResourceNeeds[inputItem] || 0) + actualInputNeeded;
        }
      }
    });

    // Update raw resource prodconfs to match actual needs
    finalProdconfs.forEach(entry => {
      if (!RESOURCE_EXTRACTION[entry.item]) return;

      const actualNeed = actualResourceNeeds[entry.item] || 0;
      if (actualNeed < entry.rate) {
        entry.rate = actualNeed;

        // Recalculate count for miners/extractors
        let ratePerBuilding;
        if (entry.building === 'Water Extractor') {
          ratePerBuilding = EXTRACTOR_RATES['Water Extractor'];
        } else if (MINER_RATES[entry.building]) {
          const minerData = MINER_RATES[entry.building];
          ratePerBuilding = minerData.base * minerData.purityMultipliers[entry.purity];
        } else if (EXTRACTOR_RATES[entry.building]) {
          const extractorData = EXTRACTOR_RATES[entry.building];
          ratePerBuilding = extractorData.base * extractorData.purityMultipliers[entry.purity];
        }

        if (ratePerBuilding) {
          entry.count = entry.rate / ratePerBuilding;
        }
      }
    });

    // Recalculate total production one final time
    itemTotalProduction = {};
    finalProdconfs.forEach(entry => {
      itemTotalProduction[entry.item] = (itemTotalProduction[entry.item] || 0) + entry.rate;
    });

    // Propagate capacity limits to determine achievable target rates
    const calculationCache = {};

    const propagateCapacityLimits = (item, depth = 0) => {
      // Avoid infinite recursion
      if (depth > 50) return itemTotalProduction[item] || 0;

      if (calculationCache[item] !== undefined) {
        return calculationCache[item];
      }

      const recipe = RECIPES[item];
      if (!recipe) {
        // Raw resource
        const result = itemTotalProduction[item] || Infinity;
        calculationCache[item] = result;
        return result;
      }

      // Find the most limiting input
      let maxProducible = Infinity;

      for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
        const inputPerMinute = (inputAmount / recipe.time) * 60;
        const inputAvailable = propagateCapacityLimits(inputItem, depth + 1);

        // Calculate how much of this item we can make with available input
        const producibleFromThisInput = (inputAvailable / inputPerMinute) * ((recipe.output / recipe.time) * 60);
        maxProducible = Math.min(maxProducible, producibleFromThisInput);
      }

      // Also check the total production of this item
      const totalProduction = itemTotalProduction[item] || 0;
      maxProducible = Math.min(maxProducible, totalProduction);

      const result = maxProducible;
      calculationCache[item] = result;
      return result;
    };

    // Calculate actual achievable rates for all target items
    const targetItemResults = targetItems.map(target => {
      const actualRate = propagateCapacityLimits(target.item);
      return {
        item: target.item,
        requestedRate: target.rate,
        actualRate: Math.min(actualRate, target.rate)
      };
    });

    // Convert to array and calculate integers with underclocking and shards
    const buildingList = finalProdconfs.map(entry => {
      const key = `${entry.building}|${entry.item}|${entry.id}`;
      const totalShards = powerShards[key] || 0;
      const maxShards = Math.ceil(entry.count) * 3;
      const validShards = Math.min(totalShards, maxShards);

      // Calculate base production rate per machine
      let baseRatePerMachine;
      if (entry.purity && MINER_RATES[entry.building]) {
        const minerData = MINER_RATES[entry.building];
        baseRatePerMachine = minerData.base * minerData.purityMultipliers[entry.purity];
      } else if (entry.purity && EXTRACTOR_RATES[entry.building]) {
        const extractorData = EXTRACTOR_RATES[entry.building];
        if (typeof extractorData === 'number') {
          baseRatePerMachine = extractorData;
        } else {
          baseRatePerMachine = extractorData.base * extractorData.purityMultipliers[entry.purity];
        }
      } else {
        // For production buildings, use recipe data
        const recipe = RECIPES[entry.item];
        if (recipe) {
          baseRatePerMachine = (recipe.output / recipe.time) * 60;
        }
      }

      // Optimize machine count with shards based on actual rate
      const optimized = optimizeWithShards(entry.count, validShards, entry.rate, baseRatePerMachine);

      // Check if this item is capacity limited
      const isFluid = FLUID_ITEMS.has(entry.item);
      const isRawResource = RAW_RESOURCES.has(entry.item);
      const capacity = isFluid ? pipeCapacity : beltCapacity;

      return {
        id: entry.id,
        building: entry.building,
        item: entry.item,
        purity: entry.purity,
        consumers: entry.consumers,
        splitIndex: entry.splitIndex,
        totalSplits: entry.totalSplits,
        intCount: optimized.intCount,
        shardDistribution: optimized.shardDistribution,
        underclocking: optimized.underclocking,
        totalShards: validShards,
        requestedRate: entry.requestedRate,
        actualRate: entry.rate,
        isCapped: entry.isCapped || false,
        capacityType: isFluid ? 'pipe' : 'belt',
        isRawResource: isRawResource,
        key: key
      };
    });

    // Calculate total power using integer counts, underclocking, and shards
    // Power scales as: Power = BasePower × (ClockSpeed/100)^1.321928
    let totalPower = 0;
    for (const entry of buildingList) {
      const basePower = BUILDINGS[entry.building].power;

      if (entry.shardDistribution) {
        // Calculate power for each machine based on its shard count
        for (const shards of entry.shardDistribution) {
          const clockSpeed = getClockSpeed(shards);
          const actualPower = basePower * Math.pow(clockSpeed / 100, 1.321928);
          totalPower += actualPower;
        }
      } else if (entry.underclocking) {
        // Underclocked machines without shards
        const clockSpeed = entry.underclocking / 100;
        const actualPower = basePower * Math.pow(clockSpeed, 1.321928);
        totalPower += actualPower * entry.intCount;
      } else {
        // Normal machines at 100% with no shards
        totalPower += basePower * entry.intCount;
      }
    }

    setResults({
      buildings: buildingList,
      resources: actualResourceNeeds,
      power: totalPower,
      targetItemResults: targetItemResults
    });
  };

  const handlePurityChange = (resource, newPurity) => {
    setResourcePurities(prev => ({
      ...prev,
      [resource]: newPurity
    }));
    // Recalculate with new purity
    setTimeout(() => calculateProduction(), 0);
  };

  const handleShardChange = (key, shards) => {
    setPowerShards(prev => ({
      ...prev,
      [key]: parseInt(shards) || 0
    }));
    // Recalculate with new shards
    setTimeout(() => calculateProduction(), 0);
  };

  const handleTargetRateChange = (index, value) => {
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0) {
      setTargetItems(prev => {
        const newItems = [...prev];
        newItems[index] = { ...newItems[index], rate: 0 };
        return newItems;
      });
    } else {
      setTargetItems(prev => {
        const newItems = [...prev];
        newItems[index] = { ...newItems[index], rate };
        return newItems;
      });
    }
  };

  const handleTargetItemChange = (index, item) => {
    setTargetItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], item };
      return newItems;
    });
  };

  const addTargetItem = () => {
    setTargetItems(prev => [...prev, { item: producibleItems[0], rate: 1 }]);
  };

  const removeTargetItem = (index) => {
    if (targetItems.length > 1) {
      setTargetItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-yellow-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 border-4 border-orange-600">
          <h1 className="text-4xl font-bold text-orange-400 mb-2 text-center">
            Satisfactory Production Calculator
          </h1>
          <p className="text-gray-400 text-center mb-8">Plan your factory production chains</p>

          {/* Globals Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-orange-700">
            <h2 className="text-xl font-bold text-orange-400 mb-4">Global Settings</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-orange-300 font-semibold mb-2">
                  Conveyor Belt Tier
                </label>
                <select
                  value={selectedBelt}
                  onChange={(e) => setSelectedBelt(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-4 py-3 border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
                >
                  {Object.entries(BELT_TIERS).map(([tier, capacity]) => (
                    <option key={tier} value={tier}>
                      {tier} - {capacity}/min
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-orange-300 font-semibold mb-2">
                  Miner Tier
                </label>
                <select
                  value={selectedMiner}
                  onChange={(e) => setSelectedMiner(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-4 py-3 border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
                >
                  {Object.entries(MINER_TIERS).map(([tier, data]) => (
                    <option key={tier} value={tier}>
                      {tier} - {data.base}/min
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-orange-300 font-semibold mb-2">
                  Pipeline Tier
                </label>
                <select
                  value={selectedPipe}
                  onChange={(e) => setSelectedPipe(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-4 py-3 border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
                >
                  {Object.entries(PIPE_TIERS).map(([tier, capacity]) => (
                    <option key={tier} value={tier}>
                      {tier} - {capacity} m³/min
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border-2 border-orange-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-orange-400">Target Production</h2>
              <button
                onClick={addTargetItem}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {targetItems.map((target, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div>
                    <label className="block text-orange-300 font-semibold mb-2">
                      Item {targetItems.length > 1 ? `#${index + 1}` : ''}
                    </label>
                    <select
                      value={target.item}
                      onChange={(e) => handleTargetItemChange(index, e.target.value)}
                      className="w-full bg-gray-600 text-white rounded px-4 py-3 border-2 border-gray-500 focus:border-orange-500 focus:outline-none"
                    >
                      {producibleItems.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-orange-300 font-semibold mb-2">
                        Production Rate (per minute)
                      </label>
                      <input
                        type="number"
                        value={target.rate}
                        onChange={(e) => handleTargetRateChange(index, e.target.value)}
                        min="0"
                        step="1"
                        className="w-full bg-gray-600 text-white rounded px-4 py-3 border-2 border-gray-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    {targetItems.length > 1 && (
                      <div className="flex items-end">
                        <button
                          onClick={() => removeTargetItem(index)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors duration-200"
                          title="Remove this item"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={calculateProduction}
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Calculate Production Chain
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              {/* Production Rate Summary */}
              {results.targetItemResults.some(t => t.actualRate < t.requestedRate) && (
                <div className="bg-red-900 bg-opacity-50 rounded-lg p-6 border-2 border-red-600">
                  <h2 className="text-2xl font-bold text-red-300 mb-4">
                    ⚠ Production Capacity Limited
                  </h2>
                  {results.targetItemResults.map((target, idx) => {
                    if (target.actualRate < target.requestedRate) {
                      return (
                        <div key={idx} className="mb-3 last:mb-0">
                          <p className="text-white font-semibold">{target.item}</p>
                          <div className="ml-4">
                            <p className="text-white text-sm">
                              Requested: <span className="font-bold">{target.requestedRate.toFixed(2)}/min</span>
                            </p>
                            <p className="text-white text-sm">
                              Achievable: <span className="font-bold">{target.actualRate.toFixed(2)}/min</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                  <p className="text-red-200 text-sm mt-4">
                    Resource supply constraints are preventing full production. Add more resource extraction or reduce target rates.
                  </p>
                </div>
              )}

              {/* Power Summary */}
              <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-6 border-2 border-yellow-600">
                <h2 className="text-2xl font-bold text-yellow-300 mb-2">
                  Total Power Required
                </h2>
                <p className="text-4xl font-bold text-white">
                  {results.power.toFixed(2)} MW
                </p>
              </div>

              {/* Buildings Required */}
              <div className="bg-gray-800 rounded-lg p-6 border-2 border-orange-700">
                <h2 className="text-2xl font-bold text-orange-400 mb-4">
                  Production Configurations
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.buildings
                    .sort((a, b) => a.building.localeCompare(b.building) || a.item.localeCompare(b.item))
                    .map((entry) => {
                      const key = entry.key;
                      const maxShards = entry.intCount * 3;

                      // Calculate total power for this prodconf
                      let totalPower = 0;
                      const basePower = BUILDINGS[entry.building].power;

                      if (entry.shardDistribution) {
                        // Calculate power for each machine with its shards
                        for (const shards of entry.shardDistribution) {
                          const clockSpeed = getClockSpeed(shards);
                          const actualPower = basePower * Math.pow(clockSpeed / 100, 1.321928);
                          totalPower += actualPower;
                        }
                      } else if (entry.underclocking) {
                        const clockSpeed = entry.underclocking / 100;
                        const actualPower = basePower * Math.pow(clockSpeed, 1.321928);
                        totalPower = actualPower * entry.intCount;
                      } else {
                        totalPower = basePower * entry.intCount;
                      }

                      return (
                        <div key={key} className="bg-gray-700 rounded p-4 border border-gray-600">
                          <div className="font-semibold text-orange-300 mb-1">
                            {entry.building} → {entry.item}
                            {entry.totalSplits > 1 && (
                              <span className="text-yellow-400 ml-2">
                                #{entry.splitIndex} of {entry.totalSplits}
                              </span>
                            )}
                          </div>
                          {entry.consumers && entry.consumers.length > 0 && (
                            <div className="text-xs text-gray-400 mb-2">
                              Used by: {entry.consumers.join(', ')}
                            </div>
                          )}

                          {/* Purity selector for miners/extractors */}
                          {entry.purity && (
                            <div className="mb-2">
                              <select
                                value={entry.purity}
                                onChange={(e) => handlePurityChange(entry.item, e.target.value)}
                                className="w-full bg-gray-600 text-white text-sm rounded px-2 py-1 border border-gray-500 focus:border-orange-500 focus:outline-none"
                              >
                                <option value="Impure">Impure</option>
                                <option value="Normal">Normal</option>
                                <option value="Pure">Pure</option>
                              </select>
                            </div>
                          )}

                          {/* Power Shards Input */}
                          <div className="mb-2 flex items-center gap-2">
                            <label className="text-xs text-gray-400 flex-shrink-0">
                              Power Shards (max {maxShards}):
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={maxShards}
                              value={entry.totalShards || 0}
                              onChange={(e) => handleShardChange(key, e.target.value)}
                              className="bg-gray-600 text-white text-sm rounded px-3 py-1 border border-gray-500 focus:border-orange-500 focus:outline-none"
                              style={{ width: `${Math.max(4, maxShards.toString().length + 2)}ch` }}
                            />
                          </div>

                          <div className="flex items-baseline justify-between mb-2">
                            <div className="text-2xl font-bold text-white">
                              {entry.intCount}
                            </div>
                            <div className="text-sm text-gray-400">
                              {entry.inputConstrained && entry.requestedRate ? (
                                <span>
                                  {entry.actualRate.toFixed(2)}/min
                                  <span className="text-red-400 ml-1">
                                    (req: {entry.requestedRate.toFixed(2)})
                                  </span>
                                </span>
                              ) : (
                                <span>{entry.actualRate.toFixed(2)}/min</span>
                              )}
                            </div>
                          </div>

                          {/* Input Constraint Warning */}
                          {entry.inputConstrained && entry.limitingReason === 'supply' && (
                            <div className="text-sm text-red-400 mb-1 bg-red-900 bg-opacity-30 p-1 rounded">
                              ⚠ Input supply limited: {entry.limitingInput} → {entry.actualRate.toFixed(2)}/min
                            </div>
                          )}

                          {/* Overproduction Info */}
                          {entry.overproducing && (
                            <div className="text-sm text-blue-400 mb-1 bg-blue-900 bg-opacity-30 p-1 rounded">
                              ℹ Production reduced to match consumption
                            </div>
                          )}

                          {/* Shard Distribution Display */}
                          {entry.shardDistribution && (
                            <div className="text-sm text-cyan-400 mb-1">
                              Shards: [{entry.shardDistribution.join(',')}]
                            </div>
                          )}

                          {entry.underclocking && !entry.shardDistribution && (
                            <div className="text-sm text-yellow-400 mb-1">
                              Underclocking: {entry.underclocking.toFixed(1)}%
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            Power: {totalPower.toFixed(1)} MW
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Raw Resources */}
              <div className="bg-gray-800 rounded-lg p-6 border-2 border-orange-700">
                <h2 className="text-2xl font-bold text-orange-400 mb-4">
                  Raw Resources Required (per minute)
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(results.resources)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([resource, amount]) => (
                      <div key={resource} className="bg-gray-700 rounded p-4 border border-gray-600">
                        <div className="font-semibold text-orange-300">{resource}</div>
                        <div className="text-2xl font-bold text-white mt-1">
                          {amount.toFixed(2)}/min
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-orange-200 text-sm">
          Default recipes only • Underclocking calculated when buildings would overproduce
          <br />
          Note: Production configurations are consolidated when possible, but split when exceeding belt/pipe capacity
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SatisfactoryCalculator />);
