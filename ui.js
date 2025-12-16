/**
 * UI Controller for Satisfactory Production Planner - Redesigned
 * Handles all UI interactions, state management, and persistence
 * Based on UI.txt specifications
 */

// Global state
let appState = null;
let collapsedStates = {}; // Track which elements are collapsed

// Constants
const LOCALSTORAGE_STATE_KEY = 'satisfactory-planner-state-v2';
const LOCALSTORAGE_COLLAPSED_KEY = 'satisfactory-planner-collapsed-v2';
const LOCALSTORAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 */
function init() {
    // Load collapsed states
    loadCollapsedStates();

    // Try to load state from localStorage, or create initial state
    appState = loadStateFromLocalStorage() || stateModel2.createInitialState();

    // Add default power grid if none exists
    if (appState.powerGrids.length === 0) {
        const defaultGrid = stateModel2.createPowerGrid('HUB Grid');
        // Add 2 HUB Biomass Burners
        const hubBiomassIdx = gameData2.PowerBuildingList.find(idx =>
            gameData2.buildings[idx].name === "HUB Biomass Burner"
        );
        const biomassIdx = gameData2.items.findIndex(item => item.name === "Biomass");
        const config = stateModel2.createPowerConfig(hubBiomassIdx, biomassIdx, 100, 2);
        defaultGrid.powerConfigs.push(config);
        appState.powerGrids.push(defaultGrid);
    }

    // Add default production line if none exists
    if (appState.productionLines.length === 0) {
        const hubLine = stateModel2.createProductionLine('HUB line');
        appState.productionLines.push(hubLine);
    }

    // Setup event listeners
    setupEventListeners();

    // Initial render
    renderUI();

    // Auto-save on changes
    autoSave();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Download button
    document.getElementById('download-btn').addEventListener('click', downloadState);

    // Upload button
    document.getElementById('upload-input').addEventListener('change', uploadState);

    // Clear cache button
    document.getElementById('clear-cache-btn').addEventListener('click', clearCache);

    // Belt select
    document.getElementById('belt-select').addEventListener('change', (e) => {
        appState.maxBeltResearched = parseInt(e.target.value);
        renderUI();
        autoSave();
    });

    // Pipe select
    document.getElementById('pipe-select').addEventListener('change', (e) => {
        appState.maxPipeResearched = parseInt(e.target.value);
        renderUI();
        autoSave();
    });

    // Alternative recipes
    document.getElementById('add-alt-recipe-btn').addEventListener('click', addAlternativeRecipe);

    // Power grids
    document.getElementById('create-power-grid-btn').addEventListener('click', createNewPowerGrid);

    // Production lines
    document.getElementById('create-production-line-btn').addEventListener('click', createNewProductionLine);
}

// ============================================================================
// RENDERING
// ============================================================================

/**
 * Render the entire UI
 */
function renderUI() {
    renderBeltSelect();
    renderPipeSelect();
    renderAlternativeRecipes();
    renderGlobalReport();
    renderPowerGrids();
    renderProductionLines();
}

/**
 * Render belt level select
 */
