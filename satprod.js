const { useState, useEffect } = React;

// Building power consumption data (array format)
const BUILDINGS = [
  { id: 0, name: 'Assembler', power: 15 },
  { id: 1, name: 'Blender', power: 75 },
  { id: 2, name: 'Constructor', power: 4 },
  { id: 3, name: 'Foundry', power: 16 },
  { id: 4, name: 'Manufacturer', power: 55 },
  { id: 5, name: 'Miner Mk.1', power: 5 },
  { id: 6, name: 'Miner Mk.2', power: 12 },
  { id: 7, name: 'Miner Mk.3', power: 30 },
  { id: 8, name: 'Oil Extractor', power: 40 },
  { id: 9, name: 'Particle Accelerator', power: 500 },
  { id: 10, name: 'Quantum Encoder', power: 1000 },
  { id: 11, name: 'Refinery', power: 30 },
  { id: 12, name: 'Resource Well Extractor', power: 0 },
  { id: 13, name: 'Smelter', power: 4 },
  { id: 14, name: 'Water Extractor', power: 20 }
];

// Lookup map for O(1) access (backward compatibility)
const BUILDINGS_BY_NAME = Object.fromEntries(
  BUILDINGS.map(b => [b.name, b])
);

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
// Default (standard) recipes
const DEFAULT_RECIPES = {
  // Smelter recipes
  'Iron Ingot': { building: 'Smelter', time: 2, inputs: { 'Iron Ore': 1 }, output: 1, isDefault: true },
  'Copper Ingot': { building: 'Smelter', time: 2, inputs: { 'Copper Ore': 1 }, output: 1, isDefault: true },
  'Caterium Ingot': { building: 'Smelter', time: 4, inputs: { 'Caterium Ore': 3 }, output: 1, isDefault: true },

  // Constructor recipes
  'Iron Plate': { building: 'Constructor', time: 6, inputs: { 'Iron Ingot': 3 }, output: 2, isDefault: true },
  'Iron Rod': { building: 'Constructor', time: 4, inputs: { 'Iron Ingot': 1 }, output: 1, isDefault: true },
  'Screw': { building: 'Constructor', time: 6, inputs: { 'Iron Rod': 1 }, output: 4, isDefault: true },
  'Wire': { building: 'Constructor', time: 4, inputs: { 'Copper Ingot': 1 }, output: 2, isDefault: true },
  'Cable': { building: 'Constructor', time: 2, inputs: { 'Wire': 2 }, output: 1, isDefault: true },
  'Concrete': { building: 'Constructor', time: 4, inputs: { 'Limestone': 3 }, output: 1, isDefault: true },
  'Copper Sheet': { building: 'Constructor', time: 6, inputs: { 'Copper Ingot': 2 }, output: 1, isDefault: true },
  'Steel Beam': { building: 'Constructor', time: 4, inputs: { 'Steel Ingot': 4 }, output: 1, isDefault: true },
  'Steel Pipe': { building: 'Constructor', time: 6, inputs: { 'Steel Ingot': 3 }, output: 2, isDefault: true },
  'Quickwire': { building: 'Constructor', time: 5, inputs: { 'Caterium Ingot': 1 }, output: 5, isDefault: true },
  'Quartz Crystal': { building: 'Constructor', time: 8, inputs: { 'Raw Quartz': 5 }, output: 3, isDefault: true },
  'Silica': { building: 'Constructor', time: 8, inputs: { 'Raw Quartz': 3 }, output: 5, isDefault: true },
  'Aluminum Casing': { building: 'Constructor', time: 2, inputs: { 'Aluminum Ingot': 3 }, output: 2, isDefault: true },
  'Empty Canister': { building: 'Constructor', time: 4, inputs: { 'Plastic': 2 }, output: 4, isDefault: true },

  // Foundry recipes
  'Steel Ingot': { building: 'Foundry', time: 4, inputs: { 'Iron Ore': 3, 'Coal': 3 }, output: 3, isDefault: true },
  'Aluminum Ingot': { building: 'Foundry', time: 4, inputs: { 'Aluminum Scrap': 6, 'Silica': 5 }, output: 4, isDefault: true },

  // Assembler recipes
  'Reinforced Iron Plate': { building: 'Assembler', time: 12, inputs: { 'Iron Plate': 6, 'Screw': 12 }, output: 1, isDefault: true },
  'Modular Frame': { building: 'Assembler', time: 60, inputs: { 'Reinforced Iron Plate': 3, 'Iron Rod': 12 }, output: 2, isDefault: true },
  'Rotor': { building: 'Assembler', time: 15, inputs: { 'Iron Rod': 5, 'Screw': 25 }, output: 1, isDefault: true },
  'Stator': { building: 'Assembler', time: 12, inputs: { 'Steel Pipe': 3, 'Wire': 8 }, output: 1, isDefault: true },
  'Motor': { building: 'Assembler', time: 12, inputs: { 'Rotor': 2, 'Stator': 2 }, output: 1, isDefault: true },
  'Circuit Board': { building: 'Assembler', time: 8, inputs: { 'Copper Sheet': 2, 'Plastic': 4 }, output: 1, isDefault: true },
  'AI Limiter': { building: 'Assembler', time: 12, inputs: { 'Copper Sheet': 5, 'Quickwire': 20 }, output: 1, isDefault: true },
  'Encased Industrial Beam': { building: 'Assembler', time: 10, inputs: { 'Steel Beam': 3, 'Concrete': 6 }, output: 1, isDefault: true },
  'Heat Sink': { building: 'Assembler', time: 8, inputs: { 'Alclad Aluminum Sheet': 5, 'Copper Sheet': 3 }, output: 1, isDefault: true },
  'Alclad Aluminum Sheet': { building: 'Assembler', time: 6, inputs: { 'Aluminum Ingot': 3, 'Copper Ingot': 1 }, output: 3, isDefault: true },
  'Electromagnetic Control Rod': { building: 'Assembler', time: 30, inputs: { 'Stator': 3, 'AI Limiter': 2 }, output: 2, isDefault: true },
  'Smart Plating': { building: 'Assembler', time: 30, inputs: { 'Reinforced Iron Plate': 1, 'Rotor': 1 }, output: 1, isDefault: true },
  'Versatile Framework': { building: 'Assembler', time: 24, inputs: { 'Modular Frame': 1, 'Steel Beam': 12 }, output: 2, isDefault: true },
  'Automated Wiring': { building: 'Assembler', time: 24, inputs: { 'Stator': 1, 'Cable': 20 }, output: 1, isDefault: true },
  'Black Powder': { building: 'Assembler', time: 4, inputs: { 'Coal': 1, 'Sulfur': 1 }, output: 2, isDefault: true },
  'Magnetic Field Generator': { building: 'Assembler', time: 120, inputs: { 'Versatile Framework': 5, 'Electromagnetic Control Rod': 2 }, output: 2, isDefault: true },

  // Refinery recipes
  'Plastic': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 3 }, output: 2, isDefault: true },
  'Rubber': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 3 }, output: 2, isDefault: true },
  'Fuel': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 6 }, output: 4, isDefault: true },
  'Petroleum Coke': { building: 'Refinery', time: 6, inputs: { 'Heavy Oil Residue': 4 }, output: 12, isDefault: true },
  'Alumina Solution': { building: 'Refinery', time: 6, inputs: { 'Bauxite': 12, 'Water': 18 }, output: 12, isDefault: true },
  'Aluminum Scrap': { building: 'Refinery', time: 1, inputs: { 'Alumina Solution': 4, 'Coal': 2 }, output: 6, isDefault: true },
  'Sulfuric Acid': { building: 'Refinery', time: 6, inputs: { 'Sulfur': 5, 'Water': 5 }, output: 5, isDefault: true },

  // Manufacturer recipes
  'Heavy Modular Frame': { building: 'Manufacturer', time: 30, inputs: { 'Modular Frame': 5, 'Steel Pipe': 15, 'Encased Industrial Beam': 5, 'Screw': 90 }, output: 1, isDefault: true },
  'Computer': { building: 'Manufacturer', time: 24, inputs: { 'Circuit Board': 10, 'Cable': 9, 'Plastic': 18, 'Screw': 52 }, output: 1, isDefault: true },
  'Supercomputer': { building: 'Manufacturer', time: 32, inputs: { 'Computer': 2, 'AI Limiter': 2, 'High-Speed Connector': 3, 'Plastic': 28 }, output: 1, isDefault: true },
  'High-Speed Connector': { building: 'Manufacturer', time: 16, inputs: { 'Quickwire': 56, 'Cable': 10, 'Circuit Board': 1 }, output: 1, isDefault: true },
  'Crystal Oscillator': { building: 'Manufacturer', time: 120, inputs: { 'Quartz Crystal': 36, 'Cable': 28, 'Reinforced Iron Plate': 5 }, output: 2, isDefault: true },
  'Adaptive Control Unit': { building: 'Manufacturer', time: 120, inputs: { 'Automated Wiring': 15, 'Circuit Board': 10, 'Heavy Modular Frame': 2, 'Computer': 2 }, output: 2, isDefault: true },
  'Modular Engine': { building: 'Manufacturer', time: 60, inputs: { 'Motor': 2, 'Rubber': 15, 'Smart Plating': 2 }, output: 1, isDefault: true },
  'Radio Control Unit': { building: 'Manufacturer', time: 48, inputs: { 'Aluminum Casing': 32, 'Crystal Oscillator': 1, 'Computer': 1 }, output: 2, isDefault: true },
  'Turbo Motor': { building: 'Manufacturer', time: 32, inputs: { 'Cooling System': 4, 'Radio Control Unit': 2, 'Motor': 4, 'Rubber': 24 }, output: 1, isDefault: true },
  'Gas Filter': { building: 'Manufacturer', time: 8, inputs: { 'Coal': 5, 'Rubber': 2, 'Fabric': 2 }, output: 1, isDefault: true },

  // Blender recipes
  'Cooling System': { building: 'Blender', time: 10, inputs: { 'Heat Sink': 2, 'Rubber': 2, 'Water': 5, 'Nitrogen Gas': 25 }, output: 1, isDefault: true },
  'Fused Modular Frame': { building: 'Blender', time: 40, inputs: { 'Heavy Modular Frame': 1, 'Aluminum Casing': 50, 'Nitrogen Gas': 25 }, output: 1, isDefault: true },
  'Battery': { building: 'Blender', time: 3, inputs: { 'Sulfuric Acid': 2.5, 'Alumina Solution': 2, 'Aluminum Casing': 1 }, output: 1, isDefault: true },
  'Encased Uranium Cell': { building: 'Blender', time: 12, inputs: { 'Uranium': 10, 'Concrete': 3, 'Sulfuric Acid': 8 }, output: 5, isDefault: true },

  // Particle Accelerator recipes
  'Nuclear Pasta': { building: 'Particle Accelerator', time: 120, inputs: { 'Copper Powder': 200, 'Pressure Conversion Cube': 1 }, output: 1, isDefault: true },

  // Quantum Encoder recipes
  'AI Expansion Server': { building: 'Quantum Encoder', time: 15, inputs: { 'Magnetic Field Generator': 1, 'Neural-Quantum Processor': 1, 'Superposition Oscillator': 1, 'Excited Photonic Matter': 25 }, output: 1, isDefault: true },
  'Alien Power Matrix': { building: 'Quantum Encoder', time: 24, inputs: { 'SAM Fluctuator': 5, 'Power Shard': 3, 'Superposition Oscillator': 3, 'Excited Photonic Matter': 24 }, output: 1, isDefault: true },
  'Ficsonium Fuel Rod': { building: 'Quantum Encoder', time: 24, inputs: { 'Ficsonium': 2, 'Electromagnetic Control Rod': 2, 'Ficsite Trigon': 40, 'Excited Photonic Matter': 20 }, output: 1, isDefault: true },
  'Neural-Quantum Processor': { building: 'Quantum Encoder', time: 20, inputs: { 'Time Crystal': 5, 'Supercomputer': 1, 'Ficsite Trigon': 15, 'Excited Photonic Matter': 25 }, output: 1, isDefault: true },
  'Superposition Oscillator': { building: 'Quantum Encoder', time: 12, inputs: { 'Dark Matter Crystal': 6, 'Crystal Oscillator': 1, 'Alclad Aluminum Sheet': 9, 'Excited Photonic Matter': 25 }, output: 1, isDefault: true },
  'Synthetic Power Shard': { building: 'Quantum Encoder', time: 12, inputs: { 'Time Crystal': 2, 'Dark Matter Crystal': 2, 'Quartz Crystal': 12, 'Excited Photonic Matter': 12 }, output: 1, isDefault: true },
};

