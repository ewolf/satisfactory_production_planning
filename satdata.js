const CONSTS = {
// Belt and Pipe tiers
  BELT_TIERS: {
    'Mk.1': 60,
    'Mk.2': 120,
    'Mk.3': 270,
    'Mk.4': 480,
    'Mk.5': 780,
    'Mk.6': 1200
  },

  PIPE_TIERS: {
    'Mk.1': 300,
    'Mk.2': 600
  },

  // Building power consumption data (array format)
  BUILDINGS: [
    { building_id: 0, name: 'Assembler', power: 15 },
    { building_id: 1, name: 'Blender', power: 75 },
    { building_id: 2, name: 'Constructor', power: 4 },
    { building_id: 3, name: 'Foundry', power: 16 },
    { building_id: 4, name: 'Manufacturer', power: 55 },
    { building_id: 5, name: 'Miner Mk.1', power: 5, rate: 60 },
    { building_id: 6, name: 'Miner Mk.2', power: 12, rate: 120 },
    { building_id: 7, name: 'Miner Mk.3', power: 30, rate: 240 },
    { building_id: 8, name: 'Oil Extractor', power: 40, rate: 120 },
    { building_id: 9, name: 'Particle Accelerator', power: 500 },
    { building_id: 10, name: 'Quantum Encoder', power: 1000 },
    { building_id: 11, name: 'Refinery', power: 30 },
    { building_id: 12, name: 'Resource Well Extractor', power: 0, rate: 120 },
    { building_id: 13, name: 'Smelter', power: 4 },
    { building_id: 14, name: 'Water Extractor', power: 20, rate: 120 },
    { building_id: 15, name: 'Nuclear Power Plant', power: 0 },
  ],

// All items (auto-generated from recipes)
  ITEMS: [
    // Resources - Ores (indices 0-9)
    { item_id: 0, name: "Iron Ore", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 1, name: "Copper Ore", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 2, name: "Limestone", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 3, name: "Coal", is_fluid: false, is_ore: true, is_resource: true, is_fuel: true },
    { item_id: 4, name: "Caterium Ore", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 5, name: "Raw Quartz", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 6, name: "Sulfur", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 7, name: "Bauxite", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 8, name: "Uranium", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },
    { item_id: 9, name: "SAM", is_fluid: false, is_ore: true, is_resource: true, is_fuel: false },

    // Resources - Fluids (indices 10-12)
    { item_id: 10, name: "Water", is_fluid: true, is_ore: false, is_resource: true, is_fuel: false },
    { item_id: 11, name: "Crude Oil", is_fluid: true, is_ore: false, is_resource: true, is_fuel: false },
    { item_id: 12, name: "Nitrogen Gas", is_fluid: true, is_ore: false, is_resource: true, is_fuel: false },

    // Biomass Fuels (indices 13-17)
    { item_id: 13, name: "Leaves", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 14, name: "Wood", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 15, name: "Biomass", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 16, name: "Solid Biofuel", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 17, name: "Packaged Liquid Biofuel", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },

    // Intermediate Fluids (indices 18-27)
    { item_id: 18, name: "Heavy Oil Residue", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 19, name: "Fuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 20, name: "Liquid Biofuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 21, name: "Turbofuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 22, name: "Alumina Solution", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 23, name: "Sulfuric Acid", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 24, name: "Nitric Acid", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 25, name: "Dissolved Silica", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 26, name: "Rocket Fuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 27, name: "Ionized Fuel", is_fluid: true, is_ore: false, is_resource: false, is_fuel: true },

    // Basic Ingots (indices 28-32)
    { item_id: 28, name: "Iron Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 29, name: "Copper Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 30, name: "Steel Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 31, name: "Caterium Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 32, name: "Aluminum Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },

    // Basic Components (indices 33-52)
    { item_id: 33, name: "Iron Plate", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 34, name: "Iron Rod", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 35, name: "Screw", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 36, name: "Reinforced Iron Plate", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 37, name: "Concrete", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 38, name: "Steel Beam", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 39, name: "Steel Pipe", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 40, name: "Wire", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 41, name: "Cable", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 42, name: "Copper Sheet", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 43, name: "Quartz Crystal", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 44, name: "Silica", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 45, name: "Quickwire", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 46, name: "Aluminum Casing", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 47, name: "Petroleum Coke", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 48, name: "Plastic", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 49, name: "Rubber", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 50, name: "Polymer Resin", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 51, name: "Compacted Coal", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 52, name: "Aluminum Scrap", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },

    // Advanced Components (indices 53-60)
    { item_id: 53, name: "Modular Frame", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 54, name: "Encased Industrial Beam", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 55, name: "Heavy Modular Frame", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 56, name: "Rotor", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 57, name: "Stator", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 58, name: "Motor", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 59, name: "Circuit Board", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 60, name: "Computer", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 61, name: "Uranium Fuel Rod", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },

    // Advanced Components - Continued (indices 62-88)
    { item_id: 62, name: "AI Limiter", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 63, name: "Electromagnetic Control Rod", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 64, name: "Alclad Aluminum Sheet", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 65, name: "Versatile Framework", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false, is_elevator: true },
    { item_id: 66, name: "Automated Wiring", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false, is_elevator: true },
    { item_id: 67, name: "Heat Sink", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 68, name: "Empty Canister", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 69, name: "High-Speed Connector", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 70, name: "Crystal Oscillator", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 71, name: "Supercomputer", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 72, name: "Battery", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 73, name: "Adaptive Control Unit", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false, is_elevator: true },
    { item_id: 74, name: "Radio Control Unit", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 75, name: "Turbo Motor", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 76, name: "Cooling System", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 77, name: "Gas Filter", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 78, name: "Fused Modular Frame", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 79, name: "Encased Uranium Cell", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 80, name: "Magnetic Field Generator", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false, is_elevator: true },
    { item_id: 81, name: "Nuclear Pasta", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false, is_elevator: true },
    { item_id: 82, name: "Neural-Quantum Processor", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 83, name: "Superposition Oscillator", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 84, name: "AI Expansion Server", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 85, name: "Alien Power Matrix", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 86, name: "Ficsonium Fuel Rod", is_fluid: false, is_ore: false, is_resource: false, is_fuel: true },
    { item_id: 87, name: "Bad Synthetic Power Shard", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false }, 

    // Late-Game Resources (indices 89-98)
    { item_id: 88, name: "Copper Powder", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 89, name: "Pressure Conversion Cube", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 90, name: "Excited Photonic Matter", is_fluid: true, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 91, name: "SAM Fluctuator", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 92, name: "Power Shard", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 93, name: "Ficsonium", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 94, name: "Ficsite Trigon", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 95, name: "Time Crystal", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 96, name: "Dark Matter Crystal", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 97, name: "Dark Matter Residue", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 98, name: "Fabric", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },

    // Shit it missed
    { item_id: 99, name: "Smart Plating", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false, is_elevator: true },
    { item_id: 100, name: "Black Powder", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 101, name: "Modular Engine", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false, is_elevator: true },
    { item_id: 102, name: "Diamonds", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 103, name: "Ficsite Ingot", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 104, name: "Reanimated SAM", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 105, name: "Plutonium Waste", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 106, name: "Singularity Cell", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 107, name: "Uranium Cell", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 108, name: "Plutonium Fuel Rod", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 109, name: "Uranium Waste", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 110, name: "Encased Plutonium Cell", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 111, name: "Plutonium Pellet", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
    { item_id: 112, name: "Non-fissile Uranium", is_fluid: false, is_ore: false, is_resource: false, is_fuel: false },
  ],
  RECIPES: [

    // Smelter recipes
    {recipe_id:0,name:"Iron Ingot",building:"Smelter",time:2,inputs:[{item_id:0,amount:1,rate:30}],output:1,isDefault:true,outputs:[{item_id:28,rate:30,output:1}],item_id:28},
    {recipe_id:1,name:"Copper Ingot",building:"Smelter",time:2,inputs:[{item_id:1,amount:1,rate:30}],output:1,isDefault:true,outputs:[{item_id:29,rate:30,output:1}],item_id:29},
    {recipe_id:2,name:"Caterium Ingot",building:"Smelter",time:4,inputs:[{item_id:4,amount:3,rate:45}],output:1,isDefault:true,outputs:[{item_id:31,rate:15,output:1}],item_id:31},

    // Constructor recipes
    {recipe_id:3,name:"Iron Plate",building:"Constructor",time:6,inputs:[{item_id:28,amount:3,rate:30}],output:2,isDefault:true,outputs:[{item_id:33,rate:20,output:2}],item_id:33},
    {recipe_id:4,name:"Iron Rod",building:"Constructor",time:4,inputs:[{item_id:28,amount:1,rate:15}],output:1,isDefault:true,outputs:[{item_id:34,rate:15,output:1}],item_id:34},
    {recipe_id:5,name:"Screw",building:"Constructor",time:6,inputs:[{item_id:34,amount:1,rate:10}],output:4,isDefault:true,outputs:[{item_id:35,rate:40,output:4}],item_id:35},
    {recipe_id:6,name:"Wire",building:"Constructor",time:4,inputs:[{item_id:29,amount:1,rate:15}],output:2,isDefault:true,outputs:[{item_id:40,rate:30,output:2}],item_id:40},
    {recipe_id:7,name:"Cable",building:"Constructor",time:2,inputs:[{item_id:40,amount:2,rate:60}],output:1,isDefault:true,outputs:[{item_id:41,rate:30,output:1}],item_id:41},
    {recipe_id:8,name:"Concrete",building:"Constructor",time:4,inputs:[{item_id:2,amount:3,rate:45}],output:1,isDefault:true,outputs:[{item_id:37,rate:15,output:1}],item_id:37},
    {recipe_id:9,name:"Copper Sheet",building:"Constructor",time:6,inputs:[{item_id:29,amount:2,rate:20}],output:1,isDefault:true,outputs:[{item_id:42,rate:10,output:1}],item_id:42},
    {recipe_id:10,name:"Steel Beam",building:"Constructor",time:4,inputs:[{item_id:30,amount:4,rate:60}],output:1,isDefault:true,outputs:[{item_id:38,rate:15,output:1}],item_id:38},
    {recipe_id:11,name:"Steel Pipe",building:"Constructor",time:6,inputs:[{item_id:30,amount:3,rate:30}],output:2,isDefault:true,outputs:[{item_id:39,rate:20,output:2}],item_id:39},
    {recipe_id:12,name:"Quickwire",building:"Constructor",time:5,inputs:[{item_id:31,amount:1,rate:12}],output:5,isDefault:true,outputs:[{item_id:45,rate:60,output:5}],item_id:45},
    {recipe_id:13,name:"Quartz Crystal",building:"Constructor",time:8,inputs:[{item_id:5,amount:5,rate:37.5}],output:3,isDefault:true,outputs:[{item_id:43,rate:22.5,output:3}],item_id:43},
    {recipe_id:14,name:"Silica",building:"Constructor",time:8,inputs:[{item_id:5,amount:3,rate:22.5}],output:5,isDefault:true,outputs:[{item_id:44,rate:37.5,output:5}],item_id:44},
    {recipe_id:15,name:"Aluminum Casing",building:"Constructor",time:2,inputs:[{item_id:32,amount:3,rate:90}],output:2,isDefault:true,outputs:[{item_id:46,rate:60,output:2}],item_id:46},
    {recipe_id:16,name:"Empty Canister",building:"Constructor",time:4,inputs:[{item_id:48,amount:2,rate:30}],output:4,isDefault:true,outputs:[{item_id:68,rate:60,output:4}],item_id:68},

    // Foundry recipes
    {recipe_id:17,name:"Steel Ingot",building:"Foundry",time:4,inputs:[{item_id:0,amount:3,rate:45},{item_id:3,amount:3,rate:45}],output:3,isDefault:true,outputs:[{item_id:30,rate:45,output:3}],item_id:30},
    {recipe_id:18,name:"Aluminum Ingot",building:"Foundry",time:4,inputs:[{item_id:52,amount:6,rate:90},{item_id:44,amount:5,rate:75}],output:4,isDefault:true,outputs:[{item_id:32,rate:60,output:4}],item_id:32},

    // Assembler recipes
    {recipe_id:19,name:"Reinforced Iron Plate",building:"Assembler",time:12,inputs:[{item_id:33,amount:6,rate:30},{item_id:35,amount:12,rate:60}],output:1,isDefault:true,outputs:[{item_id:36,rate:5,output:1}],item_id:36},
    {recipe_id:20,name:"Modular Frame",building:"Assembler",time:60,inputs:[{item_id:36,amount:3,rate:3},{item_id:34,amount:12,rate:12}],output:2,isDefault:true,outputs:[{item_id:53,rate:2,output:2}],item_id:53},
    {recipe_id:21,name:"Rotor",building:"Assembler",time:15,inputs:[{item_id:34,amount:5,rate:20},{item_id:35,amount:25,rate:100}],output:1,isDefault:true,outputs:[{item_id:56,rate:4,output:1}],item_id:56},
    {recipe_id:22,name:"Stator",building:"Assembler",time:12,inputs:[{item_id:39,amount:3,rate:15},{item_id:40,amount:8,rate:40}],output:1,isDefault:true,outputs:[{item_id:57,rate:5,output:1}],item_id:57},
    {recipe_id:23,name:"Motor",building:"Assembler",time:12,inputs:[{item_id:56,amount:2,rate:10},{item_id:57,amount:2,rate:10}],output:1,isDefault:true,outputs:[{item_id:58,rate:5,output:1}],item_id:58},
    {recipe_id:24,name:"Circuit Board",building:"Assembler",time:8,inputs:[{item_id:42,amount:2,rate:15},{item_id:48,amount:4,rate:30}],output:1,isDefault:true,outputs:[{item_id:59,rate:7.5,output:1}],item_id:59},
    {recipe_id:25,name:"AI Limiter",building:"Assembler",time:12,inputs:[{item_id:42,amount:5,rate:25},{item_id:45,amount:20,rate:100}],output:1,isDefault:true,outputs:[{item_id:62,rate:5,output:1}],item_id:62},
    {recipe_id:26,name:"Encased Industrial Beam",building:"Assembler",time:10,inputs:[{item_id:38,amount:3,rate:18},{item_id:37,amount:6,rate:36}],output:1,isDefault:true,outputs:[{item_id:54,rate:6,output:1}],item_id:54},
    {recipe_id:27,name:"Heat Sink",building:"Assembler",time:8,inputs:[{item_id:64,amount:5,rate:37.5},{item_id:42,amount:3,rate:22.5}],output:1,isDefault:true,outputs:[{item_id:67,rate:7.5,output:1}],item_id:67},
    {recipe_id:28,name:"Alclad Aluminum Sheet",building:"Assembler",time:6,inputs:[{item_id:32,amount:3,rate:30},{item_id:29,amount:1,rate:10}],output:3,isDefault:true,outputs:[{item_id:64,rate:30,output:3}],item_id:64},
    {recipe_id:29,name:"Electromagnetic Control Rod",building:"Assembler",time:30,inputs:[{item_id:57,amount:3,rate:6},{item_id:62,amount:2,rate:4}],output:2,isDefault:true,outputs:[{item_id:63,rate:4,output:2}],item_id:63},
    {recipe_id:30,name:"Smart Plating",building:"Assembler",time:30,inputs:[{item_id:36,amount:1,rate:2},{item_id:56,amount:1,rate:2}],output:1,isDefault:true,outputs:[{"object_id": 99, rate:2,item_id:99,output:1}]},
    {recipe_id:31,name:"Versatile Framework",building:"Assembler",time:24,inputs:[{item_id:53,amount:1,rate:2.5},{item_id:38,amount:12,rate:30}],output:2,isDefault:true,outputs:[{item_id:65,rate:5,output:2}],item_id:65},
    {recipe_id:32,name:"Automated Wiring",building:"Assembler",time:24,inputs:[{item_id:57,amount:1,rate:2.5},{item_id:41,amount:20,rate:50}],output:1,isDefault:true,outputs:[{item_id:66,rate:2.5,output:1}],item_id:66},
    {recipe_id:33,name:"Black Powder",building:"Assembler",time:4,inputs:[{item_id:3,amount:1,rate:15},{item_id:6,amount:1,rate:15}],output:2,isDefault:true,outputs:[{item_id: 100, rate:30,output:2}]},
    {recipe_id:34,name:"Magnetic Field Generator",building:"Assembler",time:120,inputs:[{item_id:65,amount:5,rate:2.5},{item_id:63,amount:2,rate:1}],output:2,isDefault:true,outputs:[{item_id:80,rate:1,output:2}],item_id:80},

    // Refinery recipes
    {recipe_id:35,name:"Plastic",building:"Refinery",time:6,inputs:[{item_id:11,amount:3,rate:30}],output:2,isDefault:true,outputs:[{item_id:48,rate:20,output:2},{item_id:18,output:1,rate:10}],item_id:48},
    {recipe_id:36,name:"Rubber",building:"Refinery",time:6,inputs:[{item_id:11,amount:3,rate:30}],output:2,isDefault:true,outputs:[{item_id:49,rate:20,output:2},{item_id:18,output:1,rate:20}],item_id:49},
    {recipe_id:37,name:"Fuel",building:"Refinery",time:6,inputs:[{item_id:11,amount:6,rate:60}],output:4,isDefault:true,outputs:[{item_id:19,rate:40,output:4}],item_id:19},
    {recipe_id:38,name:"Petroleum Coke",building:"Refinery",time:6,inputs:[{item_id:18,amount:4,rate:40}],output:12,isDefault:true,outputs:[{item_id:47,rate:120,output:12}],item_id:47},
    {recipe_id:39,name:"Alumina Solution",building:"Refinery",time:6,inputs:[{item_id:7,amount:12,rate:120},{item_id:10,amount:18,rate:180}],output:12,isDefault:true,outputs:[{item_id:22,rate:120,output:12}],item_id:22},
    {recipe_id:40,name:"Aluminum Scrap",building:"Refinery",time:1,inputs:[{item_id:22,amount:4,rate:240},{item_id:3,amount:2,rate:120}],output:6,isDefault:true,outputs:[{item_id:52,rate:360,output:6}],item_id:52},
    {recipe_id:41,name:"Sulfuric Acid",building:"Refinery",time:6,inputs:[{item_id:6,amount:5,rate:50},{item_id:10,amount:5,rate:50}],output:5,isDefault:true,outputs:[{item_id:23,rate:50,output:5}],item_id:23},

    // Manufacturer recipes
    {recipe_id:42,name:"Heavy Modular Frame",building:"Manufacturer",time:30,inputs:[{item_id:53,amount:5,rate:10},{item_id:39,amount:15,rate:30},{item_id:54,amount:5,rate:10},{item_id:35,amount:90,rate:180}],output:1,isDefault:true,outputs:[{item_id:55,rate:2,output:1}],item_id:55},
    {recipe_id:43,name:"Computer",building:"Manufacturer",time:24,inputs:[{item_id:59,amount:10,rate:25},{item_id:41,amount:9,rate:22.5},{item_id:48,amount:18,rate:45},{item_id:35,amount:52,rate:130}],output:1,isDefault:true,outputs:[{item_id:60,rate:2.5,output:1}],item_id:60},
    {recipe_id:44,name:"Supercomputer",building:"Manufacturer",time:32,inputs:[{item_id:60,amount:2,rate:3.75},{item_id:62,amount:2,rate:3.75},{item_id:69,amount:3,rate:5.625},{item_id:48,amount:28,rate:52.5}],output:1,isDefault:true,outputs:[{item_id:71,rate:1.875,output:1}],item_id:71},
    {recipe_id:45,name:"High-Speed Connector",building:"Manufacturer",time:16,inputs:[{item_id:45,amount:56,rate:210},{item_id:41,amount:10,rate:37.5},{item_id:59,amount:1,rate:3.75}],output:1,isDefault:true,outputs:[{item_id:69,rate:3.75,output:1}],item_id:69},
    {recipe_id:46,name:"Crystal Oscillator",building:"Manufacturer",time:120,inputs:[{item_id:43,amount:36,rate:18},{item_id:41,amount:28,rate:14},{item_id:36,amount:5,rate:2.5}],output:2,isDefault:true,outputs:[{item_id:70,rate:1,output:2}],item_id:70},
    {recipe_id:47,name:"Adaptive Control Unit",building:"Manufacturer",time:120,inputs:[{item_id:66,amount:15,rate:7.5},{item_id:59,amount:10,rate:5},{item_id:55,amount:2,rate:1},{item_id:60,amount:2,rate:1}],output:2,isDefault:true,outputs:[{item_id:73,rate:1,output:2}],item_id:73},
    {recipe_id:48,name:"Modular Engine",building:"Manufacturer",time:60,inputs:[{item_id:58,amount:2,rate:2},{item_id:49,amount:15,rate:15},{item_id:99, amount:2,rate:2}],output:1,isDefault:true,outputs:[{item_id:101,rate:1,output:1}]},
    {recipe_id:49,name:"Radio Control Unit",building:"Manufacturer",time:48,inputs:[{item_id:46,amount:32,rate:40},{item_id:70,amount:1,rate:1.25},{item_id:60,amount:1,rate:1.25}],output:2,isDefault:true,outputs:[{item_id:74,rate:2.5,output:2}],item_id:74},
    {recipe_id:50,name:"Turbo Motor",building:"Manufacturer",time:32,inputs:[{item_id:76,amount:4,rate:7.5},{item_id:74,amount:2,rate:3.75},{item_id:58,amount:4,rate:7.5},{item_id:49,amount:24,rate:45}],output:1,isDefault:true,outputs:[{item_id:75,rate:1.875,output:1}],item_id:75},
    {recipe_id:51,name:"Gas Filter",building:"Manufacturer",time:8,inputs:[{item_id:3,amount:5,rate:37.5},{item_id:49,amount:2,rate:15},{item_id:98,amount:2,rate:15}],output:1,isDefault:true,outputs:[{item_id:77,rate:7.5,output:1}],item_id:77},

    // Blender recipes
    {recipe_id:52,name:"Cooling System",building:"Blender",time:10,inputs:[{item_id:67,amount:2,rate:12},{item_id:49,amount:2,rate:12},{item_id:10,amount:5,rate:30},{item_id:12,amount:25,rate:150}],output:1,isDefault:true,outputs:[{item_id:76,rate:6,output:1}],item_id:76},
    {recipe_id:53,name:"Fused Modular Frame",building:"Blender",time:40,inputs:[{item_id:55,amount:1,rate:1.5},{item_id:46,amount:50,rate:75},{item_id:12,amount:25,rate:37.5}],output:1,isDefault:true,outputs:[{item_id:78,rate:1.5,output:1}],item_id:78},
    {recipe_id:54,name:"Battery",building:"Blender",time:3,inputs:[{item_id:23,amount:2.5,rate:50},{item_id:22,amount:2,rate:40},{item_id:46,amount:1,rate:20}],output:1,isDefault:true,outputs:[{item_id:72,rate:20,output:1}],item_id:72},
    {recipe_id:55,name:"Encased Uranium Cell",building:"Blender",time:12,inputs:[{item_id:8,amount:10,rate:50},{item_id:37,amount:3,rate:15},{item_id:23,amount:8,rate:40}],output:5,isDefault:true,outputs:[{item_id:79,rate:25,output:5}],item_id:79},

    // Particle Accelerator recipes
    {recipe_id:56,name:"Nuclear Pasta",building:"Particle Accelerator",time:120,inputs:[{item_id:88,amount:200,rate:100},{item_id:89,amount:1,rate:0.5}],output:1,isDefault:true,outputs:[{item_id:81,rate:0.5,output:1}],item_id:81},

    // Quantumn Encoer recipes
    {recipe_id:57,name:"AI Expansion Server",building:"Quantum Encoder",time:15,inputs:[{item_id:80,amount:1,rate:4},{item_id:82,amount:1,rate:4},{item_id:83,amount:1,rate:4},{item_id:90,amount:25,rate:100}],output:1,isDefault:true,outputs:[{item_id:84,rate:4,output:1},{item_id:97,rate:100,output:25}],item_id:84},
    {recipe_id:58,name:"Alien Power Matrix",building:"Quantum Encoder",time:24,inputs:[{item_id:91,amount:5,rate:12.5},{item_id:92,amount:3,rate:7.5},{item_id:83,amount:3,rate:7.5},{item_id:90,amount:24,rate:60}],output:1,isDefault:true,outputs:[{item_id:85,rate:2.5,output:1},{item_id:97,rate:60,output:24}],item_id:85},
    {recipe_id:59,name:"Ficsonium Fuel Rod",building:"Quantum Encoder",time:24,inputs:[{item_id:93,amount:2,rate:5},{item_id:63,amount:2,rate:5},{item_id:94,amount:40,rate:100},{item_id:90,amount:20,rate:50}],output:1,isDefault:true,outputs:[{item_id:86,rate:2.5,output:1},{item_id:97,rate:50,output:20}],item_id:86},
    {recipe_id:60,name:"Neural-Quantum Processor",building:"Quantum Encoder",time:20,inputs:[{item_id:95,amount:5,rate:15},{item_id:71,amount:1,rate:3},{item_id:94,amount:15,rate:45},{item_id:90,amount:25,rate:75}],output:1,isDefault:true,outputs:[{item_id:82,rate:3,output:1},{item_id:97,rate:125,output:25}],item_id:82},
    {recipe_id:61,name:"Superposition Oscillator",building:"Quantum Encoder",time:12,inputs:[{item_id:96,amount:6,rate:30},{item_id:70,amount:1,rate:5},{item_id:64,amount:9,rate:45},{item_id:90,amount:25,rate:125}],output:1,isDefault:true,outputs:[{item_id:83,rate:5,output:1},{item_id:97,rate:125,output:25}],item_id:83},
    {recipe_id:62,name:"Synthetic Power Shard",building:"Quantum Encoder",time:12,inputs:[{item_id:95,amount:2,rate:10},{item_id:96,amount:2,rate:10},{item_id:43,amount:12,rate:60},{item_id:90,amount:12,rate:60}],output:1,isDefault:true,outputs:[{item_id:92,rate:5,output:1},{item_id:97,rate:60,output:12}],item_id:92},

    // Alternate recipes
    {recipe_id:63,name:"Alternate: Iron Wire",building:"Constructor",time:24,inputs:[{item_id:28,amount:5,rate:12.5}],output:9,isDefault:false,"replaces":"Wire",outputs:[{item_id:40,rate:22.5,output:9}],item_id:40},
    {recipe_id:64,name:"Alternate: Cast Screw",building:"Constructor",time:24,inputs:[{item_id:28,amount:5,rate:12.5}],output:20,isDefault:false,"replaces":"Screw",outputs:[{item_id:35,rate:50,output:20}],item_id:35},
    {recipe_id:65,name:"Alternate: Steel Rod",building:"Constructor",time:5,inputs:[{item_id:30,amount:1,rate:12}],output:4,isDefault:false,"replaces":"Iron Rod",outputs:[{item_id:34,rate:48,output:4}],item_id:34},
    {recipe_id:66,name:"Alternate: Aluminum Rod",building:"Constructor",time:8,inputs:[{item_id:32,amount:1,rate:7.5}],output:7,isDefault:false,"replaces":"Iron Rod",outputs:[{item_id:34,rate:52.5,output:7}],item_id:34},
    {recipe_id:67,name:"Alternate: Caterium Wire",building:"Constructor",time:4,inputs:[{item_id:31,amount:1,rate:15}],output:8,isDefault:false,"replaces":"Wire",outputs:[{item_id:40,rate:120,output:8}],item_id:40},
    {recipe_id:68,name:"Alternate: Charcoal",building:"Constructor",time:4,inputs:[{item_id:14,amount:1,rate:15}],output:10,isDefault:false,"replaces":"Coal",outputs:[{item_id:3,rate:150,output:10}],item_id:3},
    {recipe_id:69,name:"Alternate: Steel Canister",building:"Constructor",time:6,inputs:[{item_id:30,amount:4,rate:40}],output:4,isDefault:false,"replaces":"Empty Canister",outputs:[{item_id:68,rate:40,output:4}],item_id:68},
    {recipe_id:70,name:"Alternate: Aluminum Beam",building:"Constructor",time:8,inputs:[{item_id:32,amount:3,rate:22.5}],output:3,isDefault:false,"replaces":"Steel Beam",outputs:[{item_id:38,rate:22.5,output:3}],item_id:38},
    {recipe_id:71,name:"Alternate: Iron Pipe",building:"Constructor",time:12,inputs:[{item_id:28,amount:20,rate:100}],output:5,isDefault:false,"replaces":"Steel Pipe",outputs:[{item_id:39,rate:25,output:5}],item_id:39},
    {recipe_id:72,name:"Alternate: Adhered Iron Plate",building:"Assembler",time:16,inputs:[{item_id:33,amount:3,rate:11.25},{item_id:49,amount:1,rate:3.75}],output:1,isDefault:false,"replaces":"Reinforced Iron Plate",outputs:[{item_id:36,rate:3.75,output:1}],item_id:36},
    {recipe_id:73,name:"Alternate: Bolted Frame",building:"Assembler",time:24,inputs:[{item_id:36,amount:3,rate:7.5},{item_id:35,amount:56,rate:140}],output:2,isDefault:false,"replaces":"Modular Frame",outputs:[{item_id:53,rate:5,output:2}],item_id:53},
    {recipe_id:74,name:"Alternate: Bolted Iron Plate",building:"Assembler",time:12,inputs:[{item_id:33,amount:18,rate:90},{item_id:35,amount:50,rate:250}],output:3,isDefault:false,"replaces":"Reinforced Iron Plate",outputs:[{item_id:36,rate:15,output:3}],item_id:36},
    {recipe_id:75,name:"Alternate: Cheap Silica",building:"Assembler",time:8,inputs:[{item_id:5,amount:3,rate:22.5},{item_id:2,amount:5,rate:37.5}],output:7,isDefault:false,"replaces":"Silica",outputs:[{item_id:44,rate:52.5,output:7}],item_id:44},
    {recipe_id:76,name:"Alternate: Coated Cable",building:"Assembler",time:8,inputs:[{item_id:40,amount:5,rate:37.5},{item_id:18,amount:2,rate:15}],output:9,isDefault:false,"replaces":"Cable",outputs:[{item_id:41,rate:67.5,output:9}],item_id:41},
    {recipe_id:77,name:"Alternate: Coated Iron Canister",building:"Assembler",time:4,inputs:[{item_id:33,amount:2,rate:30},{item_id:42,amount:1,rate:15}],output:4,isDefault:false,"replaces":"Empty Canister",outputs:[{item_id:68,rate:60,output:4}],item_id:68},
    {recipe_id:78,name:"Alternate: Coated Iron Plate",building:"Assembler",time:8,inputs:[{item_id:28,amount:5,rate:37.5},{item_id:48,amount:1,rate:7.5}],output:10,isDefault:false,"replaces":"Iron Plate",outputs:[{item_id:33,rate:75,output:10}],item_id:33},
    {recipe_id:79,name:"Alternate: Copper Rotor",building:"Assembler",time:16,inputs:[{item_id:42,amount:6,rate:22.5},{item_id:35,amount:52,rate:195}],output:3,isDefault:false,"replaces":"Rotor",outputs:[{item_id:56,rate:11.25,output:3}],item_id:56},
    {recipe_id:80,name:"Alternate: Electrode Circuit Board",building:"Assembler",time:12,inputs:[{item_id:49,amount:4,rate:20},{item_id:47,amount:8,rate:40}],output:1,isDefault:false,"replaces":"Circuit Board",outputs:[{item_id:59,rate:5,output:1}],item_id:59},
    {recipe_id:81,name:"Alternate: Electric Motor",building:"Assembler",time:16,inputs:[{item_id:63,amount:1,rate:3.75},{item_id:56,amount:2,rate:7.5}],output:2,isDefault:false,"replaces":"Motor",outputs:[{item_id:58,rate:7.5,output:2}],item_id:58},
    {recipe_id:82,name:"Alternate: Electromagnetic Connection Rod",building:"Assembler",time:15,inputs:[{item_id:57,amount:2,rate:8},{item_id:69,amount:1,rate:4}],output:2,isDefault:false,"replaces":"Electromagnetic Control Rod",outputs:[{item_id:63,rate:8,output:2}],item_id:63},
    {recipe_id:83,name:"Alternate: Encased Industrial Pipe",building:"Assembler",time:15,inputs:[{item_id:39,amount:6,rate:24},{item_id:37,amount:5,rate:20}],output:1,isDefault:false,"replaces":"Encased Industrial Beam",outputs:[{item_id:54,rate:4,output:1}],item_id:54},
    {recipe_id:84,name:"Alternate: Fine Black Powder",building:"Assembler",time:8,inputs:[{item_id:6,amount:1,rate:7.5},{item_id:51,amount:2,rate:15}],output:6,isDefault:false,"replaces":"Black Powder",outputs:[{item_id:100,rate:45,output:6}]},
    {recipe_id:85,name:"Alternate: Fine Concrete",building:"Assembler",time:12,inputs:[{item_id:44,amount:3,rate:15},{item_id:2,amount:12,rate:60}],output:10,isDefault:false,"replaces":"Concrete",outputs:[{item_id:37,rate:50,output:10}],item_id:37},
    {recipe_id:86,name:"Alternate: Fused Quickwire",building:"Assembler",time:8,inputs:[{item_id:31,amount:1,rate:7.5},{item_id:29,amount:5,rate:37.5}],output:12,isDefault:false,"replaces":"Quickwire",outputs:[{item_id:45,rate:90,output:12}],item_id:45},
    {recipe_id:87,name:"Alternate: Fused Wire",building:"Assembler",time:20,inputs:[{item_id:29,amount:4,rate:12},{item_id:31,amount:1,rate:3}],output:30,isDefault:false,"replaces":"Wire",outputs:[{item_id:40,rate:90,output:30}],item_id:40},
    {recipe_id:88,name:"Alternate: Insulated Cable",building:"Assembler",time:12,inputs:[{item_id:40,amount:9,rate:45},{item_id:49,amount:6,rate:30}],output:20,isDefault:false,"replaces":"Cable",outputs:[{item_id:41,rate:100,output:20}],item_id:41},
    {recipe_id:89,name:"Alternate: Plastic AI Limiter",building:"Assembler",time:15,inputs:[{item_id:45,amount:30,rate:120},{item_id:48,amount:7,rate:28}],output:2,isDefault:false,"replaces":"AI Limiter",outputs:[{item_id:62,rate:8,output:2}],item_id:62},
    {recipe_id:90,name:"Alternate: Quickwire Cable",building:"Assembler",time:24,inputs:[{item_id:45,amount:3,rate:7.5},{item_id:49,amount:2,rate:5}],output:11,isDefault:false,"replaces":"Cable",outputs:[{item_id:41,rate:27.5,output:11}],item_id:41},
    {recipe_id:91,name:"Alternate: Quickwire Stator",building:"Assembler",time:15,inputs:[{item_id:39,amount:4,rate:16},{item_id:45,amount:15,rate:60}],output:2,isDefault:false,"replaces":"Stator",outputs:[{item_id:57,rate:8,output:2}],item_id:57},
    {recipe_id:92,name:"Alternate: Rubber Concrete",building:"Assembler",time:6,inputs:[{item_id:2,amount:10,rate:100},{item_id:49,amount:2,rate:20}],output:9,isDefault:false,"replaces":"Concrete",outputs:[{item_id:37,rate:90,output:9}],item_id:37},
    {recipe_id:93,name:"Alternate: Silicon Circuit Board",building:"Assembler",time:24,inputs:[{item_id:42,amount:11,rate:27.5},{item_id:44,amount:11,rate:27.5}],output:5,isDefault:false,"replaces":"Circuit Board",outputs:[{item_id:59,rate:12.5,output:5}],item_id:59},
    {recipe_id:94,name:"Alternate: Stitched Iron Plate",building:"Assembler",time:32,inputs:[{item_id:33,amount:10,rate:18.75},{item_id:40,amount:20,rate:37.5}],output:3,isDefault:false,"replaces":"Reinforced Iron Plate",outputs:[{item_id:36,rate:5.625,output:3}],item_id:36},
    {recipe_id:95,name:"Alternate: Steel Rotor",building:"Assembler",time:12,inputs:[{item_id:39,amount:2,rate:10},{item_id:40,amount:6,rate:30}],output:1,isDefault:false,"replaces":"Rotor",outputs:[{item_id:56,rate:5,output:1}],item_id:56},
    {recipe_id:96,name:"Alternate: Steeled Frame",building:"Assembler",time:60,inputs:[{item_id:36,amount:2,rate:2},{item_id:39,amount:10,rate:10}],output:3,isDefault:false,"replaces":"Modular Frame",outputs:[{item_id:53,rate:3,output:3}],item_id:53},
    {recipe_id:97,name:"Alternate: Alclad Casing",building:"Assembler",time:8,inputs:[{item_id:32,amount:20,rate:150},{item_id:29,amount:10,rate:75}],output:15,isDefault:false,"replaces":"Aluminum Casing",outputs:[{item_id:46,rate:112.5,output:15}],item_id:46},
    {recipe_id:98,name:"Alternate: Heat Exchanger",building:"Assembler",time:6,inputs:[{item_id:46,amount:3,rate:30},{item_id:49,amount:3,rate:30}],output:1,isDefault:false,"replaces":"Heat Sink",outputs:[{item_id:67,rate:10,output:1}],item_id:67},
    {recipe_id:99,name:"Alternate: Caterium Circuit Board",building:"Assembler",time:48,inputs:[{item_id:48,amount:10,rate:12.5},{item_id:45,amount:30,rate:37.5}],output:7,isDefault:false,"replaces":"Circuit Board",outputs:[{item_id:59,rate:8.75,output:7}],item_id:59},
    {recipe_id:100,name:"Alternate: Compacted Coal",building:"Assembler",time:12,inputs:[{item_id:3,amount:5,rate:25},{item_id:6,amount:5,rate:25}],output:5,isDefault:false,item_id:51,"replaces":"Compacted Coal",outputs:[{item_id:51,rate:25,output:5}]},
    {recipe_id:101,name:"Alternate: Automated Speed Wiring",building:"Manufacturer",time:32,inputs:[{item_id:57,amount:2,rate:3.75},{item_id:40,amount:40,rate:75},{item_id:69,amount:1,rate:1.875}],output:4,isDefault:false,"replaces":"Automated Wiring",outputs:[{item_id:66,rate:7.5,output:4}],item_id:66},
    {recipe_id:102,name:"Alternate: Caterium Computer",building:"Manufacturer",time:16,inputs:[{item_id:59,amount:4,rate:15},{item_id:45,amount:14,rate:52.5},{item_id:49,amount:6,rate:22.5}],output:1,isDefault:false,"replaces":"Computer",outputs:[{item_id:60,rate:3.75,output:1}],item_id:60},
    {recipe_id:103,name:"Alternate: Classic Battery",building:"Manufacturer",time:8,inputs:[{item_id:6,amount:6,rate:45},{item_id:64,amount:7,rate:52.5},{item_id:48,amount:8,rate:60},{item_id:40,amount:12,rate:90}],output:4,isDefault:false,"replaces":"Battery",outputs:[{item_id:72,rate:30,output:4}],item_id:72},
    {recipe_id:104,name:"Alternate: Crystal Computer",building:"Manufacturer",time:64,inputs:[{item_id:59,amount:8,rate:7.5},{item_id:70,amount:3,rate:2.8125}],output:3,isDefault:false,"replaces":"Computer",outputs:[{item_id:60,rate:2.8125,output:3}],item_id:60},
    {recipe_id:105,name:"Alternate: Flexible Framework",building:"Manufacturer",time:16,inputs:[{item_id:53,amount:1,rate:3.75},{item_id:38,amount:6,rate:22.5},{item_id:49,amount:8,rate:30}],output:2,isDefault:false,"replaces":"Versatile Framework",outputs:[{item_id:65,rate:7.5,output:2}],item_id:65},
    {recipe_id:106,name:"Alternate: Heavy Encased Frame",building:"Manufacturer",time:64,inputs:[{item_id:53,amount:8,rate:7.5},{item_id:54,amount:10,rate:9.375},{item_id:39,amount:36,rate:33.75},{item_id:37,amount:22,rate:20.625}],output:3,isDefault:false,"replaces":"Heavy Modular Frame",outputs:[{item_id:55,rate:2.8125,output:3}],item_id:55},
    {recipe_id:107,name:"Alternate: Heavy Flexible Frame",building:"Manufacturer",time:16,inputs:[{item_id:53,amount:5,rate:18.75},{item_id:54,amount:3,rate:11.25},{item_id:49,amount:20,rate:75},{item_id:35,amount:104,rate:390}],output:1,isDefault:false,"replaces":"Heavy Modular Frame",outputs:[{item_id:55,rate:3.75,output:1}],item_id:55},
    {recipe_id:108,name:"Alternate: Infused Uranium Cell",building:"Manufacturer",time:12,inputs:[{item_id:8,amount:5,rate:25},{item_id:44,amount:3,rate:15},{item_id:6,amount:5,rate:25},{item_id:45,amount:15,rate:75}],output:4,isDefault:false,"replaces":"Encased Uranium Cell",outputs:[{item_id:79,rate:20,output:4}],item_id:79},
    {recipe_id:109,name:"Alternate: Insulated Crystal Oscillator",building:"Manufacturer",time:32,inputs:[{item_id:43,amount:10,rate:18.75},{item_id:49,amount:7,rate:13.125},{item_id:62,amount:1,rate:1.875}],output:1,isDefault:false,"replaces":"Crystal Oscillator",outputs:[{item_id:70,rate:1.875,output:1}],item_id:70},
    {recipe_id:110,name:"Alternate: OC Supercomputer",building:"Manufacturer",time:20,inputs:[{item_id:74,amount:2,rate:6},{item_id:76,amount:2,rate:6}],output:1,isDefault:false,"replaces":"Supercomputer",outputs:[{item_id:71,rate:3,output:1}],item_id:71},
    {recipe_id:111,name:"Alternate: Radio Connection Unit",building:"Manufacturer",time:16,inputs:[{item_id:67,amount:4,rate:15},{item_id:69,amount:2,rate:7.5},{item_id:43,amount:12,rate:45}],output:1,isDefault:false,"replaces":"Radio Control Unit",outputs:[{item_id:74,rate:3.75,output:1}],item_id:74},
    {recipe_id:112,name:"Alternate: Radio Control System",building:"Manufacturer",time:40,inputs:[{item_id:70,amount:1,rate:1.5},{item_id:59,amount:10,rate:15},{item_id:46,amount:60,rate:90},{item_id:49,amount:30,rate:45}],output:3,isDefault:false,"replaces":"Radio Control Unit",outputs:[{item_id:74,rate:4.5,output:3}],item_id:74},
    {recipe_id:113,name:"Alternate: Rigor Motor",building:"Manufacturer",time:48,inputs:[{item_id:56,amount:3,rate:3.75},{item_id:57,amount:3,rate:3.75},{item_id:70,amount:1,rate:1.25}],output:6,isDefault:false,"replaces":"Motor",outputs:[{item_id:58,rate:7.5,output:6}],item_id:58},
    {recipe_id:114,name:"Alternate: Super-State Computer",building:"Manufacturer",time:25,inputs:[{item_id:60,amount:3,rate:7.199999999999999},{item_id:63,amount:1,rate:2.4},{item_id:72,amount:10,rate:24},{item_id:40,amount:25,rate:60}],output:1,isDefault:false,"replaces":"Supercomputer",outputs:[{item_id:71,rate:2.4,output:1}],item_id:71},
    {recipe_id:115,name:"Alternate: Turbo Electric Motor",building:"Manufacturer",time:64,inputs:[{item_id:58,amount:7,rate:6.5625},{item_id:74,amount:9,rate:8.4375},{item_id:63,amount:5,rate:4.6875},{item_id:56,amount:7,rate:6.5625}],output:3,isDefault:false,"replaces":"Turbo Motor",outputs:[{item_id:75,rate:2.8125,output:3}],item_id:75},
    {recipe_id:116,name:"Alternate: Plastic Smart Plating",building:"Manufacturer",time:24,inputs:[{item_id:36,amount:1,rate:2.5},{item_id:56,amount:1,rate:2.5},{item_id:48,amount:3,rate:7.5}],output:2,isDefault:false,"replaces":"Smart Plating",outputs:[{item_id:99,rate:5,output:2}]},
    {recipe_id:117,name:"Alternate: Silicon High-Speed Connector",building:"Manufacturer",time:40,inputs:[{item_id:45,amount:60,rate:90},{item_id:44,amount:25,rate:37.5},{item_id:59,amount:2,rate:3}],output:2,isDefault:false,"replaces":"High-Speed Connector",outputs:[{item_id:69,rate:3,output:2}],item_id:69},
    {recipe_id:118,name:"Alternate: Basic Iron Ingot",building:"Foundry",time:12,inputs:[{item_id:0,amount:5,rate:25},{item_id:2,amount:8,rate:40}],output:10,isDefault:false,"replaces":"Iron Ingot",outputs:[{item_id:28,rate:50,output:10}],item_id:28},
    {recipe_id:119,name:"Alternate: Coke Steel Ingot",building:"Foundry",time:12,inputs:[{item_id:0,amount:15,rate:75},{item_id:47,amount:15,rate:75}],output:20,isDefault:false,"replaces":"Steel Ingot",outputs:[{item_id:30,rate:100,output:20}],item_id:30},
    {recipe_id:120,name:"Alternate: Compacted Steel Ingot",building:"Foundry",time:24,inputs:[{item_id:0,amount:2,rate:5},{item_id:51,amount:1,rate:2.5}],output:4,isDefault:false,"replaces":"Steel Ingot",outputs:[{item_id:30,rate:10,output:4}],item_id:30},
    {recipe_id:121,name:"Alternate: Copper Alloy Ingot",building:"Foundry",time:6,inputs:[{item_id:1,amount:5,rate:50},{item_id:0,amount:5,rate:50}],output:10,isDefault:false,"replaces":"Copper Ingot",outputs:[{item_id:29,rate:100,output:10}],item_id:29},
    {recipe_id:122,name:"Alternate: Fused Quartz Crystal",building:"Foundry",time:20,inputs:[{item_id:5,amount:25,rate:75},{item_id:3,amount:12,rate:36}],output:18,isDefault:false,"replaces":"Quartz Crystal",outputs:[{item_id:43,rate:54,output:18}],item_id:43},
    {recipe_id:123,name:"Alternate: Iron Alloy Ingot",building:"Foundry",time:12,inputs:[{item_id:0,amount:8,rate:40},{item_id:1,amount:2,rate:10}],output:15,isDefault:false,"replaces":"Iron Ingot",outputs:[{item_id:28,rate:75,output:15}],item_id:28},
    {recipe_id:124,name:"Alternate: Molded Beam",building:"Foundry",time:12,inputs:[{item_id:30,amount:24,rate:120},{item_id:37,amount:16,rate:80}],output:9,isDefault:false,"replaces":"Steel Beam",outputs:[{item_id:38,rate:45,output:9}],item_id:38},
    {recipe_id:125,name:"Alternate: Molded Steel Pipe",building:"Foundry",time:6,inputs:[{item_id:30,amount:5,rate:50},{item_id:37,amount:3,rate:30}],output:5,isDefault:false,"replaces":"Steel Pipe",outputs:[{item_id:39,rate:50,output:5}],item_id:39},
    {recipe_id:126,name:"Alternate: Solid Steel Ingot",building:"Foundry",time:3,inputs:[{item_id:28,amount:2,rate:40},{item_id:3,amount:2,rate:40}],output:3,isDefault:false,"replaces":"Steel Ingot",outputs:[{item_id:30,rate:60,output:3}],item_id:30},
    {recipe_id:127,name:"Alternate: Steel Cast Plate",building:"Foundry",time:4,inputs:[{item_id:28,amount:1,rate:15},{item_id:30,amount:1,rate:15}],output:3,isDefault:false,"replaces":"Iron Plate",outputs:[{item_id:33,rate:45,output:3}],item_id:33},
    {recipe_id:128,name:"Alternate: Tempered Caterium Ingot",building:"Foundry",time:8,inputs:[{item_id:4,amount:6,rate:45},{item_id:47,amount:2,rate:15}],output:3,isDefault:false,"replaces":"Caterium Ingot",outputs:[{item_id:31,rate:22.5,output:3}],item_id:31},
    {recipe_id:129,name:"Alternate: Tempered Copper Ingot",building:"Foundry",time:12,inputs:[{item_id:1,amount:5,rate:25},{item_id:47,amount:8,rate:40}],output:12,isDefault:false,"replaces":"Copper Ingot",outputs:[{item_id:29,rate:60,output:12}],item_id:29},
    {recipe_id:130,name:"Alternate: Diluted Packaged Fuel",building:"Refinery",time:2,inputs:[{item_id:18,amount:1,rate:30},{amount:2,rate:60}],output:2,isDefault:false,"replaces":"Fuel",outputs:[{item_id:19,rate:60,output:2}],item_id:19},
    {recipe_id:131,name:"Alternate: Electrode Aluminum Scrap",building:"Refinery",time:4,inputs:[{item_id:22,amount:12,rate:180},{item_id:47,amount:4,rate:60}],output:20,isDefault:false,"replaces":"Aluminum Scrap",outputs:[{item_id:52,rate:300,output:20}],item_id:52},
    {recipe_id:132,name:"Alternate: Heavy Oil Residue",building:"Refinery",time:6,inputs:[{item_id:11,amount:3,rate:30}],output:4,isDefault:false,"replaces":"Heavy Oil Residue",outputs:[{item_id:18,rate:40,output:4}],item_id:18},
    {recipe_id:133,name:"Alternate: Leached Caterium Ingot",building:"Refinery",time:10,inputs:[{item_id:4,amount:9,rate:54},{item_id:23,amount:5,rate:30}],output:6,isDefault:false,"replaces":"Caterium Ingot",outputs:[{item_id:31,rate:36,output:6}],item_id:31},
    {recipe_id:134,name:"Alternate: Leached Copper Ingot",building:"Refinery",time:12,inputs:[{item_id:1,amount:9,rate:45},{item_id:23,amount:5,rate:25}],output:22,isDefault:false,"replaces":"Copper Ingot",outputs:[{item_id:29,rate:110,output:22}],item_id:29},
    {recipe_id:135,name:"Alternate: Leached Iron Ingot",building:"Refinery",time:6,inputs:[{item_id:0,amount:5,rate:50},{item_id:23,amount:1,rate:10}],output:10,isDefault:false,"replaces":"Iron Ingot",outputs:[{item_id:28,rate:100,output:10}],item_id:28},
    {recipe_id:136,name:"Alternate: Polymer Resin",building:"Refinery",time:6,inputs:[{item_id:11,amount:6,rate:60}],output:13,isDefault:false,"replaces":"Polymer Resin",outputs:[{item_id:50,rate:130,output:13}],item_id:50},
    {recipe_id:137,name:"Alternate: Pure Caterium Ingot",building:"Refinery",time:5,inputs:[{item_id:4,amount:2,rate:24},{item_id:10,amount:2,rate:24}],output:1,isDefault:false,"replaces":"Caterium Ingot",outputs:[{item_id:31,rate:12,output:1}],item_id:31},
    {recipe_id:138,name:"Alternate: Pure Copper Ingot",building:"Refinery",time:24,inputs:[{item_id:1,amount:6,rate:15},{item_id:10,amount:4,rate:10}],output:15,isDefault:false,"replaces":"Copper Ingot",outputs:[{item_id:29,rate:37.5,output:15}],item_id:29},
    {recipe_id:139,name:"Alternate: Pure Iron Ingot",building:"Refinery",time:12,inputs:[{item_id:0,amount:7,rate:35},{item_id:10,amount:4,rate:20}],output:13,isDefault:false,"replaces":"Iron Ingot",outputs:[{item_id:28,rate:65,output:13}],item_id:28},
    {recipe_id:140,name:"Alternate: Pure Quartz Crystal",building:"Refinery",time:8,inputs:[{item_id:5,amount:9,rate:67.5},{item_id:10,amount:5,rate:37.5}],output:7,isDefault:false,"replaces":"Quartz Crystal",outputs:[{item_id:43,rate:52.5,output:7}],item_id:43},
    {recipe_id:141,name:"Alternate: Recycled Plastic",building:"Refinery",time:12,inputs:[{item_id:49,amount:6,rate:30},{item_id:19,amount:6,rate:30}],output:12,isDefault:false,"replaces":"Plastic",outputs:[{item_id:48,rate:60,output:12}],item_id:48},
    {recipe_id:142,name:"Alternate: Recycled Rubber",building:"Refinery",time:12,inputs:[{item_id:48,amount:6,rate:30},{item_id:19,amount:6,rate:30}],output:12,isDefault:false,"replaces":"Rubber",outputs:[{item_id:49,rate:60,output:12}],item_id:49},
    {recipe_id:143,name:"Alternate: Steamed Copper Sheet",building:"Refinery",time:8,inputs:[{item_id:29,amount:3,rate:22.5},{item_id:10,amount:3,rate:22.5}],output:3,isDefault:false,"replaces":"Copper Sheet",outputs:[{item_id:42,rate:22.5,output:3}],item_id:42},
    {recipe_id:144,name:"Alternate: Turbo Heavy Fuel",building:"Refinery",time:8,inputs:[{item_id:18,amount:5,rate:37.5},{item_id:51,amount:4,rate:30}],output:4,isDefault:false,"replaces":"Compacted Coal",outputs:[{item_id:51,rate:30,output:4}],item_id:51},
    {recipe_id:145,name:"Alternate: Wet Concrete",building:"Refinery",time:3,inputs:[{item_id:2,amount:6,rate:120},{item_id:10,amount:5,rate:100}],output:4,isDefault:false,"replaces":"Concrete",outputs:[{item_id:37,rate:80,output:4}],item_id:37},
    {recipe_id:146,name:"Alternate: Polyester Fabric",building:"Refinery",time:2,inputs:[{item_id:50,amount:1,rate:30},{item_id:10,amount:1,rate:30}],output:1,isDefault:false,"replaces":"Fabric",outputs:[{item_id:98,rate:30,output:1}],item_id:98},
    {recipe_id:147,name:"Alternate: Pure Aluminum Ingot",building:"Smelter",time:2,inputs:[{item_id:52,amount:2,rate:60}],output:1,isDefault:false,"replaces":"Aluminum Ingot",outputs:[{item_id:32,rate:30,output:1}],item_id:32},
    {recipe_id:148,name:"Alternate: Cooling Device",building:"Blender",time:24,inputs:[{item_id:67,amount:4,rate:10},{item_id:58,amount:1,rate:2.5},{item_id:12,amount:24,rate:60}],output:2,isDefault:false,"replaces":"Cooling System",outputs:[{item_id:76,rate:5,output:2}],item_id:76},
    {recipe_id:149,name:"Alternate: Diluted Fuel",building:"Blender",time:6,inputs:[{item_id:18,amount:5,rate:50},{item_id:10,amount:10,rate:100}],output:10,isDefault:false,"replaces":"Fuel",outputs:[{item_id:19,rate:100,output:10}],item_id:19},
    {recipe_id:150,name:"Alternate: Distilled Silica",building:"Blender",time:6,inputs:[{item_id:25,amount:12,rate:120},{item_id:2,amount:5,rate:50},{item_id:10,amount:10,rate:100}],output:27,isDefault:false,"replaces":"Silica",outputs:[{item_id:44,rate:270,output:27}],item_id:44},
    {recipe_id:151,name:"Alternate: Heat-Fused Frame",building:"Blender",time:20,inputs:[{item_id:55,amount:1,rate:3},{item_id:32,amount:50,rate:150},{item_id:24,amount:8,rate:24},{item_id:19,amount:10,rate:30}],output:1,isDefault:false,"replaces":"Fused Modular Frame",outputs:[{item_id:78,rate:3,output:1}],item_id:78},
    {recipe_id:152,name:"Alternate: Instant Scrap",building:"Blender",time:6,inputs:[{item_id:7,amount:15,rate:150},{item_id:3,amount:10,rate:100},{item_id:23,amount:5,rate:50},{item_id:10,amount:6,rate:60}],output:30,isDefault:false,"replaces":"Aluminum Scrap",outputs:[{item_id:52,rate:300,output:30}],item_id:52},
    {recipe_id:153,name:"Alternate: Sloppy Alumina",building:"Blender",time:3,inputs:[{item_id:7,amount:10,rate:200},{item_id:10,amount:10,rate:200}],output:12,isDefault:false,"replaces":"Alumina Solution",outputs:[{item_id:22,rate:240,output:12}],item_id:22},
    {recipe_id:154,name:"Alternate: Turbo Blend Fuel",building:"Blender",time:8,inputs:[{item_id:19,amount:2,rate:15},{item_id:18,amount:4,rate:30},{item_id:6,amount:3,rate:22.5},{item_id:47,amount:3,rate:22.5}],output:6,isDefault:false,"replaces":"Turbofuel",outputs:[{item_id:21,rate:45,output:6}],item_id:21},


    // missed recipes
    {recipe_id:155,name:"Copper Powder",building:"Constructor",time:6,inputs:[{item_id:29,amount:30,rate:300}],output: 5,isDefault:true,outputs:[{item_id:88,rate:50,output:5}],item_id:88},

    { id:156,name:"Pressure Conversion Cube",building:"Assembler",time:60,inputs:[{item_id:78,amount:1,rate:1},{item_id:74,amount:2,rate:2}],output:1,isDefault:true,outputs:[{item_id:89,amount:1,rate:1}],item_id: 89},

    {recipe_id:157,name:"Time Crystal",building:"Converter",time:10,inputs:[{item_id:102,amount:2,rate:12}],output:1,isDefault:true,outputs:[{item_id:95,rate:6,output:1}],item_id:95},

    {recipe_id:158,name:"Diamonds",building:"Particle Accelerator",time:2,inputs:[{item_id:3,amount:20,rate:600}],output:1,isDefault:true,outputs:[{item_id:102,rate:30,output:1}],item_id:102},

    {recipe_id:159,name:"Ficsite Trigon",building:"Constructor",time:6,inputs:[{item_id:103,amount:1,rate:10}],output:3,isDefault:true,outputs:[{item_id:94,rate:30,output:3}],item_id:94},

    {recipe_id:160,name:"Reanimated SAM",building:"Constructor",time:2,inputs:[{item_id:9,amount:4,rate:120}],outputs:[{item_id:104,rate:30,output:1}], isDefault:true,item_id:104,output:1},

    {recipe_id:161,name:"Ficsite Ingot (Aluminum)",building:"Converter",time:2,inputs:[{item_id:32,amount:4,rate:120},{item_id:104,rate:60,amount:2}],outputs:[{item_id:103,rate:30,output:1}],isDefault:true,item_id:103,output:1},
    
    {recipe_id:162,name:"Ficsite Ingot (Caterium)",building:"Converter",time:4,inputs:[{item_id:31,amount:4,rate:60},{item_id:104,rate:45,amount:3}],outputs:[{item_id:103,rate:15,output:1}],isDefault:true,item_id:103,output:1},

    {recipe_id:163,name:"Ficsite Ingot (Iron)",building:"Converter",time:6,inputs:[{item_id:28,amount:24,rate:240},{item_id:104,rate:40,amount:4}],outputs:[{item_id:103,rate:10,output:1}],isDefault:true,item_id:103,output:1},

    {recipe_id:164,name:"Excited Photonic Matter",building:"Converter",time:3,inputs:[],outputs:[{item_id:90,rate:200,output:10}],isDefault:true,item_id:90,output:10},

    {recipe_id:165,name:"Dark Matter Crystal",building:"Particle Accelerator",time:2,inputs:[{item_id:102,amount:1,rate:30},{item_id:97,amount:5,rate:150}],output:1,isDefault:true,outputs:[{item_id:96,rate:30,output:1}],item_id:96},

    {recipe_id:166,name:"Plutonium Pellet",building:"Particle Accelerator",time:60,inputs:[{item_id:112,amount:100,rate:100}],output:30,isDefault:true,outputs:[{item_id:111,rate:30,output:30},{item_id:109,rate:25,output:25}],item_id:111},

    {recipe_id:167,name:"Encased Plutonium Cell",building:"Assembler",time:12,inputs:[{item_id:111,amount:2,rate:10},{item_id:37,amount:4,rate:20}],output:1,isDefault:true,outputs:[{item_id:110,rate:5,output:1}],item_id:110},

    {recipe_id:168,name:"Alternate: Instant Plutonium Cell",building:"Particle Accelerator",time:120,inputs:[{item_id:112,amount:150,rate:75},{item_id:46,amount:20,rate:10}],output:20,isDefault:false,"replaces":"Encased Plutonium Cell",outputs:[{item_id:110,rate:10,output:20}],item_id:110},

    {recipe_id:169,name:"Nitric Acid",building:"Blender",time:6,inputs:[{item_id:12,amount:12,rate:120},{item_id:10,amount:3,rate:30},{item_id:33,amount:1,rate:10}],output:3,isDefault:true,outputs:[{item_id:24,rate:30,output:3}],item_id:24},

    {recipe_id:170,name:"Rocket Fuel",building:"Blender",time:6,inputs:[{item_id:21,amount:6,rate:60},{item_id:24,amount:1,rate:10}],output:10,isDefault:true,outputs:[{item_id:26,rate:100,output:10},{item_id:51,rate:10,output:1}],item_id:26},

    {recipe_id:171,name:"Alternate: Nitro Rocket Fuel",building:"Blender",time:2.4,inputs:[{item_id:19,amount:4,rate:100},{item_id:12,amount:3,rate:75},{item_id:6,amount:4,rate:100},{item_id:3,amount:2,rate:50}],output:6,isDefault:false,"replaces":"Rocket Fuel",outputs:[{item_id:26,rate:150,output:6},{item_id:51,rate:25,output:1}],item_id:26},

    {recipe_id:172,name:"Dark Matter Residue",building:"Converter",time:6,inputs:[{item_id:104,amount:5,rate:50}],output:1,isDefault:true,outputs:[{item_id:97,rate:100,output:10}],item_id:97},

    {recipe_id:173,name:"Ficsonium",building:"Particle Accelerator",time:6,inputs:[{item_id:105,amount:1,rate:10},{item_id:106,amount:1,rate:10},{item_id:97,amount:20,rate:200}],output:1,isDefault:true,outputs:[{item_id:93,rate:1,output:10}],item_id:93},

    {recipe_id:174,name:"Singularity Cell",building:"Manufacturer",time:60,inputs:[{item_id:81,amount:1,rate:1},{item_id:96,amount:20,rate:20},{item_id:33,amount:100,rate:100},{item_id:37,amount:200,rate:200}],output:1,isDefault:true,outputs:[{item_id:106,rate:10,output:10}],item_id:106},

    {recipe_id:175,name:"SAM Fluctuator",building:"Manufacturer",time:60,inputs:[{item_id:104,amount:6,rate:60},{item_id:40,amount:5,rate:50},{item_id:39,amount:3,rate:30}],output:1,isDefault:true,outputs:[{item_id:91,rate:10,output:10}],item_id:91},

    {recipe_id:176,name:"Plutonium Waste",building:"Nuclear Power Plant",time:600,inputs:[{item_id:108,amount:1,rate:0.1},{item_id:10,amount:2400,rate:240}],output:1,isDefault:true,outputs:[{item_id:105,rate:10,output:1}],item_id:105},

    {recipe_id:177,name:"Uranium Waste",building:"Nuclear Power Plant",time:300,inputs:[{item_id:61,amount:1,rate:0.2},{item_id:10,amount:1200,rate:240}],output:1,isDefault:true,outputs:[{item_id:109,rate:10,output:1}],item_id:109},

    {recipe_id:178,name:"Plutonium Fuel Rod",building:"Manufacturer",time:240,inputs:[{item_id:110,amount:30,rate:7.5},{item_id:38,amount:18,rate:4.5},{item_id:63,amount:6,rate:1.5},{item_id:67,amount:10,rate:2.5}],output:1,isDefault:true,outputs:[{item_id:108,rate:0.25,output:1}],item_id:108},

    {recipe_id:179,name:"Uranium Fuel Rod",building:"Manufacturer",time:150,inputs:[{item_id:79,amount:50,rate:20},{item_id:54,amount:3,rate:1.2},{item_id:63,amount:5,rate:2},{item_id:67,amount:10,rate:2.5}],output:1,isDefault:true,outputs:[{item_id:61,rate:0.4,output:1}],item_id:61},

    {recipe_id:180,name:"Non-fissile Uranium",building:"Blender",time:24,inputs:[{item_id:109,amount:15,rate:37.5},{item_id:44,amount:10,rate:25},{item_id:24,amount:6,rate:15},{item_id:23,amount:6,rate:15},{item_id:10,amount:6,rate:15}],output:20,isDefault:true,outputs:[{item_id:112,rate:50,output:20}],item_id:112},

  ],

};

const ITEMS = CONSTS.ITEMS;


function recipesForItem( world ) {
  world = world || {};
  let alts = world.selectedAlternatives || {};
  let rs;
  rs = this.recipes ? Object.values(this.recipes)
    .sort((a,b)=>
      {
        const d1 = a.isDefault&&b.isDefault?0:a.isDefault?-1:1;
        const i1 = a.item_id==this.item_id?-1:b.item_id==this.item_id?1:0;
        //  console.log( a.name, b.name, d1, i1 );
        return d1 || i1;
      } )
    .filter(r => r.isDefault || alts[r.name] ) : [];
  return rs;
}

ITEMS.forEach( item => item.get_recipes = recipesForItem );


// connect items to their recipes
CONSTS.RECIPES.forEach( rec => {
  rec.outputs.forEach( output => {
    const item = ITEMS[output.item_id];
    if(!item)console.log(rec,output,"NOOOO");
    if (!item.recipes) { 
      item.recipes = {};      
    }
    item.recipes[rec.name] = rec;
  });
} );

CONSTS.NAME2ITEM_ID = CONSTS.ITEMS.reduce( (acc,val) => {
  acc[val.name] = val.item_id;
  return acc;
}, {} );

CONSTS.NAME2ITEM = CONSTS.ITEMS.reduce( (acc,val) => {
  acc[val.name] = val;
  return acc;
}, {} );


// Explicit list of fluid items
CONSTS.FLUID_ITEMS = CONSTS.ITEMS.filter( it => it.isFluid );

// Raw resources (things that come from miners/extractors)
CONSTS.RAW_RESOURCES = CONSTS.ITEMS.filter( it => it.isRawResource );

// Raw resources (things that come from miners/extractors)
CONSTS.FUELS = CONSTS.ITEMS.filter( it => it.isFuel );

// All recipes with their production rates (array format)
CONSTS.DEFAULT_RECIPES = CONSTS.RECIPES.filter( r => r.isDefault );
CONSTS.DEF2RECIPE = CONSTS.DEFAULT_RECIPES.reduce( (acc,val) => {
  acc[val.name] = val;
  return acc;
}, {});

CONSTS.ALT_RECIPES = CONSTS.RECIPES.filter( r => !r.isDefault );

CONSTS.BUILDING2IDS = CONSTS.BUILDINGS.reduce( (acc,val) => {
  acc[val.name] = val.building_id;
  return acc;
}, {});

const BUILDING_NAME2BUILDING = CONSTS.BUILDINGS.reduce( (acc,val) => {
  acc[val.name] = val;
  return acc;
}, {});

CONSTS.BUILDING2RECIPES = CONSTS.RECIPES.reduce( (acc,val) => {
  const b = val.building;
  if (! acc[b] ) {
    acc[b] = [];
  }
  acc[b].push( val );
  return acc;
}, {} );

/*
  Setup the production configurations for the line and the world. The world
  contains parameters set by the user.
 */
const setupProdConf = (line,world) => {
  line.tiers = [{}];

  const tiers = line.tiers;

  const needed = {};

  const item_name2net_rate = {};
  const item_name2prod_node = {};
  
  const addNeeded = (item,recipe,rate_adjust) => {
    console.log( `    ${item.name}`);
    let node = needed[item.item_id];

    // death check
    if (!recipe && !item.is_ore && !(item.name.match( /^(Water|Nitrogen Gas|Crude Oil|Wood)$/) || item.is_resource) ) {
      console.log( '))))))', item, item.recipes,recipe, rate_adjust, '<<<<<' );
      asdfasdf();
    }
    let itemRate = rate_adjust * (recipe ? recipe.outputs.filter( op => op.item_id == item.item_id )[0].rate : item.name == 'Water' ? 120 : 60);

    item_name2net_rate[item.name] = (item_name2net_rate[item.name] || 0 ) + itemRate;
    if (node) {
      node.rate = node.rate + itemRate;
    } else {
      node = needed[item.item_id]
        = { item: item,
            rate: itemRate,
            tier_idx: 0,
            supplies_nodes: {},
            supplied_by_nodes: {},
          };
      item_name2prod_node[item.name] = node;
    }

    if (recipe) {

      node.recipe = recipe;
      //        console.log(`need ${recipe.name} at ${rate_adjust*100}%`);
      recipe.inputs.forEach( inp => {
        const inp_item = ITEMS[inp.item_id];
        const inp_recipe = inp_item.get_recipes(world)[0];
        const rate = rate_adjust * inp.rate;
        item_name2net_rate[inp_item.name] = (item_name2net_rate[inp_item.name] || 0 ) - rate
        if (inp_recipe && ! inp_item.is_ore) {
          const inp_recip_output_rate = inp_recipe.outputs.filter( op => op.item_id == inp.item_id )[0].rate;
          const inp_rate_adjust = rate / inp_recip_output_rate;
          addNeeded(inp_item, inp_recipe, inp_rate_adjust);
        } else {
          const extract_rate_adj = rate / (inp_item.name == 'Water' ? 120 : 60);
          addNeeded(inp_item, null, extract_rate_adj);
        }
      });

      node.building = BUILDING_NAME2BUILDING[recipe.building];
    } else if (item.name == 'Water') {
      node.building = BUILDING_NAME2BUILDING['Water Extractor'];
    } else if (item.name == 'Nitrogen Gas') {
      node.building = BUILDING_NAME2BUILDING['Resource Well Extractor'];
    } else if (item.name == 'Crud Oil') {
      node.building = BUILDING_NAME2BUILDING['Oil Extractor'];
    } else if (item.is_resource) {
      node.building = BUILDING_NAME2BUILDING[world.selectedMiner];
    }
    if(!node.building) {
      console.log( item, "NO BUILD?");
    }
  };

  line.targetItems.forEach( targ => {
    const item_id = targ.item_id;
    const targRate = targ.rate;
    const targItem = ITEMS[item_id];

    const recipe = targItem.get_recipes(world)[0];
    if (recipe) {
      const inp_output_rate = recipe.outputs.filter( op => op.item_id == item_id )[0].rate;
      const rate_adjust = targRate / inp_output_rate;
      addNeeded( targItem, recipe, rate_adjust );
    }
  });

  // find building_count, clocking, supplied_by_nodes, supplies_nodes
  Object.values( needed ).forEach( node => {
    const recipe = node.recipe;
    const item = node.item;

    if (recipe) {
      const recipe_output_rate = recipe.outputs.filter( op => op.item_id == item.item_id )[0].rate;
      node.building_count = Math.ceil( node.rate / recipe_output_rate );
      node.clocking =  node.rate / (node.building_count * recipe_output_rate);
      recipe.inputs.forEach( inp => {
        const inp_node = needed[inp.item_id];
        node.supplied_by_nodes[inp_node.item.item_id] = inp_node;
        inp_node.supplies_nodes[node.item.item_id] = node;
      } );

    } else if(node.item.is_ore) {
      // TODO: node purity
      const miner_output_rate = 60;
      node.building_count = Math.ceil( node.rate / miner_output_rate );
      node.clocking = node.rate / (node.building_count * miner_output_rate);
    } else if(node.item.name == "Water") {
      // TODO: fill in, user can choose between pumped or fracked water. assume water for now
      const extractor_output_rate = 120;
      node.building_count = Math.ceil( node.rate / extractor_output_rate );
      node.clocking = node.building_count * node.rate / extractor_output_rate;
      
    } else if(node.item.name == "Nitrogen Gas") {
      // TODO: node purity
      const extractor_output_rate = 60;
      node.building_count = Math.ceil( node.rate / extractor_output_rate );
      node.clocking = node.building_count * node.rate / extractor_output_rate;
    } else if(node.item.name == "Crude Oil") {
      // TODO: node purity
      const extractor_output_rate = 60;
      node.building_count = Math.ceil( node.rate / extractor_output_rate );
      node.clocking = node.building_count * node.rate / extractor_output_rate;
    }
  } );

  // puts item (or it moves to) the appropriate tier
  const updateTier = (item_id, tier_idx) => {
    let tier = tiers[tier_idx];
    if (!tier) {
      tier = tiers[tier_idx] = {};
    }
    const node = needed[item_id];
    //console.log( `checking ${ITEMS[item_id].name} ${tier_idx} > ${node.tier_idx}` );
    if (tier_idx >= node.tier_idx) {
      //console.log( `removing ${ITEMS[item_id].name} FROM tier ${node.tier_idx}` );
      delete tiers[node.tier_idx][item_id];

      node.tier_idx = tier_idx;
      tier[item_id] = node;
      node.tier = tier;

      //console.log( `adding ${ITEMS[item_id].name} TO tier ${tier_idx}` );
    }
    Object.keys( node.supplied_by_nodes ).forEach( iid => updateTier(iid,tier_idx+1) );
  };
  line.targetItems.forEach( targ => {
    updateTier( targ.item_id, 0 );
  });

//  console.log(tiers.map( t => { return Object.keys(t).map(k => ITEMS[k].name)} ), "TIERS");

//  console.log(tiers);
  line.item_name2net_rate = item_name2net_rate;
  line.item_name2prod_node = item_name2prod_node;

  return line;
};


// Export for Node.js or expose globally for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONSTS,
    setupProdConf,
  };
} else {
  // Browser environment - expose as globals
  window.satdata = {
    CONSTS,
    setupProdConf,
  };
}