function renderBeltSelect() {
    const select = document.getElementById('belt-select');
    select.innerHTML = '';

    gameData2.belts.forEach((belt, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Level ${belt.level} (${belt.flow_rate}/min)`;
        if (index === appState.maxBeltResearched) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

/**
 * Render pipe level select
 */
function renderPipeSelect() {
    const select = document.getElementById('pipe-select');
    select.innerHTML = '';

    gameData2.pipes.forEach((pipe, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Level ${pipe.level} (${pipe.flow_rate}/min)`;
        if (index === appState.maxPipeResearched) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

/**
 * Render alternative recipes section
 */
function renderAlternativeRecipes() {
    const select = document.getElementById('alt-recipe-select');
    const list = document.getElementById('unlocked-recipes-list');

    // Clear and populate select with locked recipes (sorted alphabetically)
    select.innerHTML = '<option value="">Select an alternate recipe...</option>';

    // Collect locked recipes
    const lockedRecipes = [];
    gameData2.AlternateRecipeList.forEach((recipeIndex, altIndex) => {
        if (!appState.unlockedRecipes[altIndex]) {
            const recipe = gameData2.recipes[recipeIndex];
            lockedRecipes.push({ altIndex, name: recipe.name });
        }
    });

    // Sort and add to select
    lockedRecipes.sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
        const option = document.createElement('option');
        option.value = item.altIndex;
        option.textContent = item.name;
        select.appendChild(option);
    });

    // Clear and populate unlocked recipes list
    list.innerHTML = '';
    appState.unlockedRecipes.forEach((unlocked, altIndex) => {
        if (unlocked) {
            const recipeIndex = gameData2.AlternateRecipeList[altIndex];
            const recipe = gameData2.recipes[recipeIndex];

            const tag = document.createElement('div');
            tag.className = 'item-tag';
            tag.innerHTML = `
                ${recipe.name}
                <button class="remove-btn" onclick="removeAlternativeRecipe(${altIndex})">×</button>
            `;
            list.appendChild(tag);
        }
    });
}

/**
 * Render global report
 */
function renderGlobalReport() {
    // Calculate totals
    let totalProduced = 0;
    let totalConsumed = 0;

    // Power from grids (use max capacity)
    appState.powerGrids.forEach(grid => {
        stateModel2.updatePowerGridCalculations(grid);
        totalProduced += grid.maxAvgPowerOutput;
    });

    // Power consumed by production lines
    const maxBeltRate = gameData2.belts[appState.maxBeltResearched].flow_rate;
    const maxPipeRate = gameData2.pipes[appState.maxPipeResearched].flow_rate;

    appState.productionLines.forEach(line => {
        stateModel2.updateProductionLineCalculations(line, maxBeltRate, maxPipeRate);
    });

    // Update power states (isOn for grids and lines)
    // This will zero out consumption/production for lines that are OFF
    stateModel2.updatePowerStates(appState);

    // Calculate total consumption AFTER power states are updated
    appState.productionLines.forEach(line => {
        totalConsumed += line.powerConsumption;
    });

    // Update power display (integers only)
    document.getElementById('total-power-produced').textContent = Math.round(totalProduced) + ' MW';
    document.getElementById('total-power-consumed').textContent = Math.round(totalConsumed) + ' MW';

    const balance = totalProduced - totalConsumed;
    const balanceEl = document.getElementById('power-balance');
    balanceEl.textContent = Math.round(balance) + ' MW';
    balanceEl.className = 'value ' + (balance >= 0 ? 'text-success' : 'text-error');

    // Collate production goals
    renderGlobalGoals();
}

/**
 * Render global production goals
 */
function renderGlobalGoals() {
    const container = document.getElementById('global-goals-list');
    container.innerHTML = '';

    // Collate goals from all production lines
    const goalMap = new Map(); // item index -> {goal, produced}

    appState.productionLines.forEach(line => {
        // Add goals
        line.productionGoals.forEach((rate, itemIndex) => {
            const current = goalMap.get(itemIndex) || {goal: 0, produced: 0};
            current.goal += rate;
            goalMap.set(itemIndex, current);
        });

        // Add production
        line.itemsProduced.forEach((rate, itemIndex) => {
            if (goalMap.has(itemIndex)) {
                const current = goalMap.get(itemIndex);
                current.produced += rate;
            }
        });
    });

    if (goalMap.size === 0) {
        container.innerHTML = '<p class="text-muted">No production goals set</p>';
        return;
    }

    // Render goals
    goalMap.forEach((data, itemIndex) => {
        const item = gameData2.items[itemIndex];
        const goalDiv = document.createElement('div');

        let statusClass = 'warning';
        let rateText = `${data.produced.toFixed(2)} / ${data.goal.toFixed(2)}`;

        if (data.produced >= data.goal) {
            statusClass = 'success';
            if (data.produced === data.goal) {
                rateText = data.produced.toFixed(2);
            }
        } else if (data.produced === 0) {
            statusClass = 'error';
        }

        goalDiv.className = `goal-item ${statusClass}`;
        goalDiv.innerHTML = `
            <span class="goal-name">${item.name}</span>
            <span class="goal-rate ${statusClass}">${rateText} /min</span>
        `;
        container.appendChild(goalDiv);
    });
}

// ============================================================================
// POWER GRIDS
// ============================================================================

/**
 * Create a new power grid
 */
function createNewPowerGrid() {
    const name = prompt('Enter power grid name:', `Power Grid ${appState.powerGrids.length + 1}`);
    if (!name) return;

    const grid = stateModel2.createPowerGrid(name);
    appState.powerGrids.push(grid);
    renderUI();
    autoSave();
}

/**
 * Render all power grids
 */
function renderPowerGrids() {
    const container = document.getElementById('power-grids-list');
    container.innerHTML = '';

    appState.powerGrids.forEach((grid, index) => {
        const gridElement = createPowerGridElement(grid, index);
        container.appendChild(gridElement);
    });
}

/**
 * Create a power grid DOM element
 */
function createPowerGridElement(grid, index) {
    const isExpanded = collapsedStates[`power-grid-${index}`] !== false;

    // Update calculations
    stateModel2.updatePowerGridCalculations(grid);

    // Calculate total consumption from connected production lines
    let totalConsumption = 0;
    appState.productionLines.forEach((line) => {
        if (line.powerGridConnection === index) {
            totalConsumption += line.powerConsumption;
        }
    });

    const container = document.createElement('div');
    container.className = 'collapsible';

    // Add red background if grid is OFF
    if (!grid.isOn) {
        container.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        container.style.border = '2px solid var(--error-red)';
    }

    // Header
    const header = document.createElement('div');
    header.className = `collapsible-header ${isExpanded ? 'expanded' : ''}`;
    header.innerHTML = `
        <div class="collapsible-header-info">
            <div class="collapsible-header-title">
                ${grid.name}
                ${!grid.isOn ? '<span class="text-error" style="font-weight: bold; margin-left: 8px;">OFF</span>' : ''}
            </div>
            <div class="collapsible-header-stats">
                ${Math.round(grid.currAvgPowerOutput)} / ${Math.round(grid.maxAvgPowerOutput)} MW
            </div>
        </div>
        <div class="collapsible-toggle ${isExpanded ? 'expanded' : ''}">▼</div>
    `;
    header.addEventListener('click', () => toggleCollapse(`power-grid-${index}`, container));

    // Content
    const content = document.createElement('div');
    content.className = `collapsible-content ${isExpanded ? 'expanded' : ''}`;

    // Status info
    const statusHtml = grid.isOn ?
        `<div class="field">
            <label>Status</label>
            <span class="text-success" style="font-weight: bold; font-size: 1.1rem;">ON</span>
        </div>
        <div class="field">
            <label>Power Balance</label>
            <span style="font-family: 'Courier New', monospace;">
                <span style="color: var(--primary-text);">${Math.round(totalConsumption)}</span>
                <span style="color: var(--secondary-text);"> / </span>
                <span style="color: var(--primary-text);">${Math.round(grid.maxAvgPowerOutput)}</span>
                <span style="color: var(--secondary-text);"> MW</span>
            </span>
        </div>` :
        `<div class="field">
            <label>Status</label>
            <span class="text-error" style="font-weight: bold; font-size: 1.1rem;">OFF</span>
        </div>
        <div class="field">
            <label>Power Shortfall</label>
            <span class="text-error" style="font-weight: bold; font-family: 'Courier New', monospace;">
                ${Math.round(totalConsumption - grid.maxAvgPowerOutput)} MW needed
            </span>
        </div>`;

    content.innerHTML = `
        <div class="field">
            <label>Grid Name</label>
            <input type="text" value="${grid.name}" onchange="updatePowerGridName(${index}, this.value)">
        </div>

        ${statusHtml}

        <h3>Power Configurations</h3>
        <div id="power-configs-${index}" class="config-list"></div>
        <button class="btn btn-small btn-primary mt-10" onclick="addPowerConfiguration(${index})">Add Configuration</button>

        <button class="btn btn-small btn-danger mt-20" onclick="deletePowerGrid(${index})">Delete Power Grid</button>
    `;

    container.appendChild(header);
    container.appendChild(content);

    // Render power configurations after adding to DOM
    setTimeout(() => {
        renderPowerConfigurations(grid, index);
    }, 0);

    return container;
}

/**
 * Render power configurations for a grid
 */
function renderPowerConfigurations(grid, gridIndex) {
    const container = document.getElementById(`power-configs-${gridIndex}`);
    if (!container) return;

    container.innerHTML = '';

    if (grid.powerConfigs.length === 0) {
        container.innerHTML = '<p class="text-muted">No power configurations</p>';
        return;
    }

    grid.powerConfigs.forEach((config, configIndex) => {
        const configElement = document.createElement('div');
        configElement.className = 'config-item';

        const building = gameData2.buildings[config.building];
        const fuelOptions = building.fuelHash.size > 0 ?
            Array.from(building.fuelHash.keys())
                .map(fuelIdx => ({ idx: fuelIdx, name: gameData2.items[fuelIdx].name }))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(fuel => `<option value="${fuel.idx}" ${fuel.idx === config.fuelUsed ? 'selected' : ''}>${fuel.name}</option>`)
                .join('') : '';

        configElement.innerHTML = `
            <div class="config-item-header">
                <span>${building.name} (${Math.round(config.currAvgPowerOutput)} MW)</span>
                <button class="btn btn-small btn-danger" onclick="deletePowerConfig(${gridIndex}, ${configIndex})">Delete</button>
            </div>
            <div class="config-item-fields">
                <div class="field">
                    <label>Generator Type</label>
                    <select onchange="updatePowerConfigField(${gridIndex}, ${configIndex}, 'building', this.value)">
                        ${gameData2.PowerBuildingList
                            .map(buildingIdx => ({ idx: buildingIdx, name: gameData2.buildings[buildingIdx].name }))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(b => `<option value="${b.idx}" ${b.idx === config.building ? 'selected' : ''}>${b.name}</option>`)
                            .join('')}
                    </select>
                </div>
                ${building.fuelHash.size > 0 ? `
                <div class="field">
                    <label>Fuel</label>
                    <select onchange="updatePowerConfigField(${gridIndex}, ${configIndex}, 'fuelUsed', this.value)">
                        ${fuelOptions}
                    </select>
                </div>
                ` : ''}
                <div class="field">
                    <label>Clock Speed (%)</label>
                    <input type="number" min="0" max="250" value="${config.clockSpeed}"
                           onchange="updatePowerConfigField(${gridIndex}, ${configIndex}, 'clockSpeed', this.value)">
                </div>
                <div class="field">
                    <label>${building.name} Count</label>
                    ${building.name === 'HUB Biomass Burner' ?
                        `<span style="font-family: 'Courier New', monospace; color: var(--primary-text);">2 (fixed)</span>` :
                        `<input type="number" min="1" value="${config.count}"
                           onchange="updatePowerConfigField(${gridIndex}, ${configIndex}, 'count', this.value)">`
                    }
                </div>
            </div>
        `;

        container.appendChild(configElement);
    });
}

/**
 * Helper to re-render production lines when a power grid changes
 */
function updateConnectedProductionLines(gridIndex) {
    // Re-render all production lines to update their status indicators
    renderProductionLines();
}

function addPowerConfiguration(gridIndex) {
    const grid = appState.powerGrids[gridIndex];
    const defaultBuilding = gameData2.PowerBuildingList[0];
    const building = gameData2.buildings[defaultBuilding];
    const defaultFuel = building.fuelHash.size > 0 ? Array.from(building.fuelHash.keys())[0] : null;

    const config = stateModel2.createPowerConfig(defaultBuilding, defaultFuel, 100, 1);
    grid.powerConfigs.push(config);

    renderPowerConfigurations(grid, gridIndex);
    renderGlobalReport();
    updateConnectedProductionLines(gridIndex);
    autoSave();
}

/**
 * Update a power configuration field
 */
function updatePowerConfigField(gridIndex, configIndex, field, value) {
    const config = appState.powerGrids[gridIndex].powerConfigs[configIndex];

    if (field === 'building') {
        const newBuildingIdx = parseInt(value);
        config.building = newBuildingIdx;
        const building = gameData2.buildings[newBuildingIdx];
        // Reset fuel if new building requires it
        if (building.fuelHash.size > 0) {
            config.fuelUsed = Array.from(building.fuelHash.keys())[0];
        } else {
            config.fuelUsed = null;
        }
        // HUB Biomass Burner always has count of 2
        if (building.name === 'HUB Biomass Burner') {
            config.count = 2;
        }
    } else if (field === 'count') {
        const building = gameData2.buildings[config.building];
        // HUB Biomass Burner count is fixed at 2
        if (building.name === 'HUB Biomass Burner') {
            config.count = 2;
        } else {
            config.count = parseFloat(value);
        }
    } else if (field === 'clockSpeed') {
        config[field] = parseFloat(value);
    } else {
        config[field] = parseInt(value);
    }

    renderPowerConfigurations(appState.powerGrids[gridIndex], gridIndex);
    renderGlobalReport();
    updateConnectedProductionLines(gridIndex);
    autoSave();
}

/**
 * Delete a power configuration
 */
function deletePowerConfig(gridIndex, configIndex) {
    if (!confirm('Delete this power configuration?')) return;

    appState.powerGrids[gridIndex].powerConfigs.splice(configIndex, 1);
    renderPowerConfigurations(appState.powerGrids[gridIndex], gridIndex);
    renderGlobalReport();
    updateConnectedProductionLines(gridIndex);
    autoSave();
}

/**
 * Update power grid name
 */
function updatePowerGridName(index, name) {
    appState.powerGrids[index].name = name;
    renderUI();
    autoSave();
}

/**
 * Delete a power grid
 */
function deletePowerGrid(index) {
    if (!confirm('Delete this power grid? This cannot be undone.')) return;

    appState.powerGrids.splice(index, 1);
    renderUI();
    autoSave();
}

// ============================================================================
// PRODUCTION LINES
// ============================================================================

/**
 * Create a new production line
 */
function createNewProductionLine() {
    const name = prompt('Enter production line name:', `Production Line ${appState.productionLines.length + 1}`);
    if (!name) return;

    const line = stateModel2.createProductionLine(name);
    appState.productionLines.push(line);
    renderUI();
    autoSave();
}

/**
 * Render all production lines
 */
function renderProductionLines() {
    const container = document.getElementById('production-lines-list');
    container.innerHTML = '';

    appState.productionLines.forEach((line, index) => {
        const lineElement = createProductionLineElement(line, index);
        container.appendChild(lineElement);
    });
}

/**
 * Create a production line DOM element
 */
function createProductionLineElement(line, index) {
    const isExpanded = collapsedStates[`production-line-${index}`] !== false;

    // Update calculations
    const maxBeltRate = gameData2.belts[appState.maxBeltResearched].flow_rate;
    const maxPipeRate = gameData2.pipes[appState.maxPipeResearched].flow_rate;
    stateModel2.updateProductionLineCalculations(line, maxBeltRate, maxPipeRate);

    // Get target item names
    const targetItems = Array.from(line.productionGoals.keys())
        .map(itemIdx => gameData2.items[itemIdx].name)
        .join(', ');

    const container = document.createElement('div');
    container.className = 'collapsible';

    // Add red background if line is OFF
    if (!line.isOn) {
        container.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        container.style.border = '2px solid var(--error-red)';
    }

    // Header
    const header = document.createElement('div');
    header.className = `collapsible-header ${isExpanded ? 'expanded' : ''}`;
    header.innerHTML = `
        <div class="collapsible-header-info">
            <div class="collapsible-header-title">
                ${line.name}
                ${!line.isOn ? '<span class="text-error" style="font-weight: bold; margin-left: 8px;">OFF</span>' : ''}
            </div>
            <div class="collapsible-header-stats">${targetItems || 'No goals'}</div>
        </div>
        <div class="collapsible-toggle ${isExpanded ? 'expanded' : ''}">▼</div>
    `;
    header.addEventListener('click', () => toggleCollapse(`production-line-${index}`, container));

    // Content
    const content = document.createElement('div');
    content.className = `collapsible-content ${isExpanded ? 'expanded' : ''}`;
    content.innerHTML = `
        <div class="field">
            <label>Line Name</label>
            <input type="text" value="${line.name}" onchange="updateProductionLineName(${index}, this.value)">
        </div>

        <div class="field">
            <label>
                <input type="checkbox" ${line.isEnabled ? 'checked' : ''} onchange="updateProductionLineEnabled(${index}, this.checked)">
                Enabled
            </label>
        </div>

        <div class="field">
            <label>Status</label>
            <span class="${line.isOn ? 'text-success' : 'text-error'}" style="font-weight: bold; font-size: 1.1rem;">
                ${line.isOn ? 'ON' : (() => {
                    if (!line.isEnabled) return 'OFF (Disabled)';
                    if (line.powerGridConnection === null) return 'OFF (No Grid)';
                    const grid = appState.powerGrids[line.powerGridConnection];
                    if (grid && !grid.isOn) return 'OFF (Insufficient Power)';
                    return 'OFF';
                })()}
            </span>
        </div>

        <div class="field">
            <label>Power Grid Connection</label>
            <select onchange="updateProductionLinePowerConnection(${index}, this.value)">
                <option value="">No Connection</option>
                ${appState.powerGrids.map((grid, gridIndex) =>
                    `<option value="${gridIndex}" ${line.powerGridConnection === gridIndex ? 'selected' : ''}>${grid.name}</option>`
                ).join('')}
            </select>
        </div>

        <h3>Target Report</h3>
        <div id="target-report-${index}"></div>

        <h3>Item Shortfalls</h3>
        <div id="item-shortfalls-${index}"></div>

        <h3>Target Production</h3>
        <div id="production-goals-${index}"></div>

        <h3>Extraction Configurations</h3>
        <div id="extraction-configs-${index}" class="config-list"></div>
        <button class="btn btn-small btn-primary mt-10" onclick="addExtractionConfig(${index})">Add Extractor</button>

        <h3>Production Configurations</h3>
        <div id="production-configs-${index}" class="config-list"></div>
        <button class="btn btn-small btn-primary mt-10" onclick="addProductionConfig(${index})">Add Production</button>

        <button class="btn btn-small btn-danger mt-20" onclick="deleteProductionLine(${index})">Delete Production Line</button>
    `;

    container.appendChild(header);
    container.appendChild(content);

    // Render subsections after adding to DOM
    setTimeout(() => {
        renderTargetReport(line, index);
        renderItemShortfalls(line, index);
        renderProductionGoals(line, index);
        renderExtractionConfigs(line, index);
        renderProductionConfigs(line, index);
    }, 0);

    return container;
}

/**
 * Render target report
 */
function renderTargetReport(line, lineIndex) {
    const container = document.getElementById(`target-report-${lineIndex}`);
    if (!container) return;

    container.innerHTML = '';

    if (line.productionGoals.size === 0) {
        container.innerHTML = '<p class="text-muted">No production goals set</p>';
    } else {
        const reportList = document.createElement('div');
        line.productionGoals.forEach((targetRate, itemIndex) => {
            const item = gameData2.items[itemIndex];
            const actualRate = line.itemsProduced.get(itemIndex) || 0;
            const isMet = actualRate >= targetRate;

            const reportDiv = document.createElement('div');
            reportDiv.className = 'summary-item-row';
            reportDiv.style.borderLeftColor = isMet ? 'var(--success-green)' : 'var(--error-red)';
            reportDiv.innerHTML = `
                <span style="color: var(--primary-text);">${item.name}</span>
                <span style="font-family: 'Courier New', monospace;">
                    <span style="color: ${isMet ? 'var(--success-green)' : 'var(--error-red)'};">${actualRate.toFixed(2)}</span>
                    <span style="color: var(--secondary-text);"> / </span>
                    <span style="color: var(--primary-text);">${targetRate.toFixed(2)}</span>
                    <span style="color: var(--secondary-text);"> /min</span>
                </span>
            `;
            reportList.appendChild(reportDiv);
        });
        container.appendChild(reportList);
    }
}

/**
 * Render item shortfalls
 */
function renderItemShortfalls(line, lineIndex) {
    const container = document.getElementById(`item-shortfalls-${lineIndex}`);
    if (!container) return;

    container.innerHTML = '';

    if (line.itemShortfalls.size === 0) {
        container.innerHTML = '<p class="text-success">No shortfalls - all production requirements met</p>';
    } else {
        const shortfallsList = document.createElement('div');
        line.itemShortfalls.forEach((shortfall, itemIndex) => {
            const item = gameData2.items[itemIndex];
            const shortfallDiv = document.createElement('div');
            shortfallDiv.className = 'summary-item-row';
            shortfallDiv.style.borderLeftColor = 'var(--error-red)';
            shortfallDiv.innerHTML = `
                <span style="color: var(--primary-text);">${item.name}</span>
                <span style="color: var(--error-red); font-family: 'Courier New', monospace;">
                    ${shortfall.toFixed(2)} /min needed
                </span>
            `;
            shortfallsList.appendChild(shortfallDiv);
        });
        container.appendChild(shortfallsList);
    }
}

/**
 * Render production goals
 */
function renderProductionGoals(line, lineIndex) {
    const container = document.getElementById(`production-goals-${lineIndex}`);
    if (!container) return;

    container.innerHTML = '';

    // Render existing goals
    if (line.productionGoals.size === 0) {
        container.innerHTML += '<p class="text-muted">No goals set</p>';
    } else {
        line.productionGoals.forEach((rate, itemIndex) => {
            const item = gameData2.items[itemIndex];
            const goalDiv = document.createElement('div');
            goalDiv.className = 'config-item';
            goalDiv.innerHTML = `
                <div class="config-item-header">
                    <span>${item.name}</span>
                    <button class="btn btn-small btn-danger" onclick="deleteProductionGoal(${lineIndex}, ${itemIndex})">Delete</button>
                </div>
                <div class="field">
                    <label>Target Rate (/min)</label>
                    <input type="number" min="0" step="0.01" value="${rate}"
                           onchange="updateProductionGoal(${lineIndex}, ${itemIndex}, this.value)">
                </div>
            `;
            container.appendChild(goalDiv);
        });
    }

    // Add new goal controls
    const addDiv = document.createElement('div');
    addDiv.className = 'flex flex-gap mt-10';
    addDiv.innerHTML = `
        <select id="goal-item-select-${lineIndex}" style="flex: 1;">
            <option value="">Select an item...</option>
            ${gameData2.ProductionItemList
                .map(itemIdx => ({ idx: itemIdx, name: gameData2.items[itemIdx].name }))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(item => `<option value="${item.idx}">${item.name}</option>`)
                .join('')}
        </select>
        <input type="number" id="goal-rate-input-${lineIndex}" placeholder="Rate /min" min="0" step="0.01" style="width: 150px;">
        <button class="btn btn-small btn-primary" onclick="addProductionGoal(${lineIndex})">Add Goal</button>
    `;
    container.appendChild(addDiv);
}

/**
 * Add a production goal
 */
function addProductionGoal(lineIndex) {
    const itemSelect = document.getElementById(`goal-item-select-${lineIndex}`);
    const rateInput = document.getElementById(`goal-rate-input-${lineIndex}`);

    const itemIndex = parseInt(itemSelect.value);
    const rate = parseFloat(rateInput.value);

    if (isNaN(itemIndex) || itemIndex === '') {
        alert('Please select an item');
        return;
    }

    if (isNaN(rate) || rate <= 0) {
        alert('Please enter a valid rate');
        return;
    }

    const line = appState.productionLines[lineIndex];
    line.productionGoals.set(itemIndex, rate);

    itemSelect.value = '';
    rateInput.value = '';

    renderProductionLines(); // Re-render all production lines to update headers
    renderGlobalReport();
    autoSave();
}

/**
 * Update a production goal
 */
function updateProductionGoal(lineIndex, itemIndex, value) {
    const line = appState.productionLines[lineIndex];
    const rate = parseFloat(value);
    if (!isNaN(rate) && rate > 0) {
        line.productionGoals.set(itemIndex, rate);
    }
    renderProductionLines(); // Re-render to update any displays
    renderGlobalReport();
    autoSave();
}

/**
 * Delete a production goal
 */
function deleteProductionGoal(lineIndex, itemIndex) {
    const line = appState.productionLines[lineIndex];
    line.productionGoals.delete(itemIndex);
    renderProductionLines(); // Re-render all production lines to update headers
    renderGlobalReport();
    autoSave();
}

/**
 * Render extraction configurations
 */
function renderExtractionConfigs(line, lineIndex) {
    const container = document.getElementById(`extraction-configs-${lineIndex}`);
    if (!container) return;

    container.innerHTML = '';

    if (line.extractionConfigs.length === 0) {
        container.innerHTML = '<p class="text-muted">No extractors configured</p>';
        return;
    }

    line.extractionConfigs.forEach((config, configIndex) => {
        const configElement = document.createElement('div');
        configElement.className = 'config-item';

        const building = gameData2.buildings[config.building];
        const item = gameData2.items[config.producedItem];

        configElement.innerHTML = `
            <div class="config-item-header">
                <span>${building.name} - ${item.name} (${config.productionRate.toFixed(2)} /min)</span>
                <button class="btn btn-small btn-danger" onclick="deleteExtractionConfig(${lineIndex}, ${configIndex})">Delete</button>
            </div>
            <div class="config-item-fields">
                <div class="field">
                    <label>Building Type</label>
                    <select onchange="updateExtractionConfigField(${lineIndex}, ${configIndex}, 'building', this.value)">
                        ${gameData2.ExtractionBuildingList
                            .map(buildingIdx => ({ idx: buildingIdx, name: gameData2.buildings[buildingIdx].name }))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(b => `<option value="${b.idx}" ${b.idx === config.building ? 'selected' : ''}>${b.name}</option>`)
                            .join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Resource</label>
                    <select onchange="updateExtractionConfigField(${lineIndex}, ${configIndex}, 'producedItem', this.value)">
                        ${Array.from(building.resourceOutputHash.keys())
                            .map(itemIdx => ({ idx: itemIdx, name: gameData2.items[itemIdx].name }))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(i => `<option value="${i.idx}" ${i.idx === config.producedItem ? 'selected' : ''}>${i.name}</option>`)
                            .join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Purity</label>
                    <select onchange="updateExtractionConfigField(${lineIndex}, ${configIndex}, 'purity', this.value)">
                        <option value="impure" ${config.purity === 'impure' ? 'selected' : ''}>Impure</option>
                        <option value="normal" ${config.purity === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="pure" ${config.purity === 'pure' ? 'selected' : ''}>Pure</option>
                    </select>
                </div>
                <div class="field">
                    <label>Clock Speed (%)</label>
                    <input type="number" min="0" max="250" value="${config.clockSpeed}"
                           onchange="updateExtractionConfigField(${lineIndex}, ${configIndex}, 'clockSpeed', this.value)">
                </div>
                <div class="field">
                    <label>Count</label>
                    <input type="number" min="1" value="${config.count}"
                           onchange="updateExtractionConfigField(${lineIndex}, ${configIndex}, 'count', this.value)">
                </div>
            </div>
        `;

        container.appendChild(configElement);
    });
}

/**
 * Add extraction configuration
 */
function addExtractionConfig(lineIndex) {
    const line = appState.productionLines[lineIndex];
    const defaultBuilding = gameData2.ExtractionBuildingList[0];
    const building = gameData2.buildings[defaultBuilding];
    const defaultItem = Array.from(building.resourceOutputHash.keys())[0];

    const config = stateModel2.createExtractionConfig(defaultBuilding, defaultItem, 'normal', 100, 1);
    line.extractionConfigs.push(config);

    renderExtractionConfigs(line, lineIndex);
    renderGlobalReport();
    autoSave();
}

/**
 * Update extraction config field
 */
function updateExtractionConfigField(lineIndex, configIndex, field, value) {
    const line = appState.productionLines[lineIndex];
    const config = line.extractionConfigs[configIndex];

    if (field === 'building') {
        const newBuildingIdx = parseInt(value);
        config.building = newBuildingIdx;
        const building = gameData2.buildings[newBuildingIdx];
        // Reset item to first available
        config.producedItem = Array.from(building.resourceOutputHash.keys())[0];
    } else if (field === 'clockSpeed' || field === 'count') {
        config[field] = parseFloat(value);
    } else if (field === 'producedItem') {
        config[field] = parseInt(value);
    } else {
        config[field] = value;
    }

    // Update calculations first, then render reports
    renderGlobalReport();
    renderTargetReport(line, lineIndex);
    renderItemShortfalls(line, lineIndex);
    renderExtractionConfigs(line, lineIndex);
    autoSave();
}

/**
 * Delete extraction config
 */
function deleteExtractionConfig(lineIndex, configIndex) {
    if (!confirm('Delete this extraction configuration?')) return;

    const line = appState.productionLines[lineIndex];
    line.extractionConfigs.splice(configIndex, 1);

    // Update calculations first, then render reports
    renderGlobalReport();
    renderTargetReport(line, lineIndex);
    renderItemShortfalls(line, lineIndex);
    renderExtractionConfigs(line, lineIndex);
    autoSave();
}

/**
 * Render production configurations
 */
function renderProductionConfigs(line, lineIndex) {
    const container = document.getElementById(`production-configs-${lineIndex}`);
    if (!container) return;

    container.innerHTML = '';

    if (line.productionConfigs.length === 0) {
        container.innerHTML = '<p class="text-muted">No production machines configured</p>';
        return;
    }

    line.productionConfigs.forEach((config, configIndex) => {
        const configElement = document.createElement('div');
        configElement.className = 'config-item';

        const recipe = gameData2.recipes[config.recipe];
        const building = gameData2.buildings[config.building];

        // Calculate total output
        let totalOutput = 0;
        config.outputs.forEach(rate => totalOutput += rate);

        configElement.innerHTML = `
            <div class="config-item-header">
                <span>${recipe.name} - ${building.name} (${totalOutput.toFixed(2)} /min)</span>
                <button class="btn btn-small btn-danger" onclick="deleteProductionConfig(${lineIndex}, ${configIndex})">Delete</button>
            </div>
            <div class="config-item-fields">
                <div class="field">
                    <label>Recipe</label>
                    <select onchange="updateProductionConfigField(${lineIndex}, ${configIndex}, 'recipe', this.value)">
                        ${[...gameData2.StandardRecipeList, ...appState.unlockedRecipes
                            .map((unlocked, altIdx) => unlocked ? gameData2.AlternateRecipeList[altIdx] : null)
                            .filter(idx => idx !== null)]
                            .sort((a, b) => gameData2.recipes[a].name.localeCompare(gameData2.recipes[b].name))
                            .map(recipeIdx => {
                                const r = gameData2.recipes[recipeIdx];
                                const b = gameData2.buildings[r.building];
                                return `<option value="${recipeIdx}" ${recipeIdx === config.recipe ? 'selected' : ''}>${r.name} (${b.name})</option>`;
                            }).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Clock Speed (%)</label>
                    <input type="number" min="0" max="250" value="${config.clockSpeed}"
                           onchange="updateProductionConfigField(${lineIndex}, ${configIndex}, 'clockSpeed', this.value)">
                </div>
                <div class="field">
                    <label>Sommersloops</label>
                    <input type="number" min="0" max="${building.maxSommersloops}" value="${config.sommersloops}"
                           onchange="updateProductionConfigField(${lineIndex}, ${configIndex}, 'sommersloops', this.value)">
                </div>
                <div class="field">
                    <label>Count</label>
                    <input type="number" min="1" value="${config.count}"
                           onchange="updateProductionConfigField(${lineIndex}, ${configIndex}, 'count', this.value)">
                </div>
            </div>
        `;

        container.appendChild(configElement);
    });
}

/**
 * Add production configuration
 */
function addProductionConfig(lineIndex) {
    const line = appState.productionLines[lineIndex];
    const defaultRecipe = gameData2.StandardRecipeList[0];

    const config = stateModel2.createProductionConfig(defaultRecipe, 100, 0, 1);
    line.productionConfigs.push(config);

    renderProductionConfigs(line, lineIndex);
    renderGlobalReport();
    autoSave();
}

/**
 * Update production config field
 */
function updateProductionConfigField(lineIndex, configIndex, field, value) {
    const line = appState.productionLines[lineIndex];
    const config = line.productionConfigs[configIndex];

    if (field === 'recipe') {
        const newRecipeIdx = parseInt(value);
        config.recipe = newRecipeIdx;
        config.building = gameData2.recipes[newRecipeIdx].building;
    } else {
        config[field] = parseFloat(value);
    }

    // Update calculations first, then render reports
    renderGlobalReport();
    renderTargetReport(line, lineIndex);
    renderItemShortfalls(line, lineIndex);
    renderProductionConfigs(line, lineIndex);
    autoSave();
}

/**
 * Delete production config
 */
function deleteProductionConfig(lineIndex, configIndex) {
    if (!confirm('Delete this production configuration?')) return;

    const line = appState.productionLines[lineIndex];
    line.productionConfigs.splice(configIndex, 1);

    // Update calculations first, then render reports
    renderGlobalReport();
    renderTargetReport(line, lineIndex);
    renderItemShortfalls(line, lineIndex);
    renderProductionConfigs(line, lineIndex);
    autoSave();
}

/**
 * Update production line name
 */
function updateProductionLineName(index, name) {
    appState.productionLines[index].name = name;
    renderUI();
    autoSave();
}

/**
 * Update production line enabled state
 */
function updateProductionLineEnabled(index, enabled) {
    appState.productionLines[index].isEnabled = enabled;
    renderUI();
    autoSave();
}

/**
 * Update production line power grid connection
 */
function updateProductionLinePowerConnection(index, value) {
    const line = appState.productionLines[index];
    if (value === '') {
        line.powerGridConnection = null;
    } else {
        line.powerGridConnection = parseInt(value);
    }
    renderUI();
    autoSave();
}

/**
 * Delete production line
 */
function deleteProductionLine(index) {
    if (!confirm('Delete this production line? This cannot be undone.')) return;

    appState.productionLines.splice(index, 1);
    renderUI();
    autoSave();
}

// ============================================================================
// ALTERNATIVE RECIPES
// ============================================================================

/**
 * Add an alternative recipe
 */
function addAlternativeRecipe() {
    const select = document.getElementById('alt-recipe-select');
    const altIndex = parseInt(select.value);

    if (isNaN(altIndex)) {
        return;
    }

    appState.unlockedRecipes[altIndex] = true;
    select.value = '';
    renderUI();
    autoSave();
}

/**
 * Remove an alternative recipe
 */
function removeAlternativeRecipe(altIndex) {
    appState.unlockedRecipes[altIndex] = false;
    renderUI();
    autoSave();
}

// ============================================================================
// COLLAPSIBLE STATE
// ============================================================================

/**
 * Toggle collapse state of an element
 */
function toggleCollapse(key, element) {
    const isCurrentlyExpanded = collapsedStates[key] !== false;
    collapsedStates[key] = !isCurrentlyExpanded;

    const header = element.querySelector('.collapsible-header');
    const content = element.querySelector('.collapsible-content');
    const toggle = element.querySelector('.collapsible-toggle');

    if (isCurrentlyExpanded) {
        header.classList.remove('expanded');
        content.classList.remove('expanded');
        toggle.classList.remove('expanded');
    } else {
        header.classList.add('expanded');
        content.classList.add('expanded');
        toggle.classList.add('expanded');
    }

    saveCollapsedStates();
}

/**
 * Save collapsed states to localStorage
 */
function saveCollapsedStates() {
    try {
        localStorage.setItem(LOCALSTORAGE_COLLAPSED_KEY, JSON.stringify(collapsedStates));
    } catch (e) {
        // Ignore errors
    }
}

/**
 * Load collapsed states from localStorage
 */
function loadCollapsedStates() {
    try {
        const stored = localStorage.getItem(LOCALSTORAGE_COLLAPSED_KEY);
        if (stored) {
            collapsedStates = JSON.parse(stored);
        }
    } catch (e) {
        collapsedStates = {};
    }
}

// ============================================================================
// STATE PERSISTENCE
// ============================================================================

/**
 * Serialize state to JSON
 */
function serializeState() {
    const serialized = {
        unlockedRecipes: appState.unlockedRecipes,
        maxBeltResearched: appState.maxBeltResearched,
        maxPipeResearched: appState.maxPipeResearched,
        powerGrids: appState.powerGrids.map(grid => ({
            name: grid.name,
            powerConfigs: grid.powerConfigs
        })),
        productionLines: appState.productionLines.map(line => ({
            name: line.name,
            productionGoals: Array.from(line.productionGoals.entries()),
            productionConfigs: line.productionConfigs,
            extractionConfigs: line.extractionConfigs,
            powerGridConnection: line.powerGridConnection,
            isEnabled: line.isEnabled,
            fuelsExported: line.fuelsExported,
            itemsExported: line.itemsExported
        }))
    };

    return JSON.stringify(serialized, null, 2);
}

/**
 * Deserialize state from JSON
 */
function deserializeState(json) {
    const data = JSON.parse(json);

    const state = {
        unlockedRecipes: data.unlockedRecipes,
        maxBeltResearched: data.maxBeltResearched,
        maxPipeResearched: data.maxPipeResearched,
        powerGrids: data.powerGrids.map(grid => ({
            ...stateModel2.createPowerGrid(grid.name),
            powerConfigs: grid.powerConfigs || []
        })),
        productionLines: data.productionLines.map(line => {
            // Migrate old powerGridConnections (array) to powerGridConnection (single value)
            let powerGridConnection = null;
            if (line.powerGridConnection !== undefined) {
                powerGridConnection = line.powerGridConnection;
            } else if (line.powerGridConnections && line.powerGridConnections.length > 0) {
                // Take the first connection from old format
                powerGridConnection = line.powerGridConnections[0];
            }

            return {
                ...stateModel2.createProductionLine(line.name),
                productionGoals: new Map(line.productionGoals),
                productionConfigs: line.productionConfigs || [],
                extractionConfigs: line.extractionConfigs || [],
                powerGridConnection: powerGridConnection,
                isEnabled: line.isEnabled !== undefined ? line.isEnabled : true,
                fuelsExported: line.fuelsExported || new Map(),
                itemsExported: line.itemsExported || new Map()
            };
        })
    };

    return state;
}

/**
 * Auto-save to localStorage
 */
function autoSave() {
    try {
        const json = serializeState();

        if (json.length > LOCALSTORAGE_SIZE_LIMIT) {
            showSaveStatus('State too large for localStorage. Please download to file.', 'error');
            return;
        }

        localStorage.setItem(LOCALSTORAGE_STATE_KEY, json);
        showSaveStatus('Saved to browser storage', 'success');
    } catch (e) {
        showSaveStatus('Failed to save: ' + e.message + '. Please download to file.', 'error');
    }
}

/**
 * Load state from localStorage
 */
function loadStateFromLocalStorage() {
    try {
        const json = localStorage.getItem(LOCALSTORAGE_STATE_KEY);
        if (json) {
            return deserializeState(json);
        }
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
    }
    return null;
}

/**
 * Download state as JSON file
 */
function downloadState() {
    const json = serializeState();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'satisfactory-planner-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Upload state from JSON file
 */
function uploadState(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = e.target.result;
            appState = deserializeState(json);
            renderUI();
            autoSave();
            showSaveStatus('Configuration loaded successfully', 'success');
        } catch (error) {
            showSaveStatus('Failed to load configuration: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);

    event.target.value = '';
}

/**
 * Clear cache
 */
function clearCache() {
    if (!confirm('Are you sure you want to clear all saved data? This will reset to the default state and cannot be undone.')) {
        return;
    }

    localStorage.removeItem(LOCALSTORAGE_STATE_KEY);
    localStorage.removeItem(LOCALSTORAGE_COLLAPSED_KEY);
    collapsedStates = {};

    // Reload page to start fresh
    window.location.reload();
}

/**
 * Show save status message
 */
function showSaveStatus(message, type) {
    const statusEl = document.getElementById('save-status');
    statusEl.textContent = message;
    statusEl.className = 'save-status ' + type;

    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'save-status';
    }, 5000);
}

// ============================================================================
// INITIALIZATION - Start the app when DOM is ready
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
