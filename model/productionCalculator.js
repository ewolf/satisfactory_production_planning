/**
 * Production calculator for calculating shortfalls and requirements
 * Recursively determines all items needed to meet production goals
 */

(function() {
  // Support both Node.js and browser environments
  const gameData = (typeof require !== 'undefined') ? require('./gameData.js') : (typeof window !== 'undefined' ? window.gameData : undefined);
  const stateModel = (typeof require !== 'undefined') ? require('./stateModel.js') : (typeof window !== 'undefined' ? window : undefined);

  /**
   * Finds the standard (non-alternate) recipe that produces a given item
   * @param {number} itemIndex - Index of the item in items array
 * @returns {number|null} Recipe index, or null if no standard recipe found
 */
function findStandardRecipeForItem(itemIndex) {
  for (let i = 0; i < gameData.recipes.length; i++) {
    const recipe = gameData.recipes[i];
    if (!recipe.is_alternative && recipe.outputs.has(itemIndex)) {
      return i;
    }
  }
  return null;
}

/**
 * Calculates how many times a recipe needs to run to produce a target amount
 * @param {number} recipeIndex - Index of recipe in recipes array
 * @param {number} itemIndex - Index of item being produced
 * @param {number} targetRate - Desired production rate per minute
 * @returns {number} Multiplier for the recipe (1.0 = standard rate)
 */
function calculateRecipeMultiplier(recipeIndex, itemIndex, targetRate) {
  const recipe = gameData.recipes[recipeIndex];
  const recipeOutputRate = recipe.outputs.get(itemIndex);

  if (!recipeOutputRate) {
    return 0;
  }

  return targetRate / recipeOutputRate;
}

/**
 * Calculates production shortfalls recursively
 *
 * Starting from a production goal, this function recursively determines all
 * intermediate items and raw materials needed, accounting for the entire
 * production chain down to primary resources.
 *
 * @param {Map<number, number>} productionGoals - Map of item index to target production rate
 * @param {Map<number, number>} currentProduction - Map of item index to current production rate (default: empty)
 * @returns {Map<number, number>} Map of item index to shortfall amount (items needed)
 *
 * Valid inputs:
 * - productionGoals: Map with item indices as keys and positive numbers as values
 * - currentProduction: Map with item indices as keys and positive numbers as values
 *
 * Valid outputs:
 * - Map with item indices as keys and positive numbers representing shortfall rates
 *
 * Side effects:
 * - None (pure function)
 */
function calculateShortfall(productionGoals, currentProduction = new Map()) {
  const shortfalls = new Map();
  const processed = new Set();

  /**
   * Recursively processes an item to determine its requirements
   * @param {number} itemIndex - Item to process
   * @param {number} requiredRate - Required production rate
   */
  function processItem(itemIndex, requiredRate) {
    // Skip if already processed at this rate or higher
    const currentShortfall = shortfalls.get(itemIndex) || 0;
    const newShortfall = requiredRate;

    // Add to shortfall
    shortfalls.set(itemIndex, currentShortfall + newShortfall);

    // Check if this is a primary resource (ore, water, etc.)
    const item = gameData.items[itemIndex];
    if (gameData.primaries.includes(itemIndex)) {
      // Primary resource - stop recursion here
      return;
    }

    // Find standard recipe for this item
    const recipeIndex = findStandardRecipeForItem(itemIndex);
    if (recipeIndex === null) {
      // No recipe found - treat as primary
      return;
    }

    const recipe = gameData.recipes[recipeIndex];

    // Calculate how many times we need to run this recipe
    const multiplier = calculateRecipeMultiplier(recipeIndex, itemIndex, requiredRate);

    // Process all inputs for this recipe
    recipe.inputs.forEach((inputRate, inputItemIndex) => {
      const requiredInputRate = inputRate * multiplier;
      processItem(inputItemIndex, requiredInputRate);
    });
  }

  // Process each production goal
  productionGoals.forEach((targetRate, itemIndex) => {
    const currentRate = currentProduction.get(itemIndex) || 0;
    const needed = targetRate - currentRate;

    if (needed > 0) {
      processItem(itemIndex, needed);
    }
  });

  return shortfalls;
}

/**
 * Formats shortfall results for display
 * @param {Map<number, number>} shortfalls - Shortfall map from calculateShortfall
 * @returns {Array<{item: string, rate: number}>} Sorted array of shortfall items
 */
function formatShortfalls(shortfalls) {
  const result = [];

  shortfalls.forEach((rate, itemIndex) => {
    result.push({
      item: gameData.items[itemIndex].name,
      itemIndex: itemIndex,
      rate: rate
    });
  });

  // Sort by item index for consistent output
  result.sort((a, b) => a.itemIndex - b.itemIndex);

  return result;
}

/**
 * Calculates production requirements for a production line
 * @param {Object} productionLine - Production Line object
 * @returns {Object} Object containing production, consumption, and shortfalls
 *
 * Valid inputs:
 * - productionLine: Production Line object from stateModel
 *
 * Valid outputs:
 * - Object with production (Map), consumption (Map), and shortfalls (Map)
 *
 * Side effects:
 * - None (pure function)
 */
function calculateProductionLineRequirements(productionLine) {
  const production = stateModel.calculateLineProduction(productionLine);
  const consumption = stateModel.calculateLineConsumption(productionLine);

  // Calculate what's being produced vs consumed internally
  const netProduction = new Map(production);
  consumption.forEach((consumeRate, itemIndex) => {
    const produceRate = netProduction.get(itemIndex) || 0;
    const net = produceRate - consumeRate;
    if (net > 0) {
      netProduction.set(itemIndex, net);
    } else {
      netProduction.delete(itemIndex);
    }
  });

  // Calculate shortfalls based on production goals
  const shortfalls = calculateShortfall(productionLine.productionGoal, netProduction);

  return {
    production: production,
    consumption: consumption,
    netProduction: netProduction,
    shortfalls: shortfalls
  };
}

  // Export for Node.js and browser
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      findStandardRecipeForItem,
      calculateRecipeMultiplier,
      calculateShortfall,
      formatShortfalls,
      calculateProductionLineRequirements
    };
  } else if (typeof window !== 'undefined') {
    // Export to global scope for browser
    window.findStandardRecipeForItem = findStandardRecipeForItem;
    window.calculateRecipeMultiplier = calculateRecipeMultiplier;
    window.calculateShortfall = calculateShortfall;
    window.formatShortfalls = formatShortfalls;
    window.calculateProductionLineRequirements = calculateProductionLineRequirements;
  }
})();
