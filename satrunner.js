const { useState, useEffect } = React;

// satdata.js is loaded first, making CONSTS and satdata globally available
// CONSTS is already global from satdata.js, no need to redeclare
// Access via: CONSTS (global) or satdata.CONSTS (via window.satdata)


function SatisfactoryCalculator() {

  const STORAGE_KEY = 'satisfactory_production_state';

  const DEFAULT_LINE = {
    name: 'Production Line 1',
    targetItems: [{ item_id: CONSTS.NAME2ITEM_ID['Smart Plating'], rate: 2 }],
    isExpanded: true
  };

  const DEFAULT_WORLD = {
    name: 'my world',
    productionLines: [DEFAULT_LINE],
    activeLineIdx: 0,
    selectedBelt: 'Mk.1',
    selectedPipe: 'Mk.1',
    selectedMiner: 'Miner Mk.1',
    selectedAlternatives: {},
  }

  const [world, setWorld] = useState(DEFAULT_WORLD);

  // UI state for global settings
  const [selectedBelt, setSelectedBelt] = useState('Mk.1');
  const [selectedPipe, setSelectedPipe] = useState('Mk.1');
  const [selectedMiner, setSelectedMiner] = useState('Miner Mk.1');
  const [selectedAlternates, setSelectedAlternates] = useState([]);
  const [alternateRecipesExpanded, setAlternateRecipesExpanded] = useState(false);
  const [editingLineId, setEditingLineId] = useState(null);
  const [alternateSearchTerm, setAlternateSearchTerm] = useState('');
  const [selectedProductionFilter, setSelectedProductionFilter] = useState('elevator');

  // Extract constants from CONSTS
  const BELT_TIERS = CONSTS.BELT_TIERS;
  const PIPE_TIERS = CONSTS.PIPE_TIERS;

  // Miner tiers (from BUILDINGS data)
  const MINER_TIERS = {
    'Miner Mk.1': { base: 60, power: 5 },
    'Miner Mk.2': { base: 120, power: 12 },
    'Miner Mk.3': { base: 240, power: 30 },
  };

  // Create ALTERNATE_RECIPES object from ALT_RECIPES array
  const ALTERNATE_RECIPES = CONSTS.ALT_RECIPES.reduce((acc, recipe) => {
    acc[recipe.name] = recipe;
    return acc;
  }, {});

  // Create DEFAULT_RECIPES object
  const DEFAULT_RECIPES = CONSTS.DEFAULT_RECIPES.reduce((acc, recipe) => {
    acc[recipe.name] = recipe;
    return acc;
  }, {});

  // Create FLUID_ITEMS set for quick lookup
  const FLUID_ITEMS = new Set(
    CONSTS.ITEMS.filter(item => item.is_fluid).map(item => item.name)
  );

  // Get producible items filtered by production type
  const getProducibleItems = (filter) => {
    return CONSTS.ITEMS
      .filter(item => !item.is_resource)
      .filter(item => {
        if (filter === 'all') return true;
        if (filter === 'elevator') return item.is_elevator;

        // Building type filter
        // Get default recipe for this item and check building type
        const recipes = item.get_recipes ? item.get_recipes(world) : [];
        const defaultRecipe = recipes.find(r => r.isDefault) || recipes[0];
        return defaultRecipe && defaultRecipe.building === filter;
      })
      .map(item => item.name)
      .sort();
  };

  const producibleItems = getProducibleItems(selectedProductionFilter);

  // Extract BUILDINGS constant
  const BUILDINGS = CONSTS.BUILDINGS;
  const BUILDING2IDS = CONSTS.BUILDING2IDS;

  // Create RECIPES lookup by name (for easier access)
  const RECIPES = CONSTS.RECIPES.reduce((acc, recipe) => {
    acc[recipe.name] = recipe;
    return acc;
  }, {});

  // Helper function to get clock speed from shard count
  const getClockSpeed = (shards) => {
    if (shards === 0) return 100;
    if (shards === 1) return 150;
    if (shards === 2) return 200;
    if (shards === 3) return 250;
    return 100;
  };

  // Helper to calculate results from tiers
  const calculateResults = (line) => {
    if (!line.tiers) {
      return null;
    }

    const buildings = [];
    const resources = {};
    let totalPower = 0;

    // Process each tier
    line.tiers.forEach((tier, tierIdx) => {
      Object.values(tier).forEach(node => {
        const building = node.recipe ? node.recipe.building : (node.item.is_ore ? `${selectedMiner}` : 'Water Extractor');
        const buildingId = CONSTS.BUILDING2IDS[building];
        const basePower = buildingId !== undefined ? CONSTS.BUILDINGS[buildingId].power : 0;
        const buildingPower = basePower * node.building_count;
        totalPower += buildingPower;

        buildings.push({
          key: `${building}|${node.item.name}|${tierIdx}`,
          building: building,
          item: node.item.name,
          intCount: node.building_count,
          rate: node.rate,
          purity: 'Normal',
          consumers: []
        });
        // Track raw resources
        if (node.item.is_ore || node.item.name === 'Water' || node.item.name === 'Crude Oil' || node.item.name === 'Nitrogen Gas') {
          resources[node.item.name] = node.rate;
        }
      });
    });

    // Calculate target item results
    const targetItemResults = line.targetItems.map(target => {
      const itemName = CONSTS.ITEMS[target.item_id].name;
      return {
        item: itemName,
        requestedRate: target.rate,
        actualRate: target.rate // Assume achievable for now
      };
    });

    return {
      buildings,
      resources,
      power: totalPower,
      targetItemResults
    };
  };

  const calculate = () => {
    const lineIdx = world.activeLineIdx;
    const line = world.productionLines[lineIdx];

    // Call setupProdConf which populates line.tiers
    satdata.setupProdConf(line, world);

    // Calculate results from tiers
    const results = calculateResults(line);

    // Update state with the modified line
    setWorld({
      ...world,
      productionLines: world.productionLines.map((l, idx) =>
        idx === lineIdx ? { ...l, tiers: line.tiers, results } : l
      )
    });
  };

  // Calculate a specific production line by index
  const calculateLine = (lineIdx) => {
    const line = world.productionLines[lineIdx];
    satdata.setupProdConf(line, world);

    // Calculate results from tiers
    const results = calculateResults(line);
    setWorld({
      ...world,
      productionLines: world.productionLines.map((l, idx) =>
        idx === lineIdx ? { ...l, tiers: line.tiers, results } : l
      )
    });
  };

  // Save state to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(world));
  };


  // Load state from localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const world = JSON.parse(saved);
        setWorld(world);
        return true;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return false;
  };

  // Export data to JSON file
  const exportToFile = () => {
    const dataStr = JSON.stringify(world,null,2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `satisfactory-production-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const importFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const world = JSON.parse(e.target.result);
        if (world) {
          setWorld(world);
        }
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Failed to import file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all production lines? This cannot be undone.')) {
      setWorld({
        name: 'my world',
        productionLines: [DEFAULT_LINE],
        activeLineIdx: 0,
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Production line management functions
  const addProductionLine = () => {
    const newLine = {
      id: Date.now(),
      name: `Production Line ${world.productionLines.length + 1}`,
      targetItems: [{ item_id: CONSTS.NAME2ITEM_ID['Iron Plate'], rate: 10 }],
      isExpanded: true,
    };
    setWorld({
      ...world,
      productionLines: [...world.productionLines, newLine],
    });
  };

  const duplicateProductionLine = (lineId) => {
    const lineToDuplicate = world.productionLines.find(l => l.id === lineId);
    if (!lineToDuplicate) return;

    const newLine = {
      ...lineToDuplicate,
      id: Date.now(),
      name: `${lineToDuplicate.name} (Copy)`,
      tiers: undefined, // Clear calculated tiers
      results: undefined, // Clear results
    };
    setWorld({
      ...world,
      productionLines: [...world.productionLines, newLine],
    });
  };

  const deleteProductionLine = (lineId) => {
    if (world.productionLines.length <= 1) {
      alert('Cannot delete the last production line.');
      return;
    }
    if (confirm('Are you sure you want to delete this production line?')) {
      setWorld({
        ...world,
        productionLines: world.productionLines.filter(l => l.id !== lineId),
        activeLineIdx: Math.min(world.activeLineIdx, world.productionLines.length - 2),
      });
    }
  };

  const toggleLineExpanded = (lineId) => {
    setWorld({
      ...world,
      productionLines: world.productionLines.map(l =>
        l.id === lineId ? { ...l, isExpanded: !l.isExpanded } : l
      ),
    });
  };

  const startEditingName = (lineId) => {
    setEditingLineId(lineId);
  };

  const updateLineName = (lineId, newName) => {
    setWorld({
      ...world,
      productionLines: world.productionLines.map(l =>
        l.id === lineId ? { ...l, name: newName } : l
      ),
    });
    setEditingLineId(null);
  };

  const cancelEditingName = () => {
    setEditingLineId(null);
  };

  const addTargetItem = (lineId) => {
    // Default to first item in filtered list
    const firstItem = getProducibleItems(selectedProductionFilter)[0] || 'Iron Plate';
    const itemId = CONSTS.NAME2ITEM_ID[firstItem];
    const item = CONSTS.ITEMS[itemId];
    const recipes = item.get_recipes ? item.get_recipes(world) : [];
    const defaultRecipe = recipes.find(r => r.isDefault) || recipes[0];
    const defaultRate = defaultRecipe ? (defaultRecipe.output / defaultRecipe.time) * 60 : 10;

    setWorld({
      ...world,
      productionLines: world.productionLines.map(l =>
        l.id === lineId
          ? {
              ...l,
              targetItems: [
                ...l.targetItems,
                { item_id: itemId, rate: defaultRate },
              ],
            }
          : l
      ),
    });
  };

  const removeTargetItem = (lineId, itemIndex) => {
    setWorld({
      ...world,
      productionLines: world.productionLines.map(l =>
        l.id === lineId
          ? {
              ...l,
              targetItems: l.targetItems.filter((_, idx) => idx !== itemIndex),
            }
          : l
      ),
    });
  };

  const handleTargetItemChange = (lineId, itemIndex, itemName) => {
    const itemId = CONSTS.NAME2ITEM_ID[itemName];
    if (itemId === undefined) return;

    // Get default recipe and calculate rate
    const item = CONSTS.ITEMS[itemId];
    const recipes = item.get_recipes ? item.get_recipes(world) : [];
    const defaultRecipe = recipes.find(r => r.isDefault) || recipes[0];

    // Calculate default rate: (output / time) * 60
    let defaultRate = 10; // fallback
    if (defaultRecipe && defaultRecipe.time) {
      defaultRate = (defaultRecipe.output / defaultRecipe.time) * 60;
    }

    setWorld({
      ...world,
      productionLines: world.productionLines.map(l =>
        l.id === lineId
          ? {
              ...l,
              targetItems: l.targetItems.map((item, idx) =>
                idx === itemIndex ? { item_id: itemId, rate: defaultRate } : item
              ),
            }
          : l
      ),
    });
  };

  const handleTargetRateChange = (lineId, itemIndex, newRate) => {
    const rate = parseFloat(newRate) || 0;
    setWorld({
      ...world,
      productionLines: world.productionLines.map(l =>
        l.id === lineId
          ? {
              ...l,
              targetItems: l.targetItems.map((item, idx) =>
                idx === itemIndex ? { ...item, rate } : item
              ),
            }
          : l
      ),
    });
  };

  // Alternate recipe management
  const addAlternateRecipe = (altName) => {
    setSelectedAlternates([...selectedAlternates, altName]);
  };

  const removeAlternateRecipe = (altName) => {
    setSelectedAlternates(selectedAlternates.filter(name => name !== altName));
  };

  // Handler for purity changes (for miners/extractors)
  const handlePurityChange = (lineId, itemName, purity) => {
    // This would need to update the production line's purity settings
    // For now, this is a placeholder
    console.log(`Purity changed for ${itemName} to ${purity} in line ${lineId}`);
  };

  // Handler for power shard changes
  const handleShardChange = (lineId, key, shardCount) => {
    const shards = parseInt(shardCount) || 0;
    // This would need to update the production line's shard settings
    // For now, this is a placeholder
    console.log(`Shards changed for ${key} to ${shards} in line ${lineId}`);
  };

  // ========================================
  // SUBWAY MAP VISUALIZATION - UTILITY FUNCTIONS
  // ========================================

  const LAYOUT_CONSTANTS = {
    NODE_WIDTH: 180,
    NODE_HEIGHT: 120,
    NODE_SPACING: 100,  // Increased from 40 to 100 for more horizontal space
    TIER_SPACING: 200,
    TOP_MARGIN: 50,
    SIDE_MARGIN: 100,
  };

  // Predefined color palette for common items
  const ITEM_COLORS = {
    'Iron Ore': '#f97316',
    'Copper Ore': '#ef4444',
    'Coal': '#171717',
    'Limestone': '#d4d4d4',
    'Iron Ingot': '#fb923c',
    'Copper Ingot': '#f87171',
    'Water': '#06b6d4',
    'Crude Oil': '#1e3a8a',
  };

  function getItemColor(itemName) {
    if (ITEM_COLORS[itemName]) return ITEM_COLORS[itemName];

    // Hash-based color generation for other items
    let hash = 0;
    for (let i = 0; i < itemName.length; i++) {
      hash = itemName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 360);
    const saturation = 60 + (Math.abs(hash) % 20);
    const lightness = 50 + (Math.abs(hash >> 8) % 15);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  function checkBoxIntersection(x1, y1, x2, y2, boxX, boxY, boxWidth, boxHeight, padding = 20) {
    // Check if a line from (x1, y1) to (x2, y2) would intersect or come close to a box
    // Add padding around the box to create clearance
    const minX = boxX - padding;
    const maxX = boxX + boxWidth + padding;
    const minY = boxY - padding;
    const maxY = boxY + boxHeight + padding;

    // Get line bounding box
    const lineMinX = Math.min(x1, x2);
    const lineMaxX = Math.max(x1, x2);
    const lineMinY = Math.min(y1, y2);
    const lineMaxY = Math.max(y1, y2);

    // Quick reject if bounding boxes don't overlap
    if (lineMaxX < minX || lineMinX > maxX || lineMaxY < minY || lineMinY > maxY) {
      return false;
    }

    // Check if the line path would go through the box area
    // For vertical or near-vertical lines, check if box is in the x range
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (Math.abs(dx) < 50) {
      // Nearly vertical line - check if box center is close to line x
      const boxCenterX = boxX + boxWidth / 2;
      return Math.abs(boxCenterX - x1) < (boxWidth / 2 + padding);
    }

    // For other lines, check if box center is near the line path
    const boxCenterX = boxX + boxWidth / 2;
    const boxCenterY = boxY + boxHeight / 2;

    // Calculate distance from box center to line
    const t = Math.max(0, Math.min(1, ((boxCenterX - x1) * dx + (boxCenterY - y1) * dy) / (dx * dx + dy * dy)));
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    const distance = Math.sqrt(Math.pow(closestX - boxCenterX, 2) + Math.pow(closestY - boxCenterY, 2));

    return distance < (Math.max(boxWidth, boxHeight) / 2 + padding);
  }

  function generateBezierPath(x1, y1, x2, y2, allNodes = [], sourceItemId = null, targetItemId = null) {
    const { NODE_WIDTH, NODE_HEIGHT } = LAYOUT_CONSTANTS;

    // Find boxes that would be in the path
    const obstructingBoxes = allNodes.filter(nodePos => {
      // Don't consider boxes that are the endpoints (source or destination)
      if (nodePos.itemId === sourceItemId || nodePos.itemId === targetItemId) {
        return false;
      }
      return checkBoxIntersection(x1, y1, x2, y2, nodePos.x, nodePos.y, NODE_WIDTH, NODE_HEIGHT);
    });

    // If no obstructions, use straight line
    if (obstructingBoxes.length === 0) {
      return `M ${x1},${y1} L ${x2},${y2}`;
    }

    const horizontalDistance = Math.abs(x2 - x1);
    const verticalDistance = Math.abs(y2 - y1);
    const isNearVertical = horizontalDistance < 100;

    let cx1, cy1, cx2, cy2;

    if (isNearVertical && verticalDistance > 150) {
      // Route around boxes to the right
      // Calculate how far right we need to go
      const rightmostBox = Math.max(...obstructingBoxes.map(b => b.x + NODE_WIDTH));
      const sideOffset = rightmostBox - Math.min(x1, x2) + 60; // 60px clearance

      const verticalMid = (y1 + y2) / 2;

      // Create a wide arc to the right
      cx1 = x1 + sideOffset;
      cy1 = verticalMid;
      cx2 = x2 + sideOffset;
      cy2 = verticalMid;
    } else {
      // For diagonal connections with obstructions, add extra curve
      const verticalOffset = Math.abs(y2 - y1) / 3;
      const horizontalOffset = Math.max(Math.abs(x2 - x1) * 0.6, 100);

      cx1 = x1 + (x2 > x1 ? horizontalOffset : -horizontalOffset);
      cy1 = y1 - verticalOffset;
      cx2 = x2 - (x2 > x1 ? horizontalOffset : -horizontalOffset);
      cy2 = y2 + verticalOffset;
    }

    return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
  }

  function calculatePorts(nodePositions, tiers) {
    const portData = new Map();
    const { NODE_WIDTH, NODE_HEIGHT } = LAYOUT_CONSTANTS;

    nodePositions.forEach(nodePos => {
      const { itemId, node, x, y } = nodePos;

      // Count connections
      const inputCount = Object.keys(node.supplied_by_nodes || {}).length;
      const outputCount = Object.keys(node.supplies_nodes || {}).length;

      // Calculate input port positions (bottom of node)
      const inputPorts = [];
      const inputSpacing = inputCount > 1 ?
        (NODE_WIDTH - 40) / (inputCount - 1) : 0;
      for (let i = 0; i < inputCount; i++) {
        inputPorts.push({
          x: x + 20 + i * inputSpacing,
          y: y + NODE_HEIGHT,
          itemId: Object.keys(node.supplied_by_nodes)[i]
        });
      }

      // Calculate output port positions (top of node)
      const outputPorts = [];
      const outputSpacing = outputCount > 1 ?
        (NODE_WIDTH - 40) / (outputCount - 1) : 0;
      for (let i = 0; i < outputCount; i++) {
        outputPorts.push({
          x: x + 20 + i * outputSpacing,
          y: y,
          itemId: Object.keys(node.supplies_nodes)[i]
        });
      }

      portData.set(itemId, { inputPorts, outputPorts });
    });

    return portData;
  }

  function generateConnections(portData, tiers, beltTier, pipeTier, nodePositions) {
    const connections = [];

    // Iterate through all tiers to find connections
    tiers.forEach((tier, tierIdx) => {
      Object.entries(tier).forEach(([itemId, node]) => {
        // For each node that supplies this one
        Object.keys(node.supplied_by_nodes || {}).forEach(supplierId => {
          const supplierPorts = portData.get(supplierId);
          const consumerPorts = portData.get(itemId);

          if (!supplierPorts || !consumerPorts) return;

          // Find matching ports
          const outputPort = supplierPorts.outputPorts.find(p => p.itemId === itemId);
          const inputPort = consumerPorts.inputPorts.find(p => p.itemId === supplierId);

          if (!outputPort || !inputPort) return;

          // Generate Bezier path with collision detection
          // Pass source and target IDs to exclude endpoint boxes from obstruction check
          const path = generateBezierPath(
            outputPort.x, outputPort.y,
            inputPort.x, inputPort.y,
            nodePositions,
            supplierId,
            itemId
          );

          // Calculate belt/pipe count
          const capacity = node.item.is_fluid ? pipeTier : beltTier;
          const beltCount = Math.ceil(node.rate / capacity);

          connections.push({
            path,
            color: getItemColor(node.item.name),
            isFluid: node.item.is_fluid,
            rate: node.rate,
            itemName: node.item.name,
            beltCount,
            capacity
          });
        });
      });
    });

    return connections;
  }

  function calculateLayout(tiers, beltTier, pipeTier) {
    const { NODE_WIDTH, NODE_HEIGHT, NODE_SPACING, TIER_SPACING, TOP_MARGIN, SIDE_MARGIN } = LAYOUT_CONSTANTS;

    // 1. Calculate Y positions (top to bottom - tier 0 at top, resources at bottom)
    const tierYPositions = tiers.map((tier, idx) => {
      return TOP_MARGIN + idx * TIER_SPACING;
    });

    // 2. Calculate X positions (evenly space nodes in each tier)
    const nodePositions = [];
    tiers.forEach((tier, tierIdx) => {
      const tierNodes = Object.entries(tier);
      const tierWidth = (tierNodes.length * NODE_WIDTH) +
                        ((tierNodes.length - 1) * NODE_SPACING);

      tierNodes.forEach(([itemId, node], nodeIdx) => {
        const x = SIDE_MARGIN + nodeIdx * (NODE_WIDTH + NODE_SPACING);
        const y = tierYPositions[tierIdx];

        nodePositions.push({
          itemId,
          node,
          x,
          y,
          tierIdx
        });
      });
    });

    // 3. Calculate port positions
    const portData = calculatePorts(nodePositions, tiers);

    // 4. Generate connection paths
    const connections = generateConnections(portData, tiers, beltTier, pipeTier, nodePositions);

    return {
      nodes: nodePositions,
      connections,
      width: Math.max(...nodePositions.map(n => n.x)) + NODE_WIDTH + SIDE_MARGIN,
      height: TOP_MARGIN + tiers.length * TIER_SPACING
    };
  }

  // ========================================
  // SUBWAY MAP VISUALIZATION - REACT COMPONENTS
  // ========================================

  function ConnectionLine({ path, color, isFluid, rate, beltCount, allNodes }) {
    // Scale line thickness based on belt count (3px per belt, capped at 20px)
    const strokeWidth = Math.max(3, Math.min(20, beltCount * 3));
    const { NODE_WIDTH, NODE_HEIGHT } = LAYOUT_CONSTANTS;

    let labelX = 0, labelY = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0;

    // Try to parse as Bezier curve first: M x1,y1 C cx1,cy1 cx2,cy2 x2,y2
    const bezierMatch = path.match(/M ([\d.]+),([\d.]+) C ([\d.]+),([\d.]+) ([\d.]+),([\d.]+) ([\d.]+),([\d.]+)/);

    if (bezierMatch) {
      x1 = parseFloat(bezierMatch[1]);
      y1 = parseFloat(bezierMatch[2]);
      const cx1 = parseFloat(bezierMatch[3]);
      const cy1 = parseFloat(bezierMatch[4]);
      const cx2 = parseFloat(bezierMatch[5]);
      const cy2 = parseFloat(bezierMatch[6]);
      x2 = parseFloat(bezierMatch[7]);
      y2 = parseFloat(bezierMatch[8]);

      // Evaluate Bezier curve at t=0.5 (midpoint)
      const t = 0.5;
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t2 = t * t;
      const t3 = t2 * t;

      labelX = mt3 * x1 + 3 * mt2 * t * cx1 + 3 * mt * t2 * cx2 + t3 * x2;
      labelY = mt3 * y1 + 3 * mt2 * t * cy1 + 3 * mt * t2 * cy2 + t3 * y2;
    } else {
      // Try to parse as straight line: M x1,y1 L x2,y2
      const lineMatch = path.match(/M ([\d.]+),([\d.]+) L ([\d.]+),([\d.]+)/);

      if (lineMatch) {
        x1 = parseFloat(lineMatch[1]);
        y1 = parseFloat(lineMatch[2]);
        x2 = parseFloat(lineMatch[3]);
        y2 = parseFloat(lineMatch[4]);

        // For straight lines, midpoint is simply the average
        labelX = (x1 + x2) / 2;
        labelY = (y1 + y2) / 2;
      }
    }

    // Check if label position is inside any box and adjust if needed
    if (allNodes && labelX > 0) {
      const labelRadius = 14; // Disk radius
      const padding = 10; // Extra clearance

      for (const nodePos of allNodes) {
        const boxLeft = nodePos.x - padding;
        const boxRight = nodePos.x + NODE_WIDTH + padding;
        const boxTop = nodePos.y - padding;
        const boxBottom = nodePos.y + NODE_HEIGHT + padding;

        // Check if label center is inside or near the box
        if (labelX >= boxLeft && labelX <= boxRight && labelY >= boxTop && labelY <= boxBottom) {
          // Move label to the right of the box
          labelX = boxRight + labelRadius + 10;
          break;
        }
      }
    }

    return (
      <g>
        <path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={isFluid ? '8 4' : 'none'}
          opacity="0.8"
        />

        {/* Endpoint circles */}
        {labelX > 0 && (
          <>
            <circle cx={x1} cy={y1} r="5" fill={color} opacity="0.9" />
            <circle cx={x2} cy={y2} r="5" fill={color} opacity="0.9" />
          </>
        )}

        {/* Label with colored disk background */}
        {labelX > 0 && (
          <>
            <circle cx={labelX} cy={labelY} r="14" fill={color} opacity="0.9" />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="bold"
            >
              {beltCount}
            </text>
          </>
        )}
      </g>
    );
  }

  function ProductionNode({ x, y, node }) {
    const isResource = node.item.is_resource;
    const isTarget = node.tier_idx === 0;

    let nodeFill = '#374151';  // gray-700 (intermediate)
    let nodeStroke = '#9333ea';  // purple-600
    if (isResource) {
      nodeFill = '#854d0e';  // yellow-900
      nodeStroke = '#fbbf24';  // amber-400
    } else if (isTarget) {
      nodeFill = '#1e3a8a';  // blue-900
      nodeStroke = '#3b82f6';  // blue-500
    }

    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* Background rectangle */}
        <rect
          width="180"
          height="120"
          rx="8"
          fill={nodeFill}
          stroke={nodeStroke}
          strokeWidth="2"
        />

        {/* Item name */}
        <text
          x="90"
          y="25"
          textAnchor="middle"
          fill="#e5e7eb"
          fontSize="14"
          fontWeight="bold"
        >
          {node.item.name}
        </text>

        {/* Production rate */}
        <text
          x="90"
          y="50"
          textAnchor="middle"
          fill="#fff"
          fontSize="16"
          fontWeight="bold"
        >
          {node.rate.toFixed(2)}/min
        </text>

        {/* Building info (if not raw resource) */}
        {!isResource && node.recipe && (
          <>
            <text
              x="90"
              y="75"
              textAnchor="middle"
              fill="#d1d5db"
              fontSize="12"
            >
              {node.recipe.building}
            </text>
            <text
              x="90"
              y="95"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
            >
              {node.building_count.toFixed(0)} buildings
            </text>
          </>
        )}

        {/* Resource label */}
        {isResource && (
          <text
            x="90"
            y="85"
            textAnchor="middle"
            fill="#fb923c"
            fontSize="12"
          >
            {node.item.is_ore ? '⛏️ Mined' : '💧 Extracted'}
          </text>
        )}
      </g>
    );
  }

  function SubwayMap({ line, selectedBelt, selectedPipe }) {
    const [layout, setLayout] = React.useState(null);

    // Get belt and pipe tier capacities
    const BELT_TIERS = CONSTS.BELT_TIERS;
    const PIPE_TIERS = CONSTS.PIPE_TIERS;
    const beltTierCapacity = BELT_TIERS[selectedBelt];
    const pipeTierCapacity = PIPE_TIERS[selectedPipe];

    React.useEffect(() => {
      if (line.tiers) {
        const computed = calculateLayout(line.tiers, beltTierCapacity, pipeTierCapacity);
        setLayout(computed);
      }
    }, [line.tiers, beltTierCapacity, pipeTierCapacity]);

    if (!layout) return null;

    return (
      <div className="bg-gray-800 rounded-lg p-4 border-2 border-purple-700 overflow-auto my-4">
        <h3 className="text-lg font-bold text-purple-400 mb-4">
          Production Chain Visualization
        </h3>
        <svg
          width={layout.width}
          height={layout.height}
          className="bg-gray-900"
        >
          {/* Production nodes (background) */}
          <g className="nodes">
            {layout.nodes.map((nodeData, idx) => (
              <ProductionNode key={idx} {...nodeData} />
            ))}
          </g>

          {/* Connection lines (foreground) */}
          <g className="connections">
            {layout.connections.map((conn, idx) => (
              <ConnectionLine key={idx} {...conn} allNodes={layout.nodes} />
            ))}
          </g>
        </svg>
      </div>
    );
  }

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
                      {tier} - {data.rate}/min
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
              {world.productionLines.map((line, lineIndex) => (
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
                      disabled={world.productionLines.length <= 1}
                      className={`${
                        world.productionLines.length <= 1
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      } font-bold py-1 px-3 rounded transition-colors duration-200`}
                      title={world.productionLines.length <= 1 ? 'Cannot delete last line' : 'Delete this production line'}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Production Line Content (shown when expanded) */}
                  {line.isExpanded && (
                    <div className="p-4">
                      {/* Item Filter */}
                      <div className="mb-3">
                        <label className="block text-orange-300 font-semibold mb-2 text-sm">
                          Item Filter
                        </label>
                        <select
                          value={selectedProductionFilter}
                          onChange={(e) => setSelectedProductionFilter(e.target.value)}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2 border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                        >
                          <option value="elevator">Space Elevator Parts</option>
                          <option value="all">Everything</option>
                          <optgroup label="Building Types">
                            <option value="Constructor">Constructor</option>
                            <option value="Assembler">Assembler</option>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Smelter">Smelter</option>
                            <option value="Foundry">Foundry</option>
                            <option value="Refinery">Refinery</option>
                            <option value="Packager">Packager</option>
                            <option value="Blender">Blender</option>
                            <option value="Particle Accelerator">Particle Accelerator</option>
                            <option value="Quantum Encoder">Quantum Encoder</option>
                          </optgroup>
                        </select>
                      </div>

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
                                  value={CONSTS.ITEMS[target.item_id]?.name || ''}
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
                        onClick={() => calculateLine(lineIndex)}
                        className="w-full mb-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                      >
                        Calculate Production Chain
                      </button>

                      {/* Power Summary - Standalone section */}
                      {line.results && (
                        <div className="mb-4">
                          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-4 border-2 border-yellow-600">
                            <h3 className="text-lg font-bold text-yellow-300 mb-1">
                              Total Power Required
                            </h3>
                            <p className="text-2xl font-bold text-white">
                              {line.results.power && line.results.power.toFixed(2)} MW
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Subway Map Visualization */}
                      {line.tiers && line.tiers.length > 0 && (
                        <SubwayMap
                          line={line}
                          selectedBelt={selectedBelt}
                          selectedPipe={selectedPipe}
                        />
                      )}

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
                                          Requested: <span className="font-bold">{target.requestedRate &&target.requestedRate.toFixed(2)}/min</span>
                                        </p>
                                        <p className="text-white text-xs">
                                          Achievable: <span className="font-bold">{target.actualRate &&target.actualRate.toFixed(2)}/min</span>
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

                          {/* Buildings Required */}
                          <div className="bg-gray-700 rounded-lg p-4 border-2 border-orange-700">
                            <h3 className="text-lg font-bold text-orange-400 mb-3">
                              Production Configurations
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                              {line.results && line.results.buildings
                               .sort((a, b) => a.building.localeCompare(b.building) || a.item.localeCompare(b.item))
                               .map((entry) => {
                                 const key = entry.key;
                                 const maxShards = entry.intCount * 3;

                                 // Get recipe for this item to show inputs
                                 const recipe = RECIPES[entry.item];

                                 // Calculate total power for this prodconf
                                 let totalPower = 0;
                                 const basePower = BUILDINGS[BUILDING2IDS[entry.building]].power;

                                 if (entry.shardDistribution) {
                                   // Calculate power for each building with its shards
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
                                             {entry.actualRate && entry.actualRate.toFixed(2)}/min
                                             <span className="text-red-400 ml-1">
                                               (req: {entry.requestedRate.toFixed(2)})
                                             </span>
                                           </span>
                                         ) : (
                                           <span>{entry.actualRate && entry.actualRate.toFixed(2)}/min</span>
                                         )}
                                       </div>
                                     </div>

                                     {/* Input Constraint Warning */}
                                     {entry.inputConstrained && entry.limitingReason === 'supply' && (
                                       <div className="text-sm text-red-400 mb-1 bg-red-900 bg-opacity-30 p-1 rounded">
                                         ⚠ Input supply limited: {entry.limitingInput} → {entry.actualRate && entry.actualRate.toFixed(2)}/min
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
                                       // Calculate if any inputs are belt-limited per building
                                       let maxDownclockNeeded = null;
                                       let limitingInput = null;

                                       const inputDisplays = recipe.inputs.map( input => {
                                         const inputItem = ITEMS[input.item_id];
                                         const inputPerMinute = (input.amount / recipe.time) * 60;
                                         const totalInputRate = inputPerMinute * entry.actualRate / ((recipe.output / recipe.time) * 60);
                                         
                                         console.log(recipe,entry,input,`ENTRY ${inputPerMinute}, ${totalInputRate}`);

                                         const isFluid = inputItem.is_fluid;
                                         const capacity = isFluid ? PIPE_TIERS[selectedPipe] : BELT_TIERS[selectedBelt];
                                         const transportType = isFluid ? 'pipe' : 'belt';

                                         const perBuildingCapped = inputPerMinute > capacity;
                                         const totalCapped = totalInputRate > capacity;

                                         // Calculate downclocking needed if per-building capped
                                         if (perBuildingCapped) {
                                           const downclockPercent = (capacity / inputPerMinute) * 100;
                                           if (maxDownclockNeeded === null || downclockPercent < maxDownclockNeeded) {
                                             maxDownclockNeeded = downclockPercent;
                                             limitingInput = inputItem;
                                           }
                                         }

                                         let statusColor = 'text-green-400';
                                         let statusIcon = '✓';
                                         let statusText = '';

                                         if (perBuildingCapped) {
                                           const downclockPercent = (capacity / inputPerMinute) * 100;
                                           statusColor = 'text-red-400';
                                           statusIcon = '🔴';
                                           statusText = ` (${inputPerMinute.toFixed(1)}/min per building > ${capacity} ${transportType} - downclock to ${downclockPercent.toFixed(1)}% or use manifold/higher tier)`;
                                         } else if (totalCapped) {
                                           // Calculate how many belts/pipes needed
                                           const beltsNeeded = Math.ceil(totalInputRate / capacity);
                                           statusColor = 'text-blue-400';
                                           statusIcon = '→';
                                           statusText = ` (${beltsNeeded} ${transportType}s needed)`;
                                         }

                                         return (
                                           <div key={input.item_id} className={`text-xs ${statusColor} flex items-start gap-1`}>
                                             <span className="flex-shrink-0">{statusIcon}</span>
                                             <span className="flex-1">
                                               {input.name}: {inputPerMinute.toFixed(2)}/min × {entry.intCount} = {totalInputRate.toFixed(2)}/min{statusText}
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
                                                 ⚠ Belt/Pipe Limited: Downclock to {maxDownclockNeeded.toFixed(1)}% to match {limitingInput.name} supply
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
          <span className="text-red-400">🔴</span> = Per-building exceeds capacity (requires manifold or higher tier)
        </div>
      </div>
    </div>
  );

}

// Render the React component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SatisfactoryCalculator />);