// Alternate recipes (unlocked via hard drives)
const ALTERNATE_RECIPES = {
  // Constructor Alternates
  'Alternate: Iron Wire': { building: 'Constructor', time: 24, inputs: { 'Iron Ingot': 5 }, output: 9, isDefault: false, replaces: 'Wire', name: 'Alternate: Iron Wire' },
  'Alternate: Cast Screw': { building: 'Constructor', time: 24, inputs: { 'Iron Ingot': 5 }, output: 20, isDefault: false, replaces: 'Screw', name: 'Alternate: Cast Screw' },
  'Alternate: Steel Rod': { building: 'Constructor', time: 5, inputs: { 'Steel Ingot': 1 }, output: 4, isDefault: false, replaces: 'Iron Rod', name: 'Alternate: Steel Rod' },
  'Alternate: Aluminum Rod': { building: 'Constructor', time: 8, inputs: { 'Aluminum Ingot': 1 }, output: 7, isDefault: false, replaces: 'Iron Rod', name: 'Alternate: Aluminum Rod' },
  'Alternate: Caterium Wire': { building: 'Constructor', time: 4, inputs: { 'Caterium Ingot': 1 }, output: 8, isDefault: false, replaces: 'Wire', name: 'Alternate: Caterium Wire' },
  'Alternate: Charcoal': { building: 'Constructor', time: 4, inputs: { 'Wood': 1 }, output: 10, isDefault: false, replaces: null, name: 'Alternate: Charcoal' },
  'Alternate: Steel Canister': { building: 'Constructor', time: 6, inputs: { 'Steel Ingot': 4 }, output: 4, isDefault: false, replaces: 'Empty Canister', name: 'Alternate: Steel Canister' },
  'Alternate: Aluminum Beam': { building: 'Constructor', time: 8, inputs: { 'Aluminum Ingot': 3 }, output: 3, isDefault: false, replaces: 'Steel Beam', name: 'Alternate: Aluminum Beam' },
  'Alternate: Iron Pipe': { building: 'Constructor', time: 12, inputs: { 'Iron Ingot': 20 }, output: 5, isDefault: false, replaces: 'Steel Pipe', name: 'Alternate: Iron Pipe' },

  // Assembler Alternates
  'Alternate: Adhered Iron Plate': { building: 'Assembler', time: 16, inputs: { 'Iron Plate': 3, 'Rubber': 1 }, output: 1, isDefault: false, replaces: 'Reinforced Iron Plate', name: 'Alternate: Adhered Iron Plate' },
  'Alternate: Bolted Frame': { building: 'Assembler', time: 24, inputs: { 'Reinforced Iron Plate': 3, 'Screw': 56 }, output: 2, isDefault: false, replaces: 'Modular Frame', name: 'Alternate: Bolted Frame' },
  'Alternate: Bolted Iron Plate': { building: 'Assembler', time: 12, inputs: { 'Iron Plate': 18, 'Screw': 50 }, output: 3, isDefault: false, replaces: 'Reinforced Iron Plate', name: 'Alternate: Bolted Iron Plate' },
  'Alternate: Cheap Silica': { building: 'Assembler', time: 8, inputs: { 'Raw Quartz': 3, 'Limestone': 5 }, output: 7, isDefault: false, replaces: 'Silica', name: 'Alternate: Cheap Silica' },
  'Alternate: Coated Cable': { building: 'Assembler', time: 8, inputs: { 'Wire': 5, 'Heavy Oil Residue': 2 }, output: 9, isDefault: false, replaces: 'Cable', name: 'Alternate: Coated Cable' },
  'Alternate: Coated Iron Canister': { building: 'Assembler', time: 4, inputs: { 'Iron Plate': 2, 'Copper Sheet': 1 }, output: 4, isDefault: false, replaces: 'Empty Canister', name: 'Alternate: Coated Iron Canister' },
  'Alternate: Coated Iron Plate': { building: 'Assembler', time: 8, inputs: { 'Iron Ingot': 5, 'Plastic': 1 }, output: 10, isDefault: false, replaces: 'Iron Plate', name: 'Alternate: Coated Iron Plate' },
  'Alternate: Copper Rotor': { building: 'Assembler', time: 16, inputs: { 'Copper Sheet': 6, 'Screw': 52 }, output: 3, isDefault: false, replaces: 'Rotor', name: 'Alternate: Copper Rotor' },
  'Alternate: Electrode Circuit Board': { building: 'Assembler', time: 12, inputs: { 'Rubber': 4, 'Petroleum Coke': 8 }, output: 1, isDefault: false, replaces: 'Circuit Board', name: 'Alternate: Electrode Circuit Board' },
  'Alternate: Electric Motor': { building: 'Assembler', time: 16, inputs: { 'Electromagnetic Control Rod': 1, 'Rotor': 2 }, output: 2, isDefault: false, replaces: 'Motor', name: 'Alternate: Electric Motor' },
  'Alternate: Electromagnetic Connection Rod': { building: 'Assembler', time: 15, inputs: { 'Stator': 2, 'High-Speed Connector': 1 }, output: 2, isDefault: false, replaces: 'Electromagnetic Control Rod', name: 'Alternate: Electromagnetic Connection Rod' },
  'Alternate: Encased Industrial Pipe': { building: 'Assembler', time: 15, inputs: { 'Steel Pipe': 6, 'Concrete': 5 }, output: 1, isDefault: false, replaces: 'Encased Industrial Beam', name: 'Alternate: Encased Industrial Pipe' },
  'Alternate: Fine Black Powder': { building: 'Assembler', time: 8, inputs: { 'Sulfur': 1, 'Compacted Coal': 2 }, output: 6, isDefault: false, replaces: 'Black Powder', name: 'Alternate: Fine Black Powder' },
  'Alternate: Fine Concrete': { building: 'Assembler', time: 12, inputs: { 'Silica': 3, 'Limestone': 12 }, output: 10, isDefault: false, replaces: 'Concrete', name: 'Alternate: Fine Concrete' },
  'Alternate: Fused Quickwire': { building: 'Assembler', time: 8, inputs: { 'Caterium Ingot': 1, 'Copper Ingot': 5 }, output: 12, isDefault: false, replaces: 'Quickwire', name: 'Alternate: Fused Quickwire' },
  'Alternate: Fused Wire': { building: 'Assembler', time: 20, inputs: { 'Copper Ingot': 4, 'Caterium Ingot': 1 }, output: 30, isDefault: false, replaces: 'Wire', name: 'Alternate: Fused Wire' },
  'Alternate: Insulated Cable': { building: 'Assembler', time: 12, inputs: { 'Wire': 9, 'Rubber': 6 }, output: 20, isDefault: false, replaces: 'Cable', name: 'Alternate: Insulated Cable' },
  'Alternate: Plastic AI Limiter': { building: 'Assembler', time: 15, inputs: { 'Quickwire': 30, 'Plastic': 7 }, output: 2, isDefault: false, replaces: 'AI Limiter', name: 'Alternate: Plastic AI Limiter' },
  'Alternate: Quickwire Cable': { building: 'Assembler', time: 24, inputs: { 'Quickwire': 3, 'Rubber': 2 }, output: 11, isDefault: false, replaces: 'Cable', name: 'Alternate: Quickwire Cable' },
  'Alternate: Quickwire Stator': { building: 'Assembler', time: 15, inputs: { 'Steel Pipe': 4, 'Quickwire': 15 }, output: 2, isDefault: false, replaces: 'Stator', name: 'Alternate: Quickwire Stator' },
  'Alternate: Rubber Concrete': { building: 'Assembler', time: 6, inputs: { 'Limestone': 10, 'Rubber': 2 }, output: 9, isDefault: false, replaces: 'Concrete', name: 'Alternate: Rubber Concrete' },
  'Alternate: Silicon Circuit Board': { building: 'Assembler', time: 24, inputs: { 'Copper Sheet': 11, 'Silica': 11 }, output: 5, isDefault: false, replaces: 'Circuit Board', name: 'Alternate: Silicon Circuit Board' },
  'Alternate: Stitched Iron Plate': { building: 'Assembler', time: 32, inputs: { 'Iron Plate': 10, 'Wire': 20 }, output: 3, isDefault: false, replaces: 'Reinforced Iron Plate', name: 'Alternate: Stitched Iron Plate' },
  'Alternate: Steel Rotor': { building: 'Assembler', time: 12, inputs: { 'Steel Pipe': 2, 'Wire': 6 }, output: 1, isDefault: false, replaces: 'Rotor', name: 'Alternate: Steel Rotor' },
  'Alternate: Steeled Frame': { building: 'Assembler', time: 60, inputs: { 'Reinforced Iron Plate': 2, 'Steel Pipe': 10 }, output: 3, isDefault: false, replaces: 'Modular Frame', name: 'Alternate: Steeled Frame' },
  'Alternate: Alclad Casing': { building: 'Assembler', time: 8, inputs: { 'Aluminum Ingot': 20, 'Copper Ingot': 10 }, output: 15, isDefault: false, replaces: 'Aluminum Casing', name: 'Alternate: Alclad Casing' },
  'Alternate: Heat Exchanger': { building: 'Assembler', time: 6, inputs: { 'Aluminum Casing': 3, 'Rubber': 3 }, output: 1, isDefault: false, replaces: 'Heat Sink', name: 'Alternate: Heat Exchanger' },
  'Alternate: Caterium Circuit Board': { building: 'Assembler', time: 48, inputs: { 'Plastic': 10, 'Quickwire': 30 }, output: 7, isDefault: false, replaces: 'Circuit Board', name: 'Alternate: Caterium Circuit Board' },
  'Alternate: Compacted Coal': { building: 'Assembler', time: 12, inputs: { 'Coal': 5, 'Sulfur': 5 }, output: 5, isDefault: false, replaces: null, name: 'Alternate: Compacted Coal' },

  // Manufacturer Alternates
  'Alternate: Automated Speed Wiring': { building: 'Manufacturer', time: 32, inputs: { 'Stator': 2, 'Wire': 40, 'High-Speed Connector': 1 }, output: 4, isDefault: false, replaces: 'Automated Wiring', name: 'Alternate: Automated Speed Wiring' },
  'Alternate: Caterium Computer': { building: 'Manufacturer', time: 16, inputs: { 'Circuit Board': 4, 'Quickwire': 14, 'Rubber': 6 }, output: 1, isDefault: false, replaces: 'Computer', name: 'Alternate: Caterium Computer' },
  'Alternate: Classic Battery': { building: 'Manufacturer', time: 8, inputs: { 'Sulfur': 6, 'Alclad Aluminum Sheet': 7, 'Plastic': 8, 'Wire': 12 }, output: 4, isDefault: false, replaces: 'Battery', name: 'Alternate: Classic Battery' },
  'Alternate: Crystal Computer': { building: 'Manufacturer', time: 64, inputs: { 'Circuit Board': 8, 'Crystal Oscillator': 3 }, output: 3, isDefault: false, replaces: 'Computer', name: 'Alternate: Crystal Computer' },
  'Alternate: Flexible Framework': { building: 'Manufacturer', time: 16, inputs: { 'Modular Frame': 1, 'Steel Beam': 6, 'Rubber': 8 }, output: 2, isDefault: false, replaces: 'Versatile Framework', name: 'Alternate: Flexible Framework' },
  'Alternate: Heavy Encased Frame': { building: 'Manufacturer', time: 64, inputs: { 'Modular Frame': 8, 'Encased Industrial Beam': 10, 'Steel Pipe': 36, 'Concrete': 22 }, output: 3, isDefault: false, replaces: 'Heavy Modular Frame', name: 'Alternate: Heavy Encased Frame' },
  'Alternate: Heavy Flexible Frame': { building: 'Manufacturer', time: 16, inputs: { 'Modular Frame': 5, 'Encased Industrial Beam': 3, 'Rubber': 20, 'Screw': 104 }, output: 1, isDefault: false, replaces: 'Heavy Modular Frame', name: 'Alternate: Heavy Flexible Frame' },
  'Alternate: Infused Uranium Cell': { building: 'Manufacturer', time: 12, inputs: { 'Uranium': 5, 'Silica': 3, 'Sulfur': 5, 'Quickwire': 15 }, output: 4, isDefault: false, replaces: 'Encased Uranium Cell', name: 'Alternate: Infused Uranium Cell' },
  'Alternate: Insulated Crystal Oscillator': { building: 'Manufacturer', time: 32, inputs: { 'Quartz Crystal': 10, 'Rubber': 7, 'AI Limiter': 1 }, output: 1, isDefault: false, replaces: 'Crystal Oscillator', name: 'Alternate: Insulated Crystal Oscillator' },
  'Alternate: OC Supercomputer': { building: 'Manufacturer', time: 20, inputs: { 'Radio Control Unit': 2, 'Cooling System': 2 }, output: 1, isDefault: false, replaces: 'Supercomputer', name: 'Alternate: OC Supercomputer' },
  'Alternate: Radio Connection Unit': { building: 'Manufacturer', time: 16, inputs: { 'Heat Sink': 4, 'High-Speed Connector': 2, 'Quartz Crystal': 12 }, output: 1, isDefault: false, replaces: 'Radio Control Unit', name: 'Alternate: Radio Connection Unit' },
  'Alternate: Radio Control System': { building: 'Manufacturer', time: 40, inputs: { 'Crystal Oscillator': 1, 'Circuit Board': 10, 'Aluminum Casing': 60, 'Rubber': 30 }, output: 3, isDefault: false, replaces: 'Radio Control Unit', name: 'Alternate: Radio Control System' },
  'Alternate: Rigor Motor': { building: 'Manufacturer', time: 48, inputs: { 'Rotor': 3, 'Stator': 3, 'Crystal Oscillator': 1 }, output: 6, isDefault: false, replaces: 'Motor', name: 'Alternate: Rigor Motor' },
  'Alternate: Super-State Computer': { building: 'Manufacturer', time: 25, inputs: { 'Computer': 3, 'Electromagnetic Control Rod': 1, 'Battery': 10, 'Wire': 25 }, output: 1, isDefault: false, replaces: 'Supercomputer', name: 'Alternate: Super-State Computer' },
  'Alternate: Turbo Electric Motor': { building: 'Manufacturer', time: 64, inputs: { 'Motor': 7, 'Radio Control Unit': 9, 'Electromagnetic Control Rod': 5, 'Rotor': 7 }, output: 3, isDefault: false, replaces: 'Turbo Motor', name: 'Alternate: Turbo Electric Motor' },
  'Alternate: Plastic Smart Plating': { building: 'Manufacturer', time: 24, inputs: { 'Reinforced Iron Plate': 1, 'Rotor': 1, 'Plastic': 3 }, output: 2, isDefault: false, replaces: 'Smart Plating', name: 'Alternate: Plastic Smart Plating' },
  'Alternate: Silicon High-Speed Connector': { building: 'Manufacturer', time: 40, inputs: { 'Quickwire': 60, 'Silica': 25, 'Circuit Board': 2 }, output: 2, isDefault: false, replaces: 'High-Speed Connector', name: 'Alternate: Silicon High-Speed Connector' },

  // Foundry Alternates
  'Alternate: Basic Iron Ingot': { building: 'Foundry', time: 12, inputs: { 'Iron Ore': 5, 'Limestone': 8 }, output: 10, isDefault: false, replaces: 'Iron Ingot', name: 'Alternate: Basic Iron Ingot' },
  'Alternate: Coke Steel Ingot': { building: 'Foundry', time: 12, inputs: { 'Iron Ore': 15, 'Petroleum Coke': 15 }, output: 20, isDefault: false, replaces: 'Steel Ingot', name: 'Alternate: Coke Steel Ingot' },
  'Alternate: Compacted Steel Ingot': { building: 'Foundry', time: 24, inputs: { 'Iron Ore': 2, 'Compacted Coal': 1 }, output: 4, isDefault: false, replaces: 'Steel Ingot', name: 'Alternate: Compacted Steel Ingot' },
  'Alternate: Copper Alloy Ingot': { building: 'Foundry', time: 6, inputs: { 'Copper Ore': 5, 'Iron Ore': 5 }, output: 10, isDefault: false, replaces: 'Copper Ingot', name: 'Alternate: Copper Alloy Ingot' },
  'Alternate: Fused Quartz Crystal': { building: 'Foundry', time: 20, inputs: { 'Raw Quartz': 25, 'Coal': 12 }, output: 18, isDefault: false, replaces: 'Quartz Crystal', name: 'Alternate: Fused Quartz Crystal' },
  'Alternate: Iron Alloy Ingot': { building: 'Foundry', time: 12, inputs: { 'Iron Ore': 8, 'Copper Ore': 2 }, output: 15, isDefault: false, replaces: 'Iron Ingot', name: 'Alternate: Iron Alloy Ingot' },
  'Alternate: Molded Beam': { building: 'Foundry', time: 12, inputs: { 'Steel Ingot': 24, 'Concrete': 16 }, output: 9, isDefault: false, replaces: 'Steel Beam', name: 'Alternate: Molded Beam' },
  'Alternate: Molded Steel Pipe': { building: 'Foundry', time: 6, inputs: { 'Steel Ingot': 5, 'Concrete': 3 }, output: 5, isDefault: false, replaces: 'Steel Pipe', name: 'Alternate: Molded Steel Pipe' },
  'Alternate: Solid Steel Ingot': { building: 'Foundry', time: 3, inputs: { 'Iron Ingot': 2, 'Coal': 2 }, output: 3, isDefault: false, replaces: 'Steel Ingot', name: 'Alternate: Solid Steel Ingot' },
  'Alternate: Steel Cast Plate': { building: 'Foundry', time: 4, inputs: { 'Iron Ingot': 1, 'Steel Ingot': 1 }, output: 3, isDefault: false, replaces: 'Iron Plate', name: 'Alternate: Steel Cast Plate' },
  'Alternate: Tempered Caterium Ingot': { building: 'Foundry', time: 8, inputs: { 'Caterium Ore': 6, 'Petroleum Coke': 2 }, output: 3, isDefault: false, replaces: 'Caterium Ingot', name: 'Alternate: Tempered Caterium Ingot' },
  'Alternate: Tempered Copper Ingot': { building: 'Foundry', time: 12, inputs: { 'Copper Ore': 5, 'Petroleum Coke': 8 }, output: 12, isDefault: false, replaces: 'Copper Ingot', name: 'Alternate: Tempered Copper Ingot' },

  // Refinery Alternates
  'Alternate: Diluted Packaged Fuel': { building: 'Refinery', time: 2, inputs: { 'Heavy Oil Residue': 1, 'Packaged Water': 2 }, output: 2, isDefault: false, replaces: null, name: 'Alternate: Diluted Packaged Fuel' },
  'Alternate: Electrode Aluminum Scrap': { building: 'Refinery', time: 4, inputs: { 'Alumina Solution': 12, 'Petroleum Coke': 4 }, output: 20, isDefault: false, replaces: 'Aluminum Scrap', name: 'Alternate: Electrode Aluminum Scrap' },
  'Alternate: Heavy Oil Residue': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 3 }, output: 4, isDefault: false, replaces: null, name: 'Alternate: Heavy Oil Residue' },
  'Alternate: Leached Caterium Ingot': { building: 'Refinery', time: 10, inputs: { 'Caterium Ore': 9, 'Sulfuric Acid': 5 }, output: 6, isDefault: false, replaces: 'Caterium Ingot', name: 'Alternate: Leached Caterium Ingot' },
  'Alternate: Leached Copper Ingot': { building: 'Refinery', time: 12, inputs: { 'Copper Ore': 9, 'Sulfuric Acid': 5 }, output: 22, isDefault: false, replaces: 'Copper Ingot', name: 'Alternate: Leached Copper Ingot' },
  'Alternate: Leached Iron Ingot': { building: 'Refinery', time: 6, inputs: { 'Iron Ore': 5, 'Sulfuric Acid': 1 }, output: 10, isDefault: false, replaces: 'Iron Ingot', name: 'Alternate: Leached Iron Ingot' },
  'Alternate: Polymer Resin': { building: 'Refinery', time: 6, inputs: { 'Crude Oil': 6 }, output: 13, isDefault: false, replaces: null, name: 'Alternate: Polymer Resin' },
  'Alternate: Pure Caterium Ingot': { building: 'Refinery', time: 5, inputs: { 'Caterium Ore': 2, 'Water': 2 }, output: 1, isDefault: false, replaces: 'Caterium Ingot', name: 'Alternate: Pure Caterium Ingot' },
  'Alternate: Pure Copper Ingot': { building: 'Refinery', time: 24, inputs: { 'Copper Ore': 6, 'Water': 4 }, output: 15, isDefault: false, replaces: 'Copper Ingot', name: 'Alternate: Pure Copper Ingot' },
  'Alternate: Pure Iron Ingot': { building: 'Refinery', time: 12, inputs: { 'Iron Ore': 7, 'Water': 4 }, output: 13, isDefault: false, replaces: 'Iron Ingot', name: 'Alternate: Pure Iron Ingot' },
  'Alternate: Pure Quartz Crystal': { building: 'Refinery', time: 8, inputs: { 'Raw Quartz': 9, 'Water': 5 }, output: 7, isDefault: false, replaces: 'Quartz Crystal', name: 'Alternate: Pure Quartz Crystal' },
  'Alternate: Recycled Plastic': { building: 'Refinery', time: 12, inputs: { 'Rubber': 6, 'Fuel': 6 }, output: 12, isDefault: false, replaces: 'Plastic', name: 'Alternate: Recycled Plastic' },
  'Alternate: Recycled Rubber': { building: 'Refinery', time: 12, inputs: { 'Plastic': 6, 'Fuel': 6 }, output: 12, isDefault: false, replaces: 'Rubber', name: 'Alternate: Recycled Rubber' },
  'Alternate: Steamed Copper Sheet': { building: 'Refinery', time: 8, inputs: { 'Copper Ingot': 3, 'Water': 3 }, output: 3, isDefault: false, replaces: 'Copper Sheet', name: 'Alternate: Steamed Copper Sheet' },
  'Alternate: Turbo Heavy Fuel': { building: 'Refinery', time: 8, inputs: { 'Heavy Oil Residue': 5, 'Compacted Coal': 4 }, output: 4, isDefault: false, replaces: null, name: 'Alternate: Turbo Heavy Fuel' },
  'Alternate: Wet Concrete': { building: 'Refinery', time: 3, inputs: { 'Limestone': 6, 'Water': 5 }, output: 4, isDefault: false, replaces: 'Concrete', name: 'Alternate: Wet Concrete' },
  'Alternate: Polyester Fabric': { building: 'Refinery', time: 2, inputs: { 'Polymer Resin': 1, 'Water': 1 }, output: 1, isDefault: false, replaces: null, name: 'Alternate: Polyester Fabric' },

  // Smelter Alternates
  'Alternate: Pure Aluminum Ingot': { building: 'Smelter', time: 2, inputs: { 'Aluminum Scrap': 2 }, output: 1, isDefault: false, replaces: 'Aluminum Ingot', name: 'Alternate: Pure Aluminum Ingot' },

  // Blender Alternates
  'Alternate: Cooling Device': { building: 'Blender', time: 24, inputs: { 'Heat Sink': 4, 'Motor': 1, 'Nitrogen Gas': 24 }, output: 2, isDefault: false, replaces: 'Cooling System', name: 'Alternate: Cooling Device' },
  'Alternate: Diluted Fuel': { building: 'Blender', time: 6, inputs: { 'Heavy Oil Residue': 5, 'Water': 10 }, output: 10, isDefault: false, replaces: 'Fuel', name: 'Alternate: Diluted Fuel' },
  'Alternate: Distilled Silica': { building: 'Blender', time: 6, inputs: { 'Dissolved Silica': 12, 'Limestone': 5, 'Water': 10 }, output: 27, isDefault: false, replaces: 'Silica', name: 'Alternate: Distilled Silica' },
  'Alternate: Heat-Fused Frame': { building: 'Blender', time: 20, inputs: { 'Heavy Modular Frame': 1, 'Aluminum Ingot': 50, 'Nitric Acid': 8, 'Fuel': 10 }, output: 1, isDefault: false, replaces: 'Fused Modular Frame', name: 'Alternate: Heat-Fused Frame' },
  'Alternate: Instant Scrap': { building: 'Blender', time: 6, inputs: { 'Bauxite': 15, 'Coal': 10, 'Sulfuric Acid': 5, 'Water': 6 }, output: 30, isDefault: false, replaces: 'Aluminum Scrap', name: 'Alternate: Instant Scrap' },
  'Alternate: Sloppy Alumina': { building: 'Blender', time: 3, inputs: { 'Bauxite': 10, 'Water': 10 }, output: 12, isDefault: false, replaces: 'Alumina Solution', name: 'Alternate: Sloppy Alumina' },
  'Alternate: Turbo Blend Fuel': { building: 'Blender', time: 8, inputs: { 'Fuel': 2, 'Heavy Oil Residue': 4, 'Sulfur': 3, 'Petroleum Coke': 3 }, output: 6, isDefault: false, replaces: null, name: 'Alternate: Turbo Blend Fuel' },
};