let print_prodline = line => {
  const tiers = line.tiers;

  tiers.forEach( (tier,idx) => {
    console.log( `==== TIER ${idx} =====` );
    Object.values(tier).forEach( prodconf => {
      const item = prodconf.item;
      const recipe = prodconf.recipe;
      const building = prodconf.building;

      console.log( `    ------ ${item.name} -----`);
      console.log( `    ${prodconf.rate.toFixed(1)}/min ${item.name} produced by ${prodconf.building_count} ${building.name}${prodconf.building_count > 1 ? 's':''} at clock rate ${prodconf.clocking.toFixed(3)}` );
      recipe && recipe.inputs.forEach( inp => {
        console.log( `       ${ITEMS[inp.item_id].name} @ ${inp.rate}/min` );
      } );
//      console.log( `    ` );
//      console.log( `    ` );
      
    } );
  });
}

const CHECK_ALL_RECIPES = false;
const TEST = false;

if (TEST) {
  const world = {
    name:'test world',
    selectedBelt: 'Mk.3',
    selectedPipe: 'Mk.1',
    selectedMiner: 'Miner Mk.2',
    selectedAlternatives: {},
    selectedAlternatives: CONSTS.ALT_RECIPES.reduce( (acc,val) => { acc[val.name] = val; return acc }, {} ),
  };

  let items = [];
  ['Heavy Modular Frame', 'Encased Industrial Beam'  ]
    .map( n => CONSTS.NAME2ITEM[n] )
    .forEach( it => {
      let rate = it.get_recipes(world)[0].outputs.filter(o => o.item_id == it.item_id)[0].rate;
      if (it.name == 'Encased Industrial Beam' ) { console.log( rate = 4 ) }
      items.push( { item_id: it.item_id,rate: rate } );
    });
  let line = {
    name: 'test prod line',
    targetItems: items,
  };
  setupProdConf( line, world );
  print_prodline( line );
  console.log( line.item_name2net_rate );
}

