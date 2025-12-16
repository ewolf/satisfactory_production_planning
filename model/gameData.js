/**
 * Game data for Satisfactory - Redesigned Model
 * Contains immutable game data: Belts, Pipes, Items, Buildings, and Recipes
 * All rates are units per minute. Power is measured in MegaWatt.
 *
 * Based on Model.txt specification
 */

(function() {

// ============================================================================
// BELTS
// ============================================================================

/**
 * Belts - Transport items at various speeds
 * @type {Array<{level: number, rate: number}>}
 */
const belts = [
  { level: 1, flow_rate: 60 },
  { level: 2, flow_rate: 120 },
  { level: 3, flow_rate: 270 },
  { level: 4, flow_rate: 480 },
  { level: 5, flow_rate: 780 }
];

// ============================================================================
// PIPES
// ============================================================================

/**
 * Pipes - Transport fluids at various speeds
 * @type {Array<{level: number, rate: number}>}
 */
const pipes = [
  { level: 1, flow_rate: 300 },
  { level: 2, flow_rate: 600 }
];

// ============================================================================
// ITEMS
// ============================================================================

/**
 * Items - Anything that can be input or output to buildings
 * @type {Array<{name: string, is_fluid: boolean, is_ore: boolean, is_resource: boolean, is_fuel: boolean}>}
 */
const items = [
  // Resources - Ores (indices 0-9)
  { name: "Iron Ore", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "Copper Ore", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "Limestone", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "Coal", is_fluid: false, is_ore: true, is_resource: true, is_fuel: true },
  { name: "Caterium Ore", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "Raw Quartz", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "Sulfur", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "Bauxite", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "Uranium", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
  { name: "SAM", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },

  // Resources - Fluids (indices 10-12)
  { name: "Water", is_fluid: true, is_ore: false, is_resource: true, is_fuel: false },
  { name: "Crude Oil", is_fluid: true, is_ore: false, is_resource: true, is_fuel: false },
  { name: "Nitrogen Gas", is_fluid: true, is_ore: false, is_resource: true, is_fuel: false },

  // Biomass Fuels (indices 13-17)
  { name: "Leaves", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Wood", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Biomass", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Solid Biofuel", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Packaged Liquid Biofuel", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },

  // Intermediate Fluids (indices 18-27)
  { name: "Heavy Oil Residue", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Fuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Liquid Biofuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Turbofuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Alumina Solution", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Sulfuric Acid", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Nitric Acid", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Dissolved Silica", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Rocket Fuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Ionized Fuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },

  // Basic Ingots (indices 28-32)
  { name: "Iron Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Copper Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Steel Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Caterium Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Aluminum Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },

  // Basic Components (indices 33-52)
  { name: "Iron Plate", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Iron Rod", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Screw", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Reinforced Iron Plate", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Concrete", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Steel Beam", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Steel Pipe", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Wire", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Cable", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Copper Sheet", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Quartz Crystal", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Silica", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Quickwire", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Aluminum Casing", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Petroleum Coke", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Plastic", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Rubber", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Polymer Resin", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Compacted Coal", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
  { name: "Aluminum Scrap", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },

  // Advanced Components (indices 53+)
  { name: "Modular Frame", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Encased Industrial Beam", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Heavy Modular Frame", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Rotor", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Stator", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Motor", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Circuit Board", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Computer", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  { name: "Uranium Fuel Rod", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true }
];

// ============================================================================
// BUILDINGS
// ============================================================================

/**
 * Buildings - Extractors, Production, and Power Generators
 * @type {Array<{name: string, avg_power_in: number, avg_power_out: number, fuelHash: Map<number,number>, is_powerplant: boolean, is_extractor: boolean, is_production: boolean, resourceOutputHash: Map<number,Map<string,number>>, maxSommersloops: number}>}
 */
const buildings = [
  // === EXTRACTORS (indices 0-5) ===
  {
    name: "Miner Mk.1",
    avg_power_in: 5,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: true,
    is_production: false,
    resourceOutputHash: new Map([
      [0, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Iron Ore
      [1, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Copper Ore
      [2, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Limestone
      [3, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Coal
      [4, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Caterium Ore
      [5, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Raw Quartz
      [6, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Sulfur
      [7, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Bauxite
      [8, new Map([["impure", 30], ["normal", 60], ["pure", 120]])],  // Uranium
      [9, new Map([["impure", 30], ["normal", 60], ["pure", 120]])]   // SAM
    ]),
    maxSommersloops: 0
  },

  {
    name: "Water Extractor",
    avg_power_in: 20,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: true,
    is_production: false,
    resourceOutputHash: new Map([
      [10, new Map([["normal", 120]])]  // Water (no purity variations)
    ]),
    maxSommersloops: 0
  },

  {
    name: "Oil Extractor",
    avg_power_in: 40,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: true,
    is_production: false,
    resourceOutputHash: new Map([
      [11, new Map([["impure", 60], ["normal", 120], ["pure", 240]])]  // Crude Oil
    ]),
    maxSommersloops: 0
  },

  // === POWER GENERATORS (indices 3-8) ===
  {
    name: "HUB Biomass Burner",
    avg_power_in: 0,
    avg_power_out: 20,
    fuelHash: new Map([
      [13, 15],  // Leaves - 15/min
      [14, 12],  // Wood - 12/min
      [15, 6],   // Biomass - 6/min
      [16, 2.5], // Solid Biofuel - 2.5/min
      [17, 2.5]  // Packaged Liquid Biofuel - 2.5/min
    ]),
    is_powerplant: true,
    is_extractor: false,
    is_production: false,
    resourceOutputHash: new Map(),
    maxSommersloops: 0
  },

  {
    name: "Biomass Burner",
    avg_power_in: 0,
    avg_power_out: 30,
    fuelHash: new Map([
      [13, 15],  // Leaves - 15/min
      [14, 12],  // Wood - 12/min
      [15, 6],   // Biomass - 6/min
      [16, 2.5], // Solid Biofuel - 2.5/min
      [17, 2.5]  // Packaged Liquid Biofuel - 2.5/min
    ]),
    is_powerplant: true,
    is_extractor: false,
    is_production: false,
    resourceOutputHash: new Map(),
    maxSommersloops: 0
  },

  {
    name: "Coal Generator",
    avg_power_in: 0,
    avg_power_out: 75,
    fuelHash: new Map([
      [3, 15],   // Coal - 15/min
      [48, 12],  // Petroleum Coke - 12/min
      [52, 7.5]  // Compacted Coal - 7.5/min
    ]),
    is_powerplant: true,
    is_extractor: false,
    is_production: false,
    resourceOutputHash: new Map(),
    maxSommersloops: 0
  },

  {
    name: "Fuel Generator",
    avg_power_in: 0,
    avg_power_out: 150,
    fuelHash: new Map([
      [19, 12],  // Fuel - 12/min
      [20, 12],  // Liquid Biofuel - 12/min
      [21, 4.5]  // Turbofuel - 4.5/min
    ]),
    is_powerplant: true,
    is_extractor: false,
    is_production: false,
    resourceOutputHash: new Map(),
    maxSommersloops: 0
  },

  {
    name: "Geothermal Generator",
    avg_power_in: 0,
    avg_power_out: 200,
    fuelHash: new Map(),  // No fuel needed
    is_powerplant: true,
    is_extractor: false,
    is_production: false,
    resourceOutputHash: new Map(),
    maxSommersloops: 0
  },

  {
    name: "Nuclear Power Plant",
    avg_power_in: 0,
    avg_power_out: 2500,
    fuelHash: new Map([
      [61, 0.2]  // Uranium Fuel Rod - 0.2/min
    ]),
    is_powerplant: true,
    is_extractor: false,
    is_production: false,
    resourceOutputHash: new Map(),
    maxSommersloops: 0
  },

  // === PRODUCTION BUILDINGS (indices 9+) ===
  {
    name: "Smelter",
    avg_power_in: 4,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: false,
    is_production: true,
    resourceOutputHash: new Map(),
    maxSommersloops: 1
  },

  {
    name: "Foundry",
    avg_power_in: 16,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: false,
    is_production: true,
    resourceOutputHash: new Map(),
    maxSommersloops: 2
  },

  {
    name: "Constructor",
    avg_power_in: 4,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: false,
    is_production: true,
    resourceOutputHash: new Map(),
    maxSommersloops: 1
  },

  {
    name: "Assembler",
    avg_power_in: 15,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: false,
    is_production: true,
    resourceOutputHash: new Map(),
    maxSommersloops: 2
  },

  {
    name: "Manufacturer",
    avg_power_in: 55,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: false,
    is_production: true,
    resourceOutputHash: new Map(),
    maxSommersloops: 3
  },

  {
    name: "Refinery",
    avg_power_in: 30,
    avg_power_out: 0,
    fuelHash: new Map(),
    is_powerplant: false,
    is_extractor: false,
    is_production: true,
    resourceOutputHash: new Map(),
    maxSommersloops: 2
  }
];

// ============================================================================
// RECIPES
// ============================================================================

/**
 * Recipes - Production recipes for buildings
 * @type {Array<{name: string, is_alt: boolean, building: number, rate: number, inputHash: Map<number,number>, outputHash: Map<number,number>}>}
 */
const recipes = [
  // === SMELTER RECIPES ===
  {
    name: "Iron Ingot",
    is_alt: false,
    building: 9,  // Smelter
    rate: 30,
    inputHash: new Map([[0, 30]]),  // Iron Ore
    outputHash: new Map([[28, 30]])  // Iron Ingot
  },

  {
    name: "Copper Ingot",
    is_alt: false,
    building: 9,  // Smelter
    rate: 30,
    inputHash: new Map([[1, 30]]),  // Copper Ore
    outputHash: new Map([[29, 30]])  // Copper Ingot
  },

  // === FOUNDRY RECIPES ===
  {
    name: "Steel Ingot",
    is_alt: false,
    building: 10,  // Foundry
    rate: 45,
    inputHash: new Map([[0, 45], [3, 45]]),  // Iron Ore + Coal
    outputHash: new Map([[30, 45]])  // Steel Ingot
  },

  // === CONSTRUCTOR RECIPES ===
  {
    name: "Iron Plate",
    is_alt: false,
    building: 11,  // Constructor
    rate: 20,
    inputHash: new Map([[28, 30]]),  // Iron Ingot
    outputHash: new Map([[33, 20]])  // Iron Plate
  },

  {
    name: "Iron Rod",
    is_alt: false,
    building: 11,  // Constructor
    rate: 15,
    inputHash: new Map([[28, 15]]),  // Iron Ingot
    outputHash: new Map([[34, 15]])  // Iron Rod
  },

  {
    name: "Screw",
    is_alt: false,
    building: 11,  // Constructor
    rate: 40,
    inputHash: new Map([[34, 10]]),  // Iron Rod
    outputHash: new Map([[35, 40]])  // Screw
  },

  {
    name: "Steel Beam",
    is_alt: false,
    building: 11,  // Constructor
    rate: 15,
    inputHash: new Map([[30, 60]]),  // Steel Ingot
    outputHash: new Map([[38, 15]])  // Steel Beam
  },

  {
    name: "Steel Pipe",
    is_alt: false,
    building: 11,  // Constructor
    rate: 20,
    inputHash: new Map([[30, 30]]),  // Steel Ingot
    outputHash: new Map([[39, 20]])  // Steel Pipe
  },

  {
    name: "Wire",
    is_alt: false,
    building: 11,  // Constructor
    rate: 30,
    inputHash: new Map([[29, 15]]),  // Copper Ingot
    outputHash: new Map([[40, 30]])  // Wire
  },

  {
    name: "Concrete",
    is_alt: false,
    building: 11,  // Constructor
    rate: 15,
    inputHash: new Map([[2, 45]]),  // Limestone
    outputHash: new Map([[37, 15]])  // Concrete
  },

  // === ASSEMBLER RECIPES ===
  {
    name: "Reinforced Iron Plate",
    is_alt: false,
    building: 12,  // Assembler
    rate: 5,
    inputHash: new Map([[33, 30], [35, 60]]),  // Iron Plate + Screw
    outputHash: new Map([[36, 5]])  // Reinforced Iron Plate
  },

  {
    name: "Modular Frame",
    is_alt: false,
    building: 12,  // Assembler
    rate: 2,
    inputHash: new Map([[36, 3], [34, 12]]),  // Reinforced Iron Plate + Iron Rod
    outputHash: new Map([[53, 2]])  // Modular Frame
  },

  {
    name: "Encased Industrial Beam",
    is_alt: false,
    building: 12,  // Assembler
    rate: 6,
    inputHash: new Map([[38, 18], [37, 36]]),  // Steel Beam + Concrete
    outputHash: new Map([[54, 6]])  // Encased Industrial Beam
  },

  // === ASSEMBLER RECIPES (continued) ===
  {
    name: "Cable",
    is_alt: false,
    building: 12,  // Assembler
    rate: 30,
    inputHash: new Map([[40, 60]]),  // Wire
    outputHash: new Map([[41, 30]])  // Cable
  },

  {
    name: "Rotor",
    is_alt: false,
    building: 12,  // Assembler
    rate: 4,
    inputHash: new Map([[34, 20], [35, 100]]),  // Iron Rod + Screw
    outputHash: new Map([[56, 4]])  // Rotor
  },

  {
    name: "Stator",
    is_alt: false,
    building: 12,  // Assembler
    rate: 5,
    inputHash: new Map([[38, 15], [40, 40]]),  // Steel Beam + Wire
    outputHash: new Map([[57, 5]])  // Stator
  },

  {
    name: "Motor",
    is_alt: false,
    building: 12,  // Assembler
    rate: 5,
    inputHash: new Map([[56, 10], [57, 10]]),  // Rotor + Stator
    outputHash: new Map([[58, 5]])  // Motor
  },

  {
    name: "Circuit Board",
    is_alt: false,
    building: 12,  // Assembler
    rate: 7.5,
    inputHash: new Map([[29, 15], [48, 30]]),  // Copper Ingot + Plastic
    outputHash: new Map([[59, 7.5]])  // Circuit Board
  },

  // === CONSTRUCTOR RECIPES (continued) ===
  {
    name: "Copper Sheet",
    is_alt: false,
    building: 11,  // Constructor
    rate: 10,
    inputHash: new Map([[29, 20]]),  // Copper Ingot
    outputHash: new Map([[42, 10]])  // Copper Sheet
  },

  {
    name: "Quartz Crystal",
    is_alt: false,
    building: 11,  // Constructor
    rate: 22.5,
    inputHash: new Map([[5, 37.5]]),  // Raw Quartz
    outputHash: new Map([[43, 22.5]])  // Quartz Crystal
  },

  {
    name: "Silica",
    is_alt: false,
    building: 11,  // Constructor
    rate: 37.5,
    inputHash: new Map([[5, 22.5]]),  // Raw Quartz
    outputHash: new Map([[44, 37.5]])  // Silica
  },

  // === SMELTER RECIPES (continued) ===
  {
    name: "Caterium Ingot",
    is_alt: false,
    building: 9,  // Smelter
    rate: 15,
    inputHash: new Map([[4, 45]]),  // Caterium Ore
    outputHash: new Map([[31, 15]])  // Caterium Ingot
  },

  // === CONSTRUCTOR RECIPES (continued) ===
  {
    name: "Quickwire",
    is_alt: false,
    building: 11,  // Constructor
    rate: 60,
    inputHash: new Map([[31, 12]]),  // Caterium Ingot
    outputHash: new Map([[45, 60]])  // Quickwire
  },

  // === REFINERY RECIPES ===
  {
    name: "Plastic",
    is_alt: false,
    building: 14,  // Refinery
    rate: 20,
    inputHash: new Map([[11, 30]]),  // Crude Oil
    outputHash: new Map([[48, 20], [18, 10]])  // Plastic + Heavy Oil Residue
  },

  {
    name: "Rubber",
    is_alt: false,
    building: 14,  // Refinery
    rate: 20,
    inputHash: new Map([[11, 30]]),  // Crude Oil
    outputHash: new Map([[49, 20], [18, 20]])  // Rubber + Heavy Oil Residue
  },

  {
    name: "Polymer Resin",
    is_alt: false,
    building: 14,  // Refinery
    rate: 130,
    inputHash: new Map([[11, 60]]),  // Crude Oil
    outputHash: new Map([[50, 130], [18, 20]])  // Polymer Resin + Heavy Oil Residue
  },

  {
    name: "Alumina Solution",
    is_alt: false,
    building: 14,  // Refinery
    rate: 120,
    inputHash: new Map([[7, 120], [10, 180]]),  // Bauxite + Water
    outputHash: new Map([[22, 120], [44, 50]])  // Alumina Solution + Silica
  },

  {
    name: "Aluminum Scrap",
    is_alt: false,
    building: 14,  // Refinery
    rate: 360,
    inputHash: new Map([[22, 240], [3, 120]]),  // Alumina Solution + Coal
    outputHash: new Map([[52, 360], [10, 120]])  // Aluminum Scrap + Water
  },

  {
    name: "Sulfuric Acid",
    is_alt: false,
    building: 14,  // Refinery
    rate: 50,
    inputHash: new Map([[6, 50], [10, 50]]),  // Sulfur + Water
    outputHash: new Map([[23, 50]])  // Sulfuric Acid
  },

  {
    name: "Nitric Acid",
    is_alt: false,
    building: 14,  // Refinery
    rate: 30,
    inputHash: new Map([[12, 120], [10, 30], [28, 10]]),  // Nitrogen Gas + Water + Iron Ingot
    outputHash: new Map([[24, 30]])  // Nitric Acid
  },

  {
    name: "Dissolved Silica",
    is_alt: false,
    building: 14,  // Refinery
    rate: 120,
    inputHash: new Map([[5, 120], [10, 50]]),  // Raw Quartz + Water
    outputHash: new Map([[25, 120]])  // Dissolved Silica
  },

  // === FOUNDRY RECIPES ===
  {
    name: "Aluminum Ingot",
    is_alt: false,
    building: 10,  // Foundry
    rate: 60,
    inputHash: new Map([[52, 90], [44, 75]]),  // Aluminum Scrap + Silica
    outputHash: new Map([[32, 60]])  // Aluminum Ingot
  },

  // === CONSTRUCTOR RECIPES (continued) ===
  {
    name: "Aluminum Casing",
    is_alt: false,
    building: 11,  // Constructor
    rate: 60,
    inputHash: new Map([[32, 90]]),  // Aluminum Ingot
    outputHash: new Map([[46, 60]])  // Aluminum Casing
  },

  // === MANUFACTURER RECIPES ===
  {
    name: "Heavy Modular Frame",
    is_alt: false,
    building: 13,  // Manufacturer
    rate: 2,
    inputHash: new Map([[53, 10], [39, 10], [54, 30], [35, 200]]),  // Modular Frame + Steel Pipe + Encased Industrial Beam + Screw
    outputHash: new Map([[55, 2]])  // Heavy Modular Frame
  },

  {
    name: "Computer",
    is_alt: false,
    building: 13,  // Manufacturer
    rate: 2.5,
    inputHash: new Map([[59, 25], [41, 22.5], [48, 45]]),  // Circuit Board + Cable + Plastic
    outputHash: new Map([[60, 2.5]])  // Computer
  },

  // === ALTERNATE RECIPES ===

  // Iron Ingot - Iron Alloy (Alternate)
  {
    name: "Iron Alloy Ingot",
    is_alt: true,
    building: 10,  // Foundry
    rate: 50,
    inputHash: new Map([[0, 20], [1, 20]]),  // Iron Ore + Copper Ore
    outputHash: new Map([[28, 50]])  // Iron Ingot
  },

  // Steel Ingot - Solid Steel (Alternate)
  {
    name: "Solid Steel Ingot",
    is_alt: true,
    building: 10,  // Foundry
    rate: 60,
    inputHash: new Map([[0, 40], [3, 40]]),  // Iron Ore + Coal
    outputHash: new Map([[30, 60]])  // Steel Ingot
  },

  // Screw - Cast Screw (Alternate)
  {
    name: "Cast Screw",
    is_alt: true,
    building: 11,  // Constructor
    rate: 50,
    inputHash: new Map([[28, 12.5]]),  // Iron Ingot
    outputHash: new Map([[35, 50]])  // Screw
  },

  // Reinforced Iron Plate - Stitched Iron Plate (Alternate)
  {
    name: "Stitched Iron Plate",
    is_alt: true,
    building: 12,  // Assembler
    rate: 3,
    inputHash: new Map([[33, 18.75], [40, 37.5]]),  // Iron Plate + Wire
    outputHash: new Map([[36, 3]])  // Reinforced Iron Plate
  },

  // Modular Frame - Bolted Frame (Alternate)
  {
    name: "Bolted Frame",
    is_alt: true,
    building: 12,  // Assembler
    rate: 5,
    inputHash: new Map([[36, 7.5], [35, 140]]),  // Reinforced Iron Plate + Screw
    outputHash: new Map([[53, 5]])  // Modular Frame
  },

  // Iron Ingot - Pure Iron Ingot (Alternate)
  {
    name: "Pure Iron Ingot",
    is_alt: true,
    building: 14,  // Refinery
    rate: 65,
    inputHash: new Map([[0, 35], [10, 20]]),  // Iron Ore + Water
    outputHash: new Map([[28, 65]])  // Iron Ingot
  },

  // Copper Ingot - Pure Copper Ingot (Alternate)
  {
    name: "Pure Copper Ingot",
    is_alt: true,
    building: 14,  // Refinery
    rate: 37.5,
    inputHash: new Map([[1, 15], [10, 10]]),  // Copper Ore + Water
    outputHash: new Map([[29, 37.5]])  // Copper Ingot
  },

  // Copper Ingot - Copper Alloy Ingot (Alternate)
  {
    name: "Copper Alloy Ingot",
    is_alt: true,
    building: 10,  // Foundry
    rate: 100,
    inputHash: new Map([[1, 50], [0, 25]]),  // Copper Ore + Iron Ore
    outputHash: new Map([[29, 100]])  // Copper Ingot
  },

  // Steel Ingot - Coke Steel Ingot (Alternate)
  {
    name: "Coke Steel Ingot",
    is_alt: true,
    building: 10,  // Foundry
    rate: 100,
    inputHash: new Map([[0, 75], [47, 75]]),  // Iron Ore + Petroleum Coke
    outputHash: new Map([[30, 100]])  // Steel Ingot
  },

  // Steel Ingot - Compacted Steel Ingot (Alternate)
  {
    name: "Compacted Steel Ingot",
    is_alt: true,
    building: 10,  // Foundry
    rate: 37.5,
    inputHash: new Map([[0, 22.5], [51, 11.25]]),  // Iron Ore + Compacted Coal
    outputHash: new Map([[30, 37.5]])  // Steel Ingot
  },

  // Concrete - Wet Concrete (Alternate)
  {
    name: "Wet Concrete",
    is_alt: true,
    building: 14,  // Refinery
    rate: 80,
    inputHash: new Map([[2, 120], [10, 100]]),  // Limestone + Water
    outputHash: new Map([[37, 80]])  // Concrete
  },

  // Concrete - Fine Concrete (Alternate)
  {
    name: "Fine Concrete",
    is_alt: true,
    building: 12,  // Assembler
    rate: 25,
    inputHash: new Map([[44, 7.5], [2, 30]]),  // Silica + Limestone
    outputHash: new Map([[37, 25]])  // Concrete
  },

  // Concrete - Rubber Concrete (Alternate)
  {
    name: "Rubber Concrete",
    is_alt: true,
    building: 12,  // Assembler
    rate: 45,
    inputHash: new Map([[2, 50], [49, 10]]),  // Limestone + Rubber
    outputHash: new Map([[37, 45]])  // Concrete
  },

  // Screw - Steel Screw (Alternate)
  {
    name: "Steel Screw",
    is_alt: true,
    building: 11,  // Constructor
    rate: 260,
    inputHash: new Map([[38, 5]]),  // Steel Beam
    outputHash: new Map([[35, 260]])  // Screw
  },

  // Wire - Iron Wire (Alternate)
  {
    name: "Iron Wire",
    is_alt: true,
    building: 11,  // Constructor
    rate: 22.5,
    inputHash: new Map([[28, 12.5]]),  // Iron Ingot
    outputHash: new Map([[40, 22.5]])  // Wire
  },

  // Wire - Fused Wire (Alternate)
  {
    name: "Fused Wire",
    is_alt: true,
    building: 12,  // Assembler
    rate: 90,
    inputHash: new Map([[29, 12], [31, 3]]),  // Copper Ingot + Caterium Ingot
    outputHash: new Map([[40, 90]])  // Wire
  },

  // Wire - Caterium Wire (Alternate)
  {
    name: "Caterium Wire",
    is_alt: true,
    building: 11,  // Constructor
    rate: 120,
    inputHash: new Map([[31, 15]]),  // Caterium Ingot
    outputHash: new Map([[40, 120]])  // Wire
  },

  // Iron Plate - Coated Iron Plate (Alternate)
  {
    name: "Coated Iron Plate",
    is_alt: true,
    building: 12,  // Assembler
    rate: 75,
    inputHash: new Map([[28, 50], [48, 10]]),  // Iron Ingot + Plastic
    outputHash: new Map([[33, 75]])  // Iron Plate
  },

  // Iron Plate - Steel Coated Plate (Alternate)
  {
    name: "Steel Coated Plate",
    is_alt: true,
    building: 12,  // Assembler
    rate: 45,
    inputHash: new Map([[30, 7.5], [48, 5]]),  // Steel Ingot + Plastic
    outputHash: new Map([[33, 45]])  // Iron Plate
  },

  // Iron Rod - Steel Rod (Alternate)
  {
    name: "Steel Rod",
    is_alt: true,
    building: 11,  // Constructor
    rate: 48,
    inputHash: new Map([[30, 12]]),  // Steel Ingot
    outputHash: new Map([[34, 48]])  // Iron Rod
  },

  // Reinforced Iron Plate - Bolted Iron Plate (Alternate)
  {
    name: "Bolted Iron Plate",
    is_alt: true,
    building: 12,  // Assembler
    rate: 15,
    inputHash: new Map([[33, 90], [35, 250]]),  // Iron Plate + Screw
    outputHash: new Map([[36, 15]])  // Reinforced Iron Plate
  },

  // Reinforced Iron Plate - Adhered Iron Plate (Alternate)
  {
    name: "Adhered Iron Plate",
    is_alt: true,
    building: 12,  // Assembler
    rate: 3.75,
    inputHash: new Map([[33, 11.25], [49, 3.75]]),  // Iron Plate + Rubber
    outputHash: new Map([[36, 3.75]])  // Reinforced Iron Plate
  },

  // Rotor - Copper Rotor (Alternate)
  {
    name: "Copper Rotor",
    is_alt: true,
    building: 12,  // Assembler
    rate: 11.25,
    inputHash: new Map([[42, 22.5], [35, 195]]),  // Copper Sheet + Screw
    outputHash: new Map([[56, 11.25]])  // Rotor
  },

  // Rotor - Steel Rotor (Alternate)
  {
    name: "Steel Rotor",
    is_alt: true,
    building: 12,  // Assembler
    rate: 5,
    inputHash: new Map([[39, 10], [40, 30]]),  // Steel Pipe + Wire
    outputHash: new Map([[56, 5]])  // Rotor
  },

  // Modular Frame - Steeled Frame (Alternate)
  {
    name: "Steeled Frame",
    is_alt: true,
    building: 12,  // Assembler
    rate: 3,
    inputHash: new Map([[36, 2], [39, 10]]),  // Reinforced Iron Plate + Steel Pipe
    outputHash: new Map([[53, 3]])  // Modular Frame
  },

  // Heavy Modular Frame - Heavy Encased Frame (Alternate)
  {
    name: "Heavy Encased Frame",
    is_alt: true,
    building: 13,  // Manufacturer
    rate: 3,
    inputHash: new Map([[53, 8], [54, 10], [39, 36], [37, 22]]),  // Modular Frame + Encased Industrial Beam + Steel Pipe + Concrete
    outputHash: new Map([[55, 3]])  // Heavy Modular Frame
  },

  // Heavy Modular Frame - Heavy Flexible Frame (Alternate)
  {
    name: "Heavy Flexible Frame",
    is_alt: true,
    building: 13,  // Manufacturer
    rate: 3.75,
    inputHash: new Map([[53, 18.75], [54, 11.25], [49, 15], [35, 390]]),  // Modular Frame + Encased Industrial Beam + Rubber + Screw
    outputHash: new Map([[55, 3.75]])  // Heavy Modular Frame
  },

  // Cable - Coated Cable (Alternate)
  {
    name: "Coated Cable",
    is_alt: true,
    building: 14,  // Refinery
    rate: 67.5,
    inputHash: new Map([[40, 37.5], [18, 15]]),  // Wire + Heavy Oil Residue
    outputHash: new Map([[41, 67.5]])  // Cable
  },

  // Cable - Insulated Cable (Alternate)
  {
    name: "Insulated Cable",
    is_alt: true,
    building: 12,  // Assembler
    rate: 100,
    inputHash: new Map([[40, 45], [49, 30]]),  // Wire + Rubber
    outputHash: new Map([[41, 100]])  // Cable
  },

  // Cable - Quickwire Cable (Alternate)
  {
    name: "Quickwire Cable",
    is_alt: true,
    building: 12,  // Assembler
    rate: 27.5,
    inputHash: new Map([[45, 7.5], [49, 5]]),  // Quickwire + Rubber
    outputHash: new Map([[41, 27.5]])  // Cable
  },

  // Encased Industrial Beam - Encased Industrial Pipe (Alternate)
  {
    name: "Encased Industrial Pipe",
    is_alt: true,
    building: 12,  // Assembler
    rate: 4,
    inputHash: new Map([[39, 28], [37, 20]]),  // Steel Pipe + Concrete
    outputHash: new Map([[54, 4]])  // Encased Industrial Beam
  },

  // Stator - Quickwire Stator (Alternate)
  {
    name: "Quickwire Stator",
    is_alt: true,
    building: 12,  // Assembler
    rate: 8,
    inputHash: new Map([[38, 16], [45, 60]]),  // Steel Beam + Quickwire
    outputHash: new Map([[57, 8]])  // Stator
  },

  // Motor - Electric Motor (Alternate)
  {
    name: "Electric Motor",
    is_alt: true,
    building: 12,  // Assembler
    rate: 7.5,
    inputHash: new Map([[56, 7.5], [57, 7.5]]),  // Rotor + Stator
    outputHash: new Map([[58, 7.5]])  // Motor
  },

  // Circuit Board - Caterium Circuit Board (Alternate)
  {
    name: "Caterium Circuit Board",
    is_alt: true,
    building: 12,  // Assembler
    rate: 8.75,
    inputHash: new Map([[48, 12.5], [45, 37.5]]),  // Plastic + Quickwire
    outputHash: new Map([[59, 8.75]])  // Circuit Board
  },

  // Circuit Board - Silicon Circuit Board (Alternate)
  {
    name: "Silicon Circuit Board",
    is_alt: true,
    building: 12,  // Assembler
    rate: 12.5,
    inputHash: new Map([[42, 27.5], [44, 27.5]]),  // Copper Sheet + Silica
    outputHash: new Map([[59, 12.5]])  // Circuit Board
  },

  // Computer - Caterium Computer (Alternate)
  {
    name: "Caterium Computer",
    is_alt: true,
    building: 13,  // Manufacturer
    rate: 3.75,
    inputHash: new Map([[59, 26.25], [45, 105], [49, 45]]),  // Circuit Board + Quickwire + Rubber
    outputHash: new Map([[60, 3.75]])  // Computer
  },

  // Steel Beam - Molded Steel Pipe (Alternate)
  {
    name: "Molded Steel Pipe",
    is_alt: true,
    building: 11,  // Constructor
    rate: 30,
    inputHash: new Map([[30, 30]]),  // Steel Ingot
    outputHash: new Map([[39, 30]])  // Steel Pipe
  },

  // Copper Sheet - Steamed Copper Sheet (Alternate)
  {
    name: "Steamed Copper Sheet",
    is_alt: true,
    building: 14,  // Refinery
    rate: 22.5,
    inputHash: new Map([[29, 22.5], [10, 22.5]]),  // Copper Ingot + Water
    outputHash: new Map([[42, 22.5]])  // Copper Sheet
  },

  // Plastic - Recycled Plastic (Alternate)
  {
    name: "Recycled Plastic",
    is_alt: true,
    building: 14,  // Refinery
    rate: 60,
    inputHash: new Map([[49, 30], [19, 30]]),  // Rubber + Fuel
    outputHash: new Map([[48, 60]])  // Plastic
  },

  // Rubber - Recycled Rubber (Alternate)
  {
    name: "Recycled Rubber",
    is_alt: true,
    building: 14,  // Refinery
    rate: 60,
    inputHash: new Map([[48, 30], [19, 30]]),  // Plastic + Fuel
    outputHash: new Map([[49, 60]])  // Rubber
  }
];

// ============================================================================
// SUBSET LISTS
// ============================================================================

const ProductionBuildingList = buildings
  .map((b, idx) => b.is_production ? idx : -1)
  .filter(idx => idx !== -1);

const PowerBuildingList = buildings
  .map((b, idx) => b.is_powerplant ? idx : -1)
  .filter(idx => idx !== -1);

const ExtractionBuildingList = buildings
  .map((b, idx) => b.is_extractor ? idx : -1)
  .filter(idx => idx !== -1);

const FuelList = items
  .map((item, idx) => item.is_fuel ? idx : -1)
  .filter(idx => idx !== -1);

const FluidList = items
  .map((item, idx) => item.is_fluid ? idx : -1)
  .filter(idx => idx !== -1);

const ResourceItemList = items
  .map((item, idx) => item.is_resource ? idx : -1)
  .filter(idx => idx !== -1);

const ProductionItemList = items
  .map((item, idx) => (!item.is_resource && !item.is_fuel) ? idx : -1)
  .filter(idx => idx !== -1);

const StandardRecipeList = recipes
  .map((recipe, idx) => !recipe.is_alt ? idx : -1)
  .filter(idx => idx !== -1);

const AlternateRecipeList = recipes
  .map((recipe, idx) => recipe.is_alt ? idx : -1)
  .filter(idx => idx !== -1);

// ============================================================================
// EXPORTS
// ============================================================================

const gameData = {
  belts,
  pipes,
  items,
  buildings,
  recipes,
  ProductionBuildingList,
  PowerBuildingList,
  ExtractionBuildingList,
  FuelList,
  FluidList,
  ResourceItemList,
  ProductionItemList,
  StandardRecipeList,
  AlternateRecipeList
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = gameData;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.gameData2 = gameData;
}

})();