// Explicit list of fluid items
const FLUID_ITEMS = new Set([
  'Water', 'Crude Oil', 'Heavy Oil Residue', 'Fuel', 'Turbofuel',
  'Liquid Biofuel', 'Alumina Solution', 'Sulfuric Acid',
  'Nitric Acid', 'Nitrogen Gas', 'Dissolved Silica', 'Excited Photonic Matter'
]);

// Raw resources (things that come from miners/extractors)
const RAW_RESOURCES = new Set([
  'Iron Ore', 'Copper Ore', 'Limestone', 'Coal', 'Caterium Ore',
  'Raw Quartz', 'Sulfur', 'Bauxite', 'Uranium', 'Crude Oil',
  'Water', 'Nitrogen Gas', 'Heavy Oil Residue', 'Copper Powder',
  'Pressure Conversion Cube', 'Fabric', 'Alumina Solution',
  'Dark Matter Residue', 'Excited Photonic Matter', 'SAM Fluctuator',
  'Power Shard', 'Time Crystal', 'Dark Matter Crystal', 'Ficsonium',
  'Ficsite Trigon'
]);

// Helper function to calculate clock speed from shard count
const getClockSpeed = (shards) => {
  return 100 + (shards * 50); // 0=100%, 1=150%, 2=200%, 3=250%
};

