const grid = document.getElementById("grid");
const CELL_SIZE = 10;
const COLS = 200;
const ROWS = 100;
let isSelecting = false;
let startCell = null;
let selectedCells = [];

// crea 200x100 blocchi
for (let i = 0; i < COLS * ROWS; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;
grid.appendChild(block);
}

// helper per ottenere cella da mouse
function getCellFromEvent(e) {
const rect = grid.getBoundingClientRect();
const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
return { x, y, index: y * COLS + x };
}

// evidenzia celle selezionate
function highlightSelection(cells) {
// reset
document.querySelectorAll(".block").forEach(b => b.classList.remove("selected"));
cells.forEach(cell => {
const el = document.querySelector(`.block[data-id="${cell.index}"]`);
if (el) el.classList.add("selected");
});
}

// mouse events
grid.addEventListener("mousedown", e => {
const cell = getCellFromEvent(e);
if (!cell) return;
isSelecting = true;
startCell = cell;
selectedCells = [cell];
highlightSelection(selectedCells);
});

grid.addEventListener("mousemove", e => {
if (!isSelecting || !startCell) return;
const cell = getCellFromEvent(e);
if (!cell) return;

selectedCells = [];
const x1 = Math.min(startCell.x, cell.x);
const y1 = Math.min(startCell.y, cell.y);
const x2 = Math.max(startCell.x, cell.x);
const y2 = Math.max(startCell.y, cell.y);

for (let y = y1; y <= y2; y++) {
for (let x = x1; x <= x2; x++) {
selectedCells.push({ x, y, index: y * COLS + x });
}
}
highlightSelection(selectedCells);
});

grid.addEventListener("mouseup", e => {
if (!isSelecting || !startCell) return;
isSelecting = false;

// apri pagina di acquisto con info delle celle selezionate
const cellIds = selectedCells.map(c => c.index).join(",");
const totalCells = selectedCells.length;

window.location.href = `/buy.html?cells=${cellIds}&total=${totalCells}`;
});

// caricamento blocchi acquistati
fetch("/api/blocks")
.then(res => res.json())
.then(blocks => {
blocks.forEach(b => {
const cellIds = b.cells.split(",").map(Number); // supponiamo salviamo array di id
const elFirst = document.querySelector(`.block[data-id="${cellIds[0]}"]`);
if (!elFirst) return;

// calcola numero di righe e colonne del blocco
const cols = Math.max(...cellIds.map(id => id % COLS)) - Math.min(...cellIds.map(id => id % COLS)) + 1;
const rows = Math.max(...cellIds.map(id => Math.floor(id / COLS))) - Math.min(...cellIds.map(id => Math.floor(id / COLS))) + 1;

// crea immagine unica che copre tutte le celle
const img = document.createElement("img");
img.src = b.image;
img.style.width = `${cols * CELL_SIZE}px`;
img.style.height = `${rows * CELL_SIZE}px`;
img.style.position = "absolute";
img.style.left = `${(Math.min(...cellIds.map(id => id % COLS))) * CELL_SIZE}px`;
img.style.top = `${Math.floor(Math.min(...cellIds.map(id => Math.floor(id / COLS)))) * CELL_SIZE}px`;
grid.appendChild(img);
});
});