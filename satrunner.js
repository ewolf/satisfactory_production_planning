const satdata = require( './satdata.js' );

const CONSTS = satdata.CONSTS;
const ITEMS = CONSTS.ITEMS;


function SatisfactoryCalculator() {

  const STORAGE_KEY = 'satisfactory_production_state';

  const DEFAULT_LINE = {
    name: 'Production Line 1',
    targetItems: [{ item_id: CONSTS.NAME2ITEM_ID['Smart Plating'], rate: 2 }],
    isExpanded: true
  };

/*
  const [world, setWorld] = useState({
    name: 'my world',
    productionLines: [DEFAULT_LINE],
    activeLineIdx: 0,
  });
*/
  const world = {
    name: 'my world',
    productionLines: [DEFAULT_LINE],
    activeLineIdx: 0,
  };



  satdata.setupProdConf(DEFAULT_LINE);

  const calculate = () => {
    const line = satdata.setupProdConf(world.productionLines[world.activeLineIdx]);
  };

  // reality -> world + calcualted state
/*
  const [reality, setReality] = useState({
    world,
    calculated: calculate(),
  });
*/
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

}

SatisfactoryCalculator();