if (CHECK_ALL_RECIPES) {
  const world = {
    name:'test world',
    selectedBelt: 'Mk.1',
    selectedPipe: 'Mk.1',
    selectedMiner: 'Miner Mk.1',
    selectedAlternatives: {},
    selectedAlternatives: CONSTS.ALT_RECIPES.reduce( (acc,val) => { acc[val.name] = val; return acc }, {} ),
  };
  CONSTS.DEFAULT_RECIPES.forEach( rec => {
    let name = rec.name;
    console.log( `---- ${name} ----` );
    if (name.match(/^Ficsite Ingot/)) name = 'Ficsite Ingot';
    if (name.match(/^Synthetic Power Shard/)) name = 'Power Shard';
    const item = CONSTS.NAME2ITEM[name];
    const rate = rec.outputs.filter(o => o.item_id==item.item_id)[0].rate;
    const items = [{item_id:item.item_id, rate: rate}];

    let line = {
      name: 'test prod line',
      targetItems: items,
    };
    setupProdConf( line, world );
  } );

  CONSTS.ALT_RECIPES.forEach( rec => {
    let name = rec.name;
    console.log( `---- ${name} ----` );

    const item = CONSTS.NAME2ITEM[rec.replaces];
    const rate = rec.outputs.filter(o => o.item_id==item.item_id)[0].rate;
    const items = [{item_id:item.item_id, rate: rate}];
    let line = {
      name: 'test prod line',
      targetItems: items,
    };
    setupProdConf( line, world );
  })
}

