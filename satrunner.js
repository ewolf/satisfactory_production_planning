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

  satdata.setupProdConf(DEFAULT_LINE);

  const [world, setWorld] = useState({
    name: 'my world',
    productionLines: [DEFAULT_LINE],
    activeLineIdx: 0,
  });

  const calculate = () => {
    const lineIdx = world.activeLineIdx;
    const line = world.productionLines[lineIdx];

    // Call setupProdConf which populates line.tiers
    satdata.setupProdConf(line, world);

    // Update state with the modified line
    setWorld({
      ...world,
      productionLines: world.productionLines.map((l, idx) =>
        idx === lineIdx ? line : l
      )
    });
  };

  // Calculate a specific production line by index
  const calculateLine = (lineIdx) => {
    const line = world.productionLines[lineIdx];
    satdata.setupProdConf(line, world);

    setWorld({
      ...world,
      productionLines: world.productionLines.map((l, idx) =>
        idx === lineIdx ? line : l
      )
    });
  };

  // reality -> world + calcualted state
  const [reality, setReality] = useState({
    world,
    calculated: calculate(),
  });

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
                        onClick={() => calculateLine(lineIndex)}
                        className="w-full mb-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                      >
                        Calculate Production Chain
                      </button>

                      {/* Tier Display - NEW SECTION */}
                      {line.tiers && line.tiers.length > 0 && (
                        <div className="bg-gray-700 rounded-lg p-4 border-2 border-purple-700 my-4">
                          <h3 className="text-lg font-bold text-purple-400 mb-4">
                            Production Tiers (End Product → Resources)
                          </h3>

                          {line.tiers.map((tier, tierIdx) => {
                            // Get all nodes in this tier
                            const tierNodes = Object.entries(tier).map(([itemId, node]) => ({
                              itemId,
                              ...node
                            }));

                            // Skip empty tiers
                            if (tierNodes.length === 0) return null;

                            return (
                              <div
                                key={tierIdx}
                                className="mb-4 pb-4 border-b border-gray-600 last:border-b-0"
                              >
                                {/* Tier Header */}
                                <div className="text-sm font-semibold text-purple-300 mb-3">
                                  Tier {tierIdx}
                                  {tierIdx === 0 ? ' (Target Products)' : ''}
                                  {tierNodes.every(n => n.item.is_resource) ? ' (Raw Resources)' : ''}
                                </div>

                                {/* Tier Items in Horizontal Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                  {tierNodes.map((node) => (
                                    <div
                                      key={node.itemId}
                                      className="bg-gray-600 rounded-lg p-3 border-2 border-purple-500/50 hover:border-purple-400 transition-colors"
                                    >
                                      {/* Item Name */}
                                      <div className="font-bold text-purple-300 text-sm mb-1">
                                        {node.item.name}
                                        {node.item.is_fluid && <span className="ml-1 text-blue-400">💧</span>}
                                      </div>

                                      {/* Production Rate */}
                                      <div className="text-white text-lg font-semibold">
                                        {node.rate.toFixed(2)}/min
                                      </div>

                                      {/* Building Info (if not a raw resource) */}
                                      {!node.item.is_resource && node.recipe && (
                                        <div className="mt-2 pt-2 border-t border-gray-500">
                                          <div className="text-xs text-gray-300">
                                            {node.recipe.building}
                                          </div>
                                          <div className="text-sm text-white">
                                            {node.machines && node.machines.toFixed(2)} machines
                                          </div>
                                          {node.clocking && node.clocking !== 1 && (
                                            <div className="text-xs text-yellow-300">
                                              @ {(node.clocking * 100).toFixed(0)}% clock
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Raw Resource Note */}
                                      {node.item.is_resource && (
                                        <div className="text-xs text-orange-300 mt-1">
                                          {node.item.is_ore ? '⛏️ Mined' : node.item.is_fluid ? '💧 Extracted' : '📦 Resource'}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
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

// Render the React component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SatisfactoryCalculator />);