function SatisfactoryCalculator() {
  const [productionLines, setProductionLines] = useState([
    {
      id: Date.now().toString(),
      name: 'Production Line 1',
      targetItems: [{ item: 'Heavy Modular Frame', rate: 2 }],
      results: null,
      powerShards: {},
      resourcePurities: {},
      isExpanded: true
    }
  ]);
  const [editingLineId, setEditingLineId] = useState(null);
  const [selectedBelt, setSelectedBelt] = useState('Mk.1');
  const [selectedPipe, setSelectedPipe] = useState('Mk.1');
  const [selectedMiner, setSelectedMiner] = useState('Mk.1');
  const [selectedAlternates, setSelectedAlternates] = useState([]);
  const [alternateSearchTerm, setAlternateSearchTerm] = useState('');
  const [alternateRecipesExpanded, setAlternateRecipesExpanded] = useState(false);

  // Get active recipes (default + selected alternates)
  const getActiveRecipes = () => {
    const active = { ...DEFAULT_RECIPES };

    selectedAlternates.forEach(altName => {
      const alt = ALTERNATE_RECIPES[altName];
      if (alt && alt.replaces) {
        // Replace default recipe for this item
        active[alt.replaces] = alt;
      } else if (alt) {
        // Add new recipe option (doesn't replace, just adds)
        active[altName] = alt;
      }
    });

    return active;
  };

  // Get current active recipes
  const RECIPES = getActiveRecipes();

  // Get all items that can be produced (have recipes)
  const producibleItems = Object.keys(RECIPES).filter(item => {
    const recipe = RECIPES[item];
    return ['Assembler', 'Manufacturer', 'Blender', 'Particle Accelerator', 'Refinery', 'Quantum Encoder'].includes(recipe.building);
  }).sort();

  // LocalStorage key
  const STORAGE_KEY = 'satisfactory_production_state';

  // Save state to localStorage
  const saveToLocalStorage = () => {
    const state = {
      productionLines,
      selectedBelt,
      selectedPipe,
      selectedMiner,
      selectedAlternates
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // Load state from localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);

        // New format with productionLines
        if (state.productionLines) {
          setProductionLines(state.productionLines);
        }
        // Backwards compatibility: migrate old format
        else if (state.targetItems) {
          setProductionLines([{
            id: Date.now().toString(),
            name: 'Production Line 1',
            targetItems: state.targetItems || [{ item: 'Heavy Modular Frame', rate: 2 }],
            results: null,
            powerShards: state.powerShards || {},
            resourcePurities: state.resourcePurities || {},
            isExpanded: true
          }]);
        }

        if (state.selectedBelt) setSelectedBelt(state.selectedBelt);
        if (state.selectedPipe) setSelectedPipe(state.selectedPipe);
        if (state.selectedMiner) setSelectedMiner(state.selectedMiner);
        if (state.selectedAlternates) setSelectedAlternates(state.selectedAlternates);
        return true;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return false;
  };

  // Export state to JSON file
  const exportToFile = () => {
    const state = {
      productionLines,
      selectedBelt,
      selectedPipe,
      selectedMiner,
      selectedAlternates
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'satisfactory_production_plan.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import state from JSON file
  const importFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const state = JSON.parse(e.target.result);

          // New format with productionLines
          if (state.productionLines) {
            setProductionLines(state.productionLines);
          }
          // Backwards compatibility: migrate old format
          else if (state.targetItems) {
            setProductionLines([{
              id: Date.now().toString(),
              name: 'Production Line 1',
              targetItems: state.targetItems || [{ item: 'Heavy Modular Frame', rate: 2 }],
              results: null,
              powerShards: state.powerShards || {},
              resourcePurities: state.resourcePurities || {},
              isExpanded: true
            }]);
          }

          if (state.selectedBelt) setSelectedBelt(state.selectedBelt);
          if (state.selectedPipe) setSelectedPipe(state.selectedPipe);
          if (state.selectedMiner) setSelectedMiner(state.selectedMiner);
          if (state.selectedAlternates) setSelectedAlternates(state.selectedAlternates);
          alert('Production plan loaded successfully!');
        } catch (error) {
          console.error('Error importing file:', error);
          alert('Error loading file. Please ensure it is a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be loaded again
    event.target.value = '';
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This will reset everything to default values.')) {
      setProductionLines([{
        id: Date.now().toString(),
        name: 'Production Line 1',
        targetItems: [{ item: 'Heavy Modular Frame', rate: 2 }],
        results: null,
        powerShards: {},
        resourcePurities: {},
        isExpanded: true
      }]);
      setSelectedBelt('Mk.1');
      setSelectedPipe('Mk.1');
      setSelectedMiner('Mk.1');
      setSelectedAlternates([]);
      localStorage.removeItem(STORAGE_KEY);
      alert('All data cleared!');
    }
  };

  // Production Line Management Functions
  const addProductionLine = () => {
    const newLine = {
      id: Date.now().toString(),
      name: `Production Line ${productionLines.length + 1}`,
      targetItems: [{ item: producibleItems[0], rate: 1 }],
      results: null,
      powerShards: {},
      resourcePurities: {},
      isExpanded: true
    };
    setProductionLines(prev => [...prev, newLine]);
  };

  const duplicateProductionLine = (lineId) => {
    const lineToDuplicate = productionLines.find(l => l.id === lineId);
    if (!lineToDuplicate) return;

    const newLine = {
      id: Date.now().toString(),
      name: `${lineToDuplicate.name} (Copy)`,
      targetItems: JSON.parse(JSON.stringify(lineToDuplicate.targetItems)), // Deep copy
      results: null, // Don't copy results, needs recalculation
      powerShards: JSON.parse(JSON.stringify(lineToDuplicate.powerShards)), // Deep copy
      resourcePurities: JSON.parse(JSON.stringify(lineToDuplicate.resourcePurities)), // Deep copy
      isExpanded: true
    };
    setProductionLines(prev => [...prev, newLine]);
  };

  const deleteProductionLine = (lineId) => {
    if (productionLines.length <= 1) {
      alert('Cannot delete the last production line!');
      return;
    }

    const lineToDelete = productionLines.find(l => l.id === lineId);
    if (!lineToDelete) return;

    if (confirm(`Are you sure you want to delete "${lineToDelete.name}"?`)) {
      setProductionLines(prev => prev.filter(l => l.id !== lineId));
    }
  };

  const toggleLineExpanded = (lineId) => {
    setProductionLines(prev => prev.map(l =>
      l.id === lineId ? { ...l, isExpanded: !l.isExpanded } : l
    ));
  };

  const updateLineName = (lineId, newName) => {
    setProductionLines(prev => prev.map(l =>
      l.id === lineId ? { ...l, name: newName } : l
    ));
    setEditingLineId(null);
  };

  const startEditingName = (lineId) => {
    setEditingLineId(lineId);
  };

  const cancelEditingName = () => {
    setEditingLineId(null);
  };

  // Alternate Recipe Management Functions
  const addAlternateRecipe = (recipeName) => {
    if (!selectedAlternates.includes(recipeName)) {
      setSelectedAlternates(prev => [...prev, recipeName]);
    }
  };

  const removeAlternateRecipe = (recipeName) => {
    setSelectedAlternates(prev => prev.filter(name => name !== recipeName));
  };

  const toggleAlternateRecipe = (recipeName) => {
    if (selectedAlternates.includes(recipeName)) {
      removeAlternateRecipe(recipeName);
    } else {
      addAlternateRecipe(recipeName);
    }
  };

  // Auto-load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage();
  }, [productionLines, selectedBelt, selectedPipe, selectedMiner, selectedAlternates]);

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

  const calculateProduction = (lineId) => {
    // Get the production line
    const line = productionLines.find(l => l.id === lineId);
    if (!line) return;

    // Extract line-specific data
    const targetItems = line.targetItems;
    const resourcePurities = line.resourcePurities;
    const powerShards = line.powerShards;

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

    // DEBUG: Log what's in itemNeeds
    console.log('\n=== itemNeeds after calculateRequirements ===');
    console.log(`Total items: ${Object.keys(itemNeeds).length}`);
    console.log('Alclad Aluminum Sheet present:', itemNeeds['Alclad Aluminum Sheet'] !== undefined);
    if (itemNeeds['Alclad Aluminum Sheet']) {
      console.log(`Alclad Aluminum Sheet rate needed: ${itemNeeds['Alclad Aluminum Sheet']}/min`);
    }
    console.log('=============================================\n');

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

    // DEBUG: Log what's in itemTotalProduction
    console.log('\n=== itemTotalProduction contents ===');
    console.log(`Total items: ${Object.keys(itemTotalProduction).length}`);
    console.log('Alclad Aluminum Sheet present:', itemTotalProduction['Alclad Aluminum Sheet'] !== undefined);
    if (itemTotalProduction['Alclad Aluminum Sheet']) {
      console.log(`Alclad Aluminum Sheet rate: ${itemTotalProduction['Alclad Aluminum Sheet']}/min`);
    }
    console.log('===================================\n');

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

      // DEBUG: Log Superposition Oscillator check
      if (item === 'Superposition Oscillator') {
        console.log(`\n>>> Checking Superposition Oscillator (depth ${depth})`);
        console.log(`    In itemTotalProduction: ${itemTotalProduction[item] !== undefined ? 'YES' : 'NO'}`);
        if (itemTotalProduction[item] !== undefined) {
          console.log(`    itemTotalProduction value: ${itemTotalProduction[item]}/min`);
        }
      }

      // Find the most limiting input
      let maxProducible = Infinity;

      for (const [inputItem, inputAmount] of Object.entries(recipe.inputs)) {
        const inputPerMinute = (inputAmount / recipe.time) * 60;
        const inputAvailable = propagateCapacityLimits(inputItem, depth + 1);

        // Calculate how much of this item we can make with available input
        const producibleFromThisInput = (inputAvailable / inputPerMinute) * ((recipe.output / recipe.time) * 60);

        // DEBUG: Log each input check (depth 0-1 for tracing Superposition Oscillator)
        if (depth === 0 || (depth === 1 && item === 'Superposition Oscillator')) {
          const indent = '  '.repeat(depth + 1);
          console.log(`${indent}Input: ${inputItem}`);
          console.log(`${indent}  Need: ${inputPerMinute.toFixed(2)}/min`);
          console.log(`${indent}  Available: ${inputAvailable === Infinity ? 'Infinity' : inputAvailable.toFixed(2)}/min`);
          console.log(`${indent}  Can produce: ${producibleFromThisInput === Infinity ? 'Infinity' : producibleFromThisInput.toFixed(2)}/min`);
        }

        maxProducible = Math.min(maxProducible, producibleFromThisInput);
      }

      // Also check the total production of this item
      const totalProduction = itemTotalProduction[item] || 0;
      maxProducible = Math.min(maxProducible, totalProduction);

      // DEBUG: Log Superposition Oscillator result
      if (item === 'Superposition Oscillator') {
        console.log(`    Max producible from inputs: ${maxProducible === Infinity ? 'Infinity' : maxProducible.toFixed(2)}/min`);
        console.log(`    Total production limit: ${totalProduction}/min`);
        console.log(`    FINAL RESULT: ${maxProducible.toFixed(2)}/min\n`);
      }

      const result = maxProducible;
      calculationCache[item] = result;
      return result;
    };

    // Calculate actual achievable rates for all target items
    const targetItemResults = targetItems.map(target => {
      console.log('='.repeat(80));
      console.log(`DEBUG: Calculating achievable rate for ${target.item}`);
      console.log(`Requested rate: ${target.rate}/min`);
      console.log(`Item in itemTotalProduction: ${itemTotalProduction[target.item] !== undefined ? 'YES' : 'NO'}`);
      if (itemTotalProduction[target.item] !== undefined) {
        console.log(`itemTotalProduction value: ${itemTotalProduction[target.item]}/min`);
      }
      console.log(`Item has recipe: ${RECIPES[target.item] ? 'YES' : 'NO'}`);
      if (RECIPES[target.item]) {
        console.log(`Recipe building: ${RECIPES[target.item].building}`);
      }

      const actualRate = propagateCapacityLimits(target.item);

      console.log(`Result from propagateCapacityLimits: ${actualRate}/min`);
      console.log(`Final achievable rate: ${Math.min(actualRate, target.rate)}/min`);
      console.log('='.repeat(80));

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

    // Update this line's results
    setProductionLines(prev => prev.map(l =>
      l.id === lineId ? {
        ...l,
        results: {
          buildings: buildingList,
          resources: actualResourceNeeds,
          power: totalPower,
          targetItemResults: targetItemResults
        }
      } : l
    ));
  };

  const handlePurityChange = (lineId, resource, newPurity) => {
    setProductionLines(prev => prev.map(l =>
      l.id === lineId ? {
        ...l,
        resourcePurities: {
          ...l.resourcePurities,
          [resource]: newPurity
        }
      } : l
    ));
    // Recalculate with new purity
    setTimeout(() => calculateProduction(lineId), 0);
  };

  const handleShardChange = (lineId, key, shards) => {
    setProductionLines(prev => prev.map(l =>
      l.id === lineId ? {
        ...l,
        powerShards: {
          ...l.powerShards,
          [key]: parseInt(shards) || 0
        }
      } : l
    ));
    // Recalculate with new shards
    setTimeout(() => calculateProduction(lineId), 0);
  };

  const handleTargetRateChange = (lineId, index, value) => {
    const rate = parseFloat(value);
    setProductionLines(prev => prev.map(l => {
      if (l.id !== lineId) return l;
      const newItems = [...l.targetItems];
      newItems[index] = { ...newItems[index], rate: isNaN(rate) || rate < 0 ? 0 : rate };
      return { ...l, targetItems: newItems };
    }));
  };

  const handleTargetItemChange = (lineId, index, item) => {
    setProductionLines(prev => prev.map(l => {
      if (l.id !== lineId) return l;
      const newItems = [...l.targetItems];
      newItems[index] = { ...newItems[index], item };
      return { ...l, targetItems: newItems };
    }));
  };

  const addTargetItem = (lineId) => {
    setProductionLines(prev => prev.map(l =>
      l.id === lineId ? {
        ...l,
        targetItems: [...l.targetItems, { item: producibleItems[0], rate: 1 }]
      } : l
    ));
  };

  const removeTargetItem = (lineId, index) => {
    setProductionLines(prev => prev.map(l => {
      if (l.id !== lineId) return l;
      if (l.targetItems.length <= 1) return l; // Don't remove last item
      return {
        ...l,
        targetItems: l.targetItems.filter((_, i) => i !== index)
      };
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-yellow-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 border-4 border-orange-600">
          <h1 className="text-4xl font-bold text-orange-400 mb-2 text-center">
            Satisfactory Production Calculator
          </h1>
          <p className="text-gray-400 text-center mb-4">Plan your factory production chains</p>

          {/* Data Management Section */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border-2 border-blue-700">
            <h2 className="text-lg font-bold text-blue-400 mb-3 text-center">Data Management</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={exportToFile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 flex items-center gap-2"
              >
                <span>📥</span> Export to File
              </button>
              <label className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 cursor-pointer flex items-center gap-2">
                <span>📤</span> Import from File
                <input
                  type="file"
                  accept=".json"
                  onChange={importFromFile}
                  className="hidden"
                />
              </label>
              <button
                onClick={clearAllData}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 flex items-center gap-2"
              >
                <span>🗑️</span> Clear All Data
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Data is automatically saved to your browser's local storage
            </p>
          </div>

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

          {/* Alternate Recipes Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-purple-700">
            <div
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setAlternateRecipesExpanded(!alternateRecipesExpanded)}
            >
              <div className="flex items-center gap-2">
                <span className="text-purple-400">
                  {alternateRecipesExpanded ? '▼' : '▶'}
                </span>
                <h2 className="text-xl font-bold text-purple-400">
                  Alternate Recipes {selectedAlternates.length > 0 && `(${selectedAlternates.length} active)`}
                </h2>
              </div>
            </div>

            {alternateRecipesExpanded && (
              <>
                {/* Active Alternates */}
                {selectedAlternates.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Active Alternates ({selectedAlternates.length})</h3>
                <div className="space-y-2">
                  {selectedAlternates.map(altName => {
                    const alt = ALTERNATE_RECIPES[altName];
                    if (!alt) return null;

                    const inputsStr = Object.entries(alt.inputs).map(([item, qty]) => `${item} (${qty})`).join(' + ');
                    const outputRate = ((alt.output / alt.time) * 60).toFixed(1);
                    const defaultRecipe = alt.replaces ? DEFAULT_RECIPES[alt.replaces] : null;
                    let efficiencyNote = '';

                    if (defaultRecipe) {
                      const defaultRate = ((defaultRecipe.output / defaultRecipe.time) * 60).toFixed(1);
                      const improvement = ((outputRate / defaultRate - 1) * 100).toFixed(0);
                      efficiencyNote = improvement > 0 ? ` (+${improvement}% output)` : improvement < 0 ? ` (${improvement}% output)` : '';
                    }

                    return (
                      <div key={altName} className="bg-gray-700 rounded p-3 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-green-400">{altName}</div>
                          <div className="text-xs text-gray-300 mt-1">
                            {alt.building} | {inputsStr} → {alt.output} {alt.replaces || 'output'} ({outputRate}/min){efficiencyNote}
                          </div>
                        </div>
                        <button
                          onClick={() => removeAlternateRecipe(altName)}
                          className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Alternates */}
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                Available Alternates ({Object.keys(ALTERNATE_RECIPES).filter(name => !selectedAlternates.includes(name)).length})
              </h3>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={alternateSearchTerm}
                  onChange={(e) => setAlternateSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-4 py-2 border-2 border-gray-600 focus:border-purple-500 focus:outline-none"
                  id="alternateSearch"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {Object.entries(ALTERNATE_RECIPES)
                  .filter(([altName]) => !selectedAlternates.includes(altName))
                  .filter(([altName, alt]) => {
                    if (!alternateSearchTerm) return true;
                    const searchLower = alternateSearchTerm.toLowerCase();
                    return altName.toLowerCase().includes(searchLower) ||
                           alt.building.toLowerCase().includes(searchLower) ||
                           (alt.replaces && alt.replaces.toLowerCase().includes(searchLower)) ||
                           Object.keys(alt.inputs).some(input => input.toLowerCase().includes(searchLower));
                  })
                  .sort((a, b) => a[1].building.localeCompare(b[1].building) || a[0].localeCompare(b[0]))
                  .map(([altName, alt]) => {
                    const inputsStr = Object.entries(alt.inputs).map(([item, qty]) => `${item} (${qty})`).join(' + ');
                    const outputRate = ((alt.output / alt.time) * 60).toFixed(1);
                    const defaultRecipe = alt.replaces ? DEFAULT_RECIPES[alt.replaces] : null;
                    let efficiencyNote = '';

                    if (defaultRecipe) {
                      const defaultRate = ((defaultRecipe.output / defaultRecipe.time) * 60).toFixed(1);
                      const improvement = ((outputRate / defaultRate - 1) * 100).toFixed(0);
                      efficiencyNote = improvement > 0 ? ` (+${improvement}% output)` : improvement < 0 ? ` (${improvement}% output)` : '';
                    }

                    return (
                      <div key={altName} className="bg-gray-700 rounded p-3 flex items-start justify-between hover:bg-gray-600">
                        <div className="flex-1">
                          <div className="font-semibold text-purple-300">{altName}</div>
                          <div className="text-xs text-gray-300 mt-1">
                            <span className="text-orange-400">{alt.building}</span> | {inputsStr} → {alt.output} {alt.replaces || 'output'} ({outputRate}/min){efficiencyNote}
                          </div>
                        </div>
                        <button
                          onClick={() => addAlternateRecipe(altName)}
                          className="ml-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded"
                        >
                          Add
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
              </>
            )}
          </div>

          {/* Production Lines Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border-2 border-orange-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-orange-400">Production Lines</h2>
              <button
                onClick={addProductionLine}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                + Add Production Line
              </button>
            </div>

            <div className="space-y-4">
              {productionLines.map((line) => (
                <div key={line.id} className="bg-gray-700 rounded-lg border-2 border-gray-600">
                  {/* Production Line Header */}
                  <div className="flex items-center gap-3 p-4 bg-gray-750">
                    <button
                      onClick={() => toggleLineExpanded(line.id)}
                      className="text-orange-300 hover:text-orange-400 text-xl font-bold transition-colors"
                    >
                      {line.isExpanded ? '▼' : '▶'}
                    </button>

                    {editingLineId === line.id ? (
                      <input
                        type="text"
                        defaultValue={line.name}
                        autoFocus
                        onBlur={(e) => updateLineName(line.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') updateLineName(line.id, e.target.value);
                          if (e.key === 'Escape') cancelEditingName();
                        }}
                        className="flex-1 bg-gray-600 text-white rounded px-3 py-1 border-2 border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <h3
                        onClick={() => startEditingName(line.id)}
                        className="flex-1 text-lg font-bold text-orange-300 cursor-pointer hover:text-orange-400 transition-colors"
                      >
                        {line.name}
                      </h3>
                    )}

                    <button
                      onClick={() => duplicateProductionLine(line.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors duration-200"
                      title="Duplicate this production line"
                    >
                      📋 Copy
                    </button>

                    <button
                      onClick={() => deleteProductionLine(line.id)}
                      disabled={productionLines.length <= 1}
                      className={`${
                        productionLines.length <= 1
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      } font-bold py-1 px-3 rounded transition-colors duration-200`}
                      title={productionLines.length <= 1 ? 'Cannot delete last line' : 'Delete this production line'}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Production Line Content (shown when expanded) */}
                  {line.isExpanded && (
                    <div className="p-4">
                      {/* Target Production */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-md font-bold text-orange-300">Target Production</h4>
                          <button
                            onClick={() => addTargetItem(line.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition-colors duration-200 text-sm"
                          >
                            + Add Item
                          </button>
                        </div>

                        <div className="space-y-3">
                          {line.targetItems.map((target, index) => (
                            <div key={index} className="grid md:grid-cols-2 gap-4 p-3 bg-gray-600 rounded border border-gray-500">
                              <div>
                                <label className="block text-orange-300 font-semibold mb-1 text-sm">
                                  Item {line.targetItems.length > 1 ? `#${index + 1}` : ''}
                                </label>
                                <select
                                  value={target.item}
                                  onChange={(e) => handleTargetItemChange(line.id, index, e.target.value)}
                                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                                >
                                  {producibleItems.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="block text-orange-300 font-semibold mb-1 text-sm">
                                    Rate (per minute)
                                  </label>
                                  <input
                                    type="number"
                                    value={target.rate}
                                    onChange={(e) => handleTargetRateChange(line.id, index, e.target.value)}
                                    min="0"
                                    step="1"
                                    className="w-full bg-gray-700 text-white rounded px-3 py-2 border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                                  />
                                </div>
                                {line.targetItems.length > 1 && (
                                  <div className="flex items-end">
                                    <button
                                      onClick={() => removeTargetItem(line.id, index)}
                                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors duration-200 text-sm"
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
                      </div>

                      <button
                        onClick={() => calculateProduction(line.id)}
                        className="w-full mb-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                      >
                        Calculate Production Chain
                      </button>

                      {/* Results Section */}
                      {line.results && (
                        <div className="space-y-4">
                          {/* Production Rate Summary */}
                          {line.results.targetItemResults.some(t => t.actualRate < t.requestedRate) && (
                            <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 border-2 border-red-600">
                              <h3 className="text-lg font-bold text-red-300 mb-3">
                                ⚠ Production Capacity Limited
                              </h3>
                              {line.results.targetItemResults.map((target, idx) => {
                                if (target.actualRate < target.requestedRate) {
                                  return (
                                    <div key={idx} className="mb-2 last:mb-0">
                                      <p className="text-white font-semibold text-sm">{target.item}</p>
                                      <div className="ml-3">
                                        <p className="text-white text-xs">
                                          Requested: <span className="font-bold">{target.requestedRate.toFixed(2)}/min</span>
                                        </p>
                                        <p className="text-white text-xs">
                                          Achievable: <span className="font-bold">{target.actualRate.toFixed(2)}/min</span>
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                              <p className="text-red-200 text-xs mt-3">
                                Resource supply constraints are preventing full production. Add more resource extraction or reduce target rates.
                              </p>
                            </div>
                          )}

                          {/* Power Summary */}
                          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-4 border-2 border-yellow-600">
                            <h3 className="text-lg font-bold text-yellow-300 mb-1">
                              Total Power Required
                            </h3>
                            <p className="text-2xl font-bold text-white">
                              {line.results.power.toFixed(2)} MW
                            </p>
                          </div>

                          {/* Buildings Required */}
                          <div className="bg-gray-700 rounded-lg p-4 border-2 border-orange-700">
                            <h3 className="text-lg font-bold text-orange-400 mb-3">
                              Production Configurations
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                              {line.results.buildings
                    .sort((a, b) => a.building.localeCompare(b.building) || a.item.localeCompare(b.item))
                    .map((entry) => {
                      const key = entry.key;
                      const maxShards = entry.intCount * 3;

                      // Get recipe for this item to show inputs
                      const recipe = RECIPES[entry.item];

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
                                onChange={(e) => handlePurityChange(line.id, entry.item, e.target.value)}
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
                              onChange={(e) => handleShardChange(line.id, key, e.target.value)}
                              className="bg-gray-600 text-white text-sm rounded py-1 border border-gray-500 focus:border-orange-500 focus:outline-none"
                              style={{ width: `${Math.max(4, maxShards.toString().length + 2)}ch`, paddingLeft: '15px', paddingRight: '15px' }}
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

                          {/* Input Rates */}
                          {recipe && recipe.inputs && Object.keys(recipe.inputs).length > 0 && (() => {
                            // Calculate if any inputs are belt-limited per machine
                            let maxDownclockNeeded = null;
                            let limitingInput = null;

                            const inputDisplays = Object.entries(recipe.inputs).map(([inputItem, inputAmount]) => {
                              const inputPerMinute = (inputAmount / recipe.time) * 60;
                              const totalInputRate = inputPerMinute * entry.actualRate / ((recipe.output / recipe.time) * 60);

                              const isFluid = FLUID_ITEMS.has(inputItem);
                              const capacity = isFluid ? PIPE_TIERS[selectedPipe] : BELT_TIERS[selectedBelt];
                              const transportType = isFluid ? 'pipe' : 'belt';

                              const perMachineCapped = inputPerMinute > capacity;
                              const totalCapped = totalInputRate > capacity;

                              // Calculate downclocking needed if per-machine capped
                              if (perMachineCapped) {
                                const downclockPercent = (capacity / inputPerMinute) * 100;
                                if (maxDownclockNeeded === null || downclockPercent < maxDownclockNeeded) {
                                  maxDownclockNeeded = downclockPercent;
                                  limitingInput = inputItem;
                                }
                              }

                              let statusColor = 'text-green-400';
                              let statusIcon = '✓';
                              let statusText = '';

                              if (perMachineCapped) {
                                const downclockPercent = (capacity / inputPerMinute) * 100;
                                statusColor = 'text-red-400';
                                statusIcon = '🔴';
                                statusText = ` (${inputPerMinute.toFixed(1)}/min per machine > ${capacity} ${transportType} - downclock to ${downclockPercent.toFixed(1)}% or use manifold/higher tier)`;
                              } else if (totalCapped) {
                                // Calculate how many belts/pipes needed
                                const beltsNeeded = Math.ceil(totalInputRate / capacity);
                                statusColor = 'text-blue-400';
                                statusIcon = '→';
                                statusText = ` (${beltsNeeded} ${transportType}s needed)`;
                              }

                              return (
                                <div key={inputItem} className={`text-xs ${statusColor} flex items-start gap-1`}>
                                  <span className="flex-shrink-0">{statusIcon}</span>
                                  <span className="flex-1">
                                    {inputItem}: {inputPerMinute.toFixed(2)}/min × {entry.intCount} = {totalInputRate.toFixed(2)}/min{statusText}
                                  </span>
                                </div>
                              );
                            });

                            return (
                              <div className="mt-3 pt-3 border-t border-gray-600">
                                <div className="text-xs font-semibold text-gray-400 mb-1">Inputs:</div>
                                {inputDisplays}
                                {maxDownclockNeeded !== null && (
                                  <div className="mt-2 p-2 bg-red-900 bg-opacity-30 rounded border border-red-600">
                                    <div className="text-xs text-red-300 font-semibold">
                                      ⚠ Belt/Pipe Limited: Downclock to {maxDownclockNeeded.toFixed(1)}% to match {limitingInput} supply
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                </div>
              </div>

                          {/* Raw Resources */}
                          <div className="bg-gray-700 rounded-lg p-4 border-2 border-orange-700">
                            <h3 className="text-lg font-bold text-orange-400 mb-3">
                              Raw Resources Required (per minute)
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {Object.entries(line.results.resources)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([resource, amount]) => (
                                  <div key={resource} className="bg-gray-600 rounded p-3 border border-gray-500">
                                    <div className="font-semibold text-orange-300 text-sm">{resource}</div>
                                    <div className="text-xl font-bold text-white mt-1">
                                      {amount.toFixed(2)}/min
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-orange-200 text-sm">
          Default recipes only • Underclocking calculated when buildings would overproduce
          <br />
          Note: Production configurations are consolidated when possible, but split when exceeding belt/pipe capacity
          <br />
          <span className="text-green-400">✓</span> = Within capacity •
          <span className="text-blue-400">→</span> = Multiple belts/pipes needed •
          <span className="text-red-400">🔴</span> = Per-machine exceeds capacity (requires manifold or higher tier)
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SatisfactoryCalculator />);
