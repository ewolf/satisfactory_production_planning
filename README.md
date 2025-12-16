# Satisfactory Production Planning

Plan and optimize Satisfactory production lines, power grids, and extraction setups. The app follows the specifications in `Model.txt` and `UI.txt`, runs entirely in the browser, and can be served locally with a tiny Node static server.

## Project Structure
- `index.html`, `styles.css`, `ui.js` – browser UI that mirrors the behaviors in `UI.txt`
- `model/` – immutable game data (`gameData.js`), state helpers (`stateModel.js`), and supporting checks/scripts
- `server.js` – minimal static file server for local development
- `tests` – runnable Node scenarios (`model/test.js`, `test_shortfalls.js`, `test_circuit_board.js`)
- Specs and notes – `Model.txt`, `UI.txt`, `Tests.txt`

## Getting Started
1) Install Node.js (18+ recommended).  
2) Install dependencies (none today, but this sets up `node_modules/` if added later):
```bash
npm install
```
3) Run the local server:
```bash
npm start
```
Open `http://localhost:3000` and use the UI to build power grids and production lines. State is saved to localStorage and can be imported/exported as JSON.

## Tests
Execute the Node-based checks:
```bash
npm test
```
These cover core calculations (rates, power, sommersloops) and a few production-line scenarios. Tests rely on the compatibility wrappers `model/gameData2.js` and `model/stateModel2.js`, which point to the current implementations.

## Publishing to GitHub
This folder is ready to become a GitHub repo:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<your-user>/satisfactory_production_planning.git
git push -u origin main
```
Replace `<your-user>` with your GitHub handle. If you prefer HTTPS, swap the remote URL accordingly.
