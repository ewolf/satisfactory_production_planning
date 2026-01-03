/**
 * Satisfactory Production Calculator
 * Calculates optimal production chains for target items
 */

// Recipe data
const RECIPES = {
  'Iron Ingot': { building: 'Smelter', time: 2, inputs: { 'Iron Ore': 1 }, output: 1 },
  'Iron Plate': { building: 'Constructor', time: 6, inputs: { 'Iron Ingot': 3 }, output: 2 },
  'Iron Rod': { building: 'Constructor', time: 4, inputs: { 'Iron Ingot': 1 }, output: 1 },
  'Screw': { building: 'Constructor', time: 6, inputs: { 'Iron Rod': 1 }, output: 4 },
  'Reinforced Iron Plate': { building: 'Assembler', time: 12, inputs: { 'Iron Plate': 6, 'Screw': 12 }, output: 1 },
  'Rotor': { building: 'Assembler', time: 15, inputs: { 'Iron Rod': 5, 'Screw': 25 }, output: 1 },
  'Smart Plating': { building: 'Assembler', time: 30, inputs: { 'Reinforced Iron Plate': 1, 'Rotor': 1 }, output: 1 },
};

const BUILDINGS = {
  'Smelter': { power: 4 },
  'Constructor': { power: 4 },
  'Assembler': { power: 15 },
  'Miner Mk.1': { power: 5 },
};

const MINER_RATES = {
  'Miner Mk.1': { base: 60, purityMultipliers: { 'Impure': 0.5, 'Normal': 1.0, 'Pure': 2.0 } },
};

const BELT_TIERS = {
  'Mk.1': 60,
  'Mk.2': 120,
  'Mk.3': 270,
};

const RAW_RESOURCES = new Set(['Iron Ore', 'Copper Ore', 'Limestone', 'Coal', 'Water', 'Crude Oil']);

/**
 * Calculates the maximum clock speed for a recipe based on belt limits
 */
function calculateMaxClockSpeed(recipe, beltLimit) {
  let maxClock = 100;

  // Check all inputs
  for (const [item, amount] of Object.entries(recipe.inputs)) {
    const inputPerMinute = (amount / recipe.time) * 60;
    if (inputPerMinute > beltLimit) {
      const clockForInput = (beltLimit / inputPerMinute) * 100;
      maxClock = Math.min(maxClock, clockForInput);
    }
  }

  // Check output
  const outputPerMinute = (recipe.output / recipe.time) * 60;
  if (outputPerMinute > beltLimit) {
    const clockForOutput = (beltLimit / outputPerMinute) * 100;
    maxClock = Math.min(maxClock, clockForOutput);
  }

  return maxClock;
}

/**
 * Main calculator class
 */
class SatisfactoryCalculator {
  constructor() {
    this.targetProduction = new Map();
    this.beltTier = 'Mk.1';
    this.minerTier = 'Mk.1';
    this.resourcePurity = 'Normal';
    this.prodConfigs = [];
  }

  setTargetProduction(item, rate) {
    this.targetProduction.set(item, rate);
  }

  setBeltTier(tier) {
    this.beltTier = tier;
  }

  setMinerTier(tier) {
    this.minerTier = tier;
  }

  setResourcePurity(purity) {
    this.resourcePurity = purity;
  }

  calculate() {
    const beltLimit = BELT_TIERS[this.beltTier];
    const itemNeeds = {}; // Total amount of each item needed
    const resourceNeeds = {};

    // Phase 1: Calculate total requirements for all items
    const calculateRequirements = (item, rateNeeded) => {
      const recipe = RECIPES[item];

      if (!recipe) {
        // Raw resource
        resourceNeeds[item] = (resourceNeeds[item] || 0) + rateNeeded;
        return;
      }

      // Add to total needs for this item
      itemNeeds[item] = (itemNeeds[item] || 0) + rateNeeded;

      // Calculate input requirements (don't apply belt limits yet)
      for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
        const inputPerMinute = (inputAmount / recipe.time) * 60;
        const totalInputNeeded = inputPerMinute * rateNeeded / ((recipe.output / recipe.time) * 60);

        if (RAW_RESOURCES.has(inputItem)) {
          resourceNeeds[inputItem] = (resourceNeeds[inputItem] || 0) + totalInputNeeded;
        } else {
          calculateRequirements(inputItem, totalInputNeeded);
        }
      }
    };

    // Calculate requirements for all target items
    for (const [item, rate] of this.targetProduction) {
      calculateRequirements(item, rate);
    }

    // Phase 2: Create production configs with belt limits and underclocking
    const prodConfigs = [];

    for (const [item, rateNeeded] of Object.entries(itemNeeds)) {
      const recipe = RECIPES[item];
      const buildingName = recipe.building;

      // Calculate max clock speed based on belt limits
      const maxClock = calculateMaxClockSpeed(recipe, beltLimit);

      // Calculate base items per minute at 100%
      const baseItemsPerMinute = (recipe.output / recipe.time) * 60;

      // Calculate exact buildings needed at max allowable clock
      const itemsPerMinuteAtMaxClock = baseItemsPerMinute * (maxClock / 100);
      const exactBuildingsNeeded = rateNeeded / itemsPerMinuteAtMaxClock;

      // Round up to get integer count
      const buildingsNeeded = Math.ceil(exactBuildingsNeeded);

      // Calculate the clock speed needed for exact production with integer machines
      const finalClock = (rateNeeded / (buildingsNeeded * baseItemsPerMinute)) * 100;

      prodConfigs.push({
        building: buildingName,
        item: item,
        count: buildingsNeeded,
        clockSpeed: finalClock,
        ratePerMachine: rateNeeded / buildingsNeeded,
        totalRate: rateNeeded,
      });
    }

    // Add miners for raw resources
    for (const [resource, rateNeeded] of Object.entries(resourceNeeds)) {
      const minerType = `Miner ${this.minerTier}`;
      const minerData = MINER_RATES[minerType];
      const ratePerMiner = minerData.base * minerData.purityMultipliers[this.resourcePurity];
      const minersNeeded = rateNeeded / ratePerMiner;
      const intCount = Math.ceil(minersNeeded);
      const underclocking = (minersNeeded / intCount) * 100;

      prodConfigs.push({
        building: minerType,
        item: resource,
        count: intCount,
        clockSpeed: underclocking,
        ratePerMachine: rateNeeded / intCount,
        totalRate: rateNeeded,
      });
    }

    this.prodConfigs = prodConfigs;
    return this.prodConfigs;
  }

  getProdConfigs() {
    return this.prodConfigs;
  }
}

module.exports = { SatisfactoryCalculator, RECIPES, BELT_TIERS };
