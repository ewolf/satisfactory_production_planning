/**
 * State Model for Satisfactory Production Planner - Redesigned
 * Manages user state including power grids, production lines, and configurations
 *
 * Based on Model.txt specification
 */

(function() {

// Import gameData
const gameData = (typeof require !== 'undefined') ? require('./gameData.js') : window.gameData2;

// ============================================================================
// CALCULATION FORMULAS (from Model.txt)
// ============================================================================

/**
 * Clock rate multiplier: (clock speed / 100)
 */
function clockRateMultiplier(clockSpeed) {
  return clockSpeed / 100;
}

/**
 * Clock power multiplier: (clock speed / 100) ^ 1.321928
 */
function clockPowerMultiplier(clockSpeed) {
  return Math.pow(clockSpeed / 100, 1.321928);
}

/**
 * Sommersloop power factor: (1 + sommersloops / maxSommersloops) ^ 2
 */
function sommerloopPowerFactor(sommersloops, maxSommersloops) {
  if (maxSommersloops === 0) return 1;
  return Math.pow(1 + (sommersloops / maxSommersloops), 2);
}

/**
 * Sommersloop item factor: (1 + sommersloops * 0.25)
 */
function sommerloopItemFactor(sommersloops) {
  return 1 + (sommersloops * 0.25);
}

// ============================================================================
// INITIAL STATE
// ============================================================================

/**
 * Creates the initial application state
 */
function createInitialState() {
  return {
    unlockedRecipes: new Array(gameData.AlternateRecipeList.length).fill(false),
    maxBeltResearched: 0,  // Mk.1 belt
    maxPipeResearched: 0,  // Mk.1 pipe
    powerGrids: [],
    productionLines: []
  };
}

// ============================================================================
// POWER GRID
// ============================================================================

/**
 * Creates a new power grid
 * @param {string} name - Name of the power grid
 * @returns {Object} Power grid object
 */
function createPowerGrid(name) {
  return {
    name: name || 'New Grid',
    powerConfigs: [],
    productionLineConnections: [],  // Calculated from production lines
    fuelInputHash: new Map(),  // fuel -> rate (calculated)
    maxAvgPowerOutput: 0,  // Calculated
    currAvgPowerOutput: 0,  // Calculated
    efficiency: 0,  // Calculated
    waste: new Map(),  // item -> rate (calculated)
    isOn: false  // Calculated: true if maxAvgPowerOutput >= sum of connected lines' power consumption
  };
}

/**
 * Creates a new power configuration
 * @param {number} buildingIndex - Index of building in buildings array
 * @param {number} fuelIndex - Index of fuel in items array (optional for geothermal)
 * @param {number} clockSpeed - Clock speed percentage (0-250)
 * @param {number} count - Number of buildings
 * @returns {Object} Power configuration object
 */
function createPowerConfig(buildingIndex, fuelIndex, clockSpeed, count) {
  const building = gameData.buildings[buildingIndex];

  return {
    building: buildingIndex,
    fuelUsed: fuelIndex !== undefined ? fuelIndex : null,
    clockSpeed: clockSpeed || 100,
    count: count || 1,
    fuelRateRequested: 0,  // Calculated
    fuelRateGiven: 0,  // Calculated
    maxAvgPowerOutput: 0,  // Calculated
    currAvgPowerOutput: 0  // Calculated
  };
}

/**
 * Calculates fuel rate requested for a power config
 * Formula: numberOfBuildings * clock rate multiplier * building.fuelHash[fuelUsed] * (1.5 if HUB Biomass Burner else 1.0)
 */
function calculateFuelRateRequested(config) {
  const building = gameData.buildings[config.building];

  // Geothermal doesn't use fuel
  if (building.fuelHash.size === 0) {
    return 0;
  }

  const fuelRate = building.fuelHash.get(config.fuelUsed) || 0;
  const clockMult = clockRateMultiplier(config.clockSpeed);
  const hubMultiplier = building.name === "HUB Biomass Burner" ? 1.5 : 1.0;

  return config.count * clockMult * fuelRate * hubMultiplier;
}

/**
 * Calculates max average power output for a power config
 * Formula: numberOfBuildings * clock rate multiplier * avg_power_out of building
 */
function calculateMaxAvgPowerOutput(config) {
  const building = gameData.buildings[config.building];
  const clockMult = clockRateMultiplier(config.clockSpeed);

  return config.count * clockMult * building.avg_power_out;
}

/**
 * Calculates current average power output for a power config
 * Formula: maxAvgPowerOutput * (fuelRateGiven / fuelRateRequested)
 */
function calculateCurrAvgPowerOutput(config) {
  if (config.fuelRateRequested === 0) {
    // Geothermal or no fuel needed
    return config.maxAvgPowerOutput;
  }

  return config.maxAvgPowerOutput * (config.fuelRateGiven / config.fuelRateRequested);
}

/**
 * Updates all calculated fields for power configs in a grid
 */
function updatePowerGridCalculations(grid) {
  // First, calculate requested fuel rates and max power output for each config
  grid.powerConfigs.forEach(config => {
    config.fuelRateRequested = calculateFuelRateRequested(config);
    config.maxAvgPowerOutput = calculateMaxAvgPowerOutput(config);
  });

  // Calculate max avg power output for grid
  grid.maxAvgPowerOutput = grid.powerConfigs.reduce((sum, config) => sum + config.maxAvgPowerOutput, 0);

  // Create fuel availability hash from fuelInputHash
  const fuelAvailable = new Map(grid.fuelInputHash);

  // Distribute fuel to configs and calculate actual power
  grid.powerConfigs.forEach(config => {
    if (config.fuelRateRequested === 0) {
      // No fuel needed (geothermal)
      config.fuelRateGiven = 0;
    } else {
      const available = fuelAvailable.get(config.fuelUsed) || 0;
      const given = Math.min(available, config.fuelRateRequested);
      config.fuelRateGiven = given;
      fuelAvailable.set(config.fuelUsed, available - given);
    }

    config.currAvgPowerOutput = calculateCurrAvgPowerOutput(config);
  });

  // Calculate curr avg power output for grid
  grid.currAvgPowerOutput = grid.powerConfigs.reduce((sum, config) => sum + config.currAvgPowerOutput, 0);

  // Calculate efficiency
  grid.efficiency = grid.maxAvgPowerOutput > 0 ? (grid.currAvgPowerOutput / grid.maxAvgPowerOutput) * 100 : 0;
}

// ============================================================================
// PRODUCTION LINE
// ============================================================================

/**
 * Creates a new production line
 * @param {string} name - Name of the production line
 * @returns {Object} Production line object
 */
function createProductionLine(name) {
  return {
    name: name || 'New Line',
    productionGoals: new Map(),  // item -> rate (set by user)
    productionConfigs: [],  // Array of production configs
    extractionConfigs: [],  // Array of extraction configs
    powerGridConnection: null,  // Index of single power grid, or null if not connected
    isEnabled: true,  // Set by user: enable/disable this line
    isOn: false,  // Calculated: true if isEnabled && connected grid is on
    fuelsProduced: new Map(),  // fuel -> rate (calculated)
    fuelsExported: new Map(),  // fuel -> Map<gridIndex, percentage> (set by user)
    itemsImported: new Map(),  // item -> rate (calculated)
    itemsExported: new Map(),  // item -> Map<lineIndex, percentage> (set by user)
    powerConsumption: 0,  // Calculated
    itemsProduced: new Map(),  // item -> rate (calculated)
    itemsConsumed: new Map(),  // item -> rate (calculated)
    itemShortfalls: new Map()  // item -> rate (calculated, positive = shortage)
  };
}

/**
 * Creates a new extraction configuration
 * @param {number} buildingIndex - Index of extraction building
 * @param {number} itemIndex - Resource item index
 * @param {string} purity - "impure", "normal", or "pure"
 * @param {number} clockSpeed - Clock speed percentage (0-250)
 * @param {number} count - Number of buildings
 * @returns {Object} Extraction configuration object
 */
function createExtractionConfig(buildingIndex, itemIndex, purity, clockSpeed, count) {
  return {
    building: buildingIndex,
    producedItem: itemIndex,
    purity: purity || 'normal',
    clockSpeed: clockSpeed || 100,
    count: count || 1,
    productionRate: 0,  // Calculated
    powerConsumption: 0  // Calculated
  };
}

/**
 * Calculates production rate for extraction config
 * Formula: number of buildings * building.resourceOutputHash[item][purity] * clock rate multiplier
 */
function calculateExtractionProductionRate(config) {
  const building = gameData.buildings[config.building];
  const outputMap = building.resourceOutputHash.get(config.producedItem);

  if (!outputMap) return 0;

  const baseRate = outputMap.get(config.purity) || 0;
  const clockMult = clockRateMultiplier(config.clockSpeed);

  return config.count * baseRate * clockMult;
}

/**
 * Calculates power consumption for extraction config
 * Formula: number of buildings * clock power multiplier * building.avg_power_in
 */
function calculateExtractionPowerConsumption(config) {
  const building = gameData.buildings[config.building];
  const clockPowerMult = clockPowerMultiplier(config.clockSpeed);

  return config.count * clockPowerMult * building.avg_power_in;
}

/**
 * Creates a new production configuration
 * @param {number} recipeIndex - Index of recipe
 * @param {number} clockSpeed - Clock speed percentage (0-250)
 * @param {number} sommersloops - Number of sommersloops (0-maxSommersloops)
 * @param {number} count - Number of buildings
 * @returns {Object} Production configuration object
 */
function createProductionConfig(recipeIndex, clockSpeed, sommersloops, count) {
  const recipe = gameData.recipes[recipeIndex];

  return {
    recipe: recipeIndex,
    building: recipe.building,
    clockSpeed: clockSpeed || 100,
    sommersloops: sommersloops || 0,
    count: count || 1,
    inputs: new Map(),  // item -> rate (calculated)
    outputs: new Map(),  // item -> rate (calculated)
    powerConsumption: 0  // Calculated
  };
}

/**
 * Calculates inputs for production config
 * Formula: number of buildings * clock rate multiplier * recipe.inputHash[item]
 */
function calculateProductionInputs(config, maxBeltRate, maxPipeRate) {
  const recipe = gameData.recipes[config.recipe];
  const clockMult = clockRateMultiplier(config.clockSpeed);
  const inputs = new Map();

  recipe.inputHash.forEach((rate, itemIndex) => {
    const item = gameData.items[itemIndex];
    const calculatedRate = config.count * clockMult * rate;

    // Cap by belt or pipe rate
    const maxRate = item.is_fluid ? maxPipeRate : maxBeltRate;
    inputs.set(itemIndex, Math.min(calculatedRate, maxRate));
  });

  return inputs;
}

/**
 * Calculates outputs for production config
 * Formula: number of buildings * clock rate multiplier * sommersloop item factor * recipe.outputHash[item]
 */
function calculateProductionOutputs(config, maxBeltRate, maxPipeRate) {
  const recipe = gameData.recipes[config.recipe];
  const clockMult = clockRateMultiplier(config.clockSpeed);
  const sommerloopMult = sommerloopItemFactor(config.sommersloops);
  const outputs = new Map();

  recipe.outputHash.forEach((rate, itemIndex) => {
    const item = gameData.items[itemIndex];
    const calculatedRate = config.count * clockMult * sommerloopMult * rate;

    // Cap by belt or pipe rate
    const maxRate = item.is_fluid ? maxPipeRate : maxBeltRate;
    outputs.set(itemIndex, Math.min(calculatedRate, maxRate));
  });

  return outputs;
}

/**
 * Calculates power consumption for production config
 * Formula: number of buildings * clock power multiplier * sommersloop power factor * building.avg_power_in
 */
function calculateProductionPowerConsumption(config) {
  const building = gameData.buildings[config.building];
  const clockPowerMult = clockPowerMultiplier(config.clockSpeed);
  const sommerloopPowerMult = sommerloopPowerFactor(config.sommersloops, building.maxSommersloops);

  return config.count * clockPowerMult * sommerloopPowerMult * building.avg_power_in;
}

/**
 * Updates all calculated fields for a production line
 */
function updateProductionLineCalculations(line, maxBeltRate, maxPipeRate) {
  // Update extraction configs
  line.extractionConfigs.forEach(config => {
    config.productionRate = calculateExtractionProductionRate(config);
    config.powerConsumption = calculateExtractionPowerConsumption(config);
  });

  // Calculate items available from extraction
  const itemsAvailable = new Map();
  line.extractionConfigs.forEach(config => {
    const current = itemsAvailable.get(config.producedItem) || 0;
    itemsAvailable.set(config.producedItem, current + config.productionRate);
  });

  // Add imported items to available pool
  line.itemsImported.forEach((rate, itemIndex) => {
    const current = itemsAvailable.get(itemIndex) || 0;
    itemsAvailable.set(itemIndex, current + rate);
  });

  // Update production configs and check if inputs are available
  line.productionConfigs.forEach(config => {
    config.inputs = calculateProductionInputs(config, maxBeltRate, maxPipeRate);
    config.powerConsumption = calculateProductionPowerConsumption(config);

    // Check if ALL inputs are available
    let allInputsAvailable = true;
    config.inputs.forEach((requiredRate, itemIndex) => {
      const available = itemsAvailable.get(itemIndex) || 0;
      if (available < requiredRate) {
        allInputsAvailable = false;
      }
    });

    if (allInputsAvailable) {
      // Calculate outputs normally
      config.outputs = calculateProductionOutputs(config, maxBeltRate, maxPipeRate);

      // Consume the inputs from available pool
      config.inputs.forEach((rate, itemIndex) => {
        const current = itemsAvailable.get(itemIndex) || 0;
        itemsAvailable.set(itemIndex, current - rate);
      });

      // Add outputs to available pool (for downstream configs)
      config.outputs.forEach((rate, itemIndex) => {
        const current = itemsAvailable.get(itemIndex) || 0;
        itemsAvailable.set(itemIndex, current + rate);
      });
    } else {
      // Not enough inputs, produce nothing
      config.outputs = new Map();
    }
  });

  // Calculate total power consumption
  line.powerConsumption = 0;
  line.extractionConfigs.forEach(config => {
    line.powerConsumption += config.powerConsumption;
  });
  line.productionConfigs.forEach(config => {
    line.powerConsumption += config.powerConsumption;
  });

  // Calculate items produced
  line.itemsProduced.clear();
  line.extractionConfigs.forEach(config => {
    const current = line.itemsProduced.get(config.producedItem) || 0;
    line.itemsProduced.set(config.producedItem, current + config.productionRate);
  });
  line.productionConfigs.forEach(config => {
    config.outputs.forEach((rate, itemIndex) => {
      const current = line.itemsProduced.get(itemIndex) || 0;
      line.itemsProduced.set(itemIndex, current + rate);
    });
  });

  // Calculate items consumed
  line.itemsConsumed.clear();
  line.productionConfigs.forEach(config => {
    config.inputs.forEach((rate, itemIndex) => {
      const current = line.itemsConsumed.get(itemIndex) || 0;
      line.itemsConsumed.set(itemIndex, current + rate);
    });
  });

  // Calculate shortfalls: total inputs needed - (extraction + imports)
  line.itemShortfalls.clear();

  // Calculate total needed
  const totalNeeded = new Map();
  line.productionConfigs.forEach(config => {
    config.inputs.forEach((rate, itemIndex) => {
      const current = totalNeeded.get(itemIndex) || 0;
      totalNeeded.set(itemIndex, current + rate);
    });
  });

  // Calculate available (extraction + imports)
  const totalAvailable = new Map();
  line.extractionConfigs.forEach(config => {
    const current = totalAvailable.get(config.producedItem) || 0;
    totalAvailable.set(config.producedItem, current + config.productionRate);
  });
  line.itemsImported.forEach((rate, itemIndex) => {
    const current = totalAvailable.get(itemIndex) || 0;
    totalAvailable.set(itemIndex, current + rate);
  });

  // Add production outputs to available (for chained production)
  line.productionConfigs.forEach(config => {
    config.outputs.forEach((rate, itemIndex) => {
      const current = totalAvailable.get(itemIndex) || 0;
      totalAvailable.set(itemIndex, current + rate);
    });
  });

  // Calculate shortfalls (positive = shortage, negative = surplus)
  totalNeeded.forEach((needed, itemIndex) => {
    const available = totalAvailable.get(itemIndex) || 0;
    const shortfall = needed - available;
    if (shortfall > 0) {
      line.itemShortfalls.set(itemIndex, shortfall);
    }
  });

  // Calculate fuels produced
  line.fuelsProduced.clear();
  line.itemsProduced.forEach((rate, itemIndex) => {
    const item = gameData.items[itemIndex];
    if (item.is_fuel) {
      line.fuelsProduced.set(itemIndex, rate);
    }
  });
}

// ============================================================================
// POWER STATE CALCULATIONS
// ============================================================================

/**
 * Updates isOn states for all power grids and production lines
 * This should be called after all power and production calculations are complete
 * @param {Object} state - The application state
 */
function updatePowerStates(state) {
  // First, update isOn for all power grids
  state.powerGrids.forEach(grid => {
    // Calculate total power consumption from connected production lines
    let totalConsumption = 0;
    state.productionLines.forEach(line => {
      if (line.powerGridConnection === state.powerGrids.indexOf(grid)) {
        totalConsumption += line.powerConsumption;
      }
    });

    // Grid is on if max power output >= total consumption
    grid.isOn = grid.maxAvgPowerOutput >= totalConsumption;
  });

  // Then, update isOn for all production lines
  state.productionLines.forEach(line => {
    if (!line.isEnabled) {
      line.isOn = false;
    } else if (line.powerGridConnection === null) {
      line.isOn = false;
    } else {
      const connectedGrid = state.powerGrids[line.powerGridConnection];
      line.isOn = connectedGrid && connectedGrid.isOn;
    }

    // If line is off, zero out all consumption and production
    if (!line.isOn) {
      line.powerConsumption = 0;
      line.itemsProduced = new Map();
      line.itemsConsumed = new Map();
      line.fuelsProduced = new Map();

      // Also zero out individual config values
      line.extractionConfigs.forEach(config => {
        config.productionRate = 0;
        config.powerConsumption = 0;
      });

      line.productionConfigs.forEach(config => {
        config.inputs = new Map();
        config.outputs = new Map();
        config.powerConsumption = 0;
      });
    }
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

const stateModel = {
  // Formulas
  clockRateMultiplier,
  clockPowerMultiplier,
  sommerloopPowerFactor,
  sommerloopItemFactor,

  // State creation
  createInitialState,

  // Power grid
  createPowerGrid,
  createPowerConfig,
  updatePowerGridCalculations,

  // Production line
  createProductionLine,
  createExtractionConfig,
  createProductionConfig,
  updateProductionLineCalculations,

  // Power states
  updatePowerStates
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = stateModel;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.stateModel2 = stateModel;
}

})();
