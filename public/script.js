const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const freeCellsSpan = document.getElementById('freeCells');
const occupiedCellsSpan = document.getElementById('occupiedCells');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const canvasSize = 2000; // 2000x2000 pixel canvas
canvas.width = canvasSize;
canvas.height = canvasSize;

let cells = {}; // dati delle celle acquistate
let selecting = false;
let startX, startY;
let selectedCells = [];

// disegna canvas nero
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// gestione click e drag
canvas.addEventListener('mousedown', e => {
selecting = true;
const rect = canvas.getBoundingClientRect();
startX = e.clientX - rect.left;
startY = e.clientY - rect.top;
selectedCells = [[startX, startY]];
});

canvas.addEventListener('mousemove', e => {
if (!selecting) return;
const rect = canvas.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
selectedCells.push([x, y]);
drawSelection();
});

canvas.addEventListener('mouseup', e => {
selecting = false;
openPurchasePopup();
selectedCells = [];
drawCanvas();
});

// funzione per evidenziare le celle selezionate
function drawSelection() {
drawCanvas();
ctx.strokeStyle = "yellow";
ctx.lineWidth = 2;
ctx.beginPath();
const x0 = selectedCells[0][0];
const y0 = selectedCells[0][1];
const x1 = selectedCells[selectedCells.length-1][0];
const y1 = selectedCells[selectedCells.length-1][1];
ctx.rect(Math.min(x0,x1), Math.min(y0,y1), Math.abs(x1-x0), Math.abs(y1-y0));
ctx.stroke();
}

// funzione per ridisegnare tutto il canvas con celle acquistate
function drawCanvas() {
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);
for (const key in cells) {
const cell = cells[key];
ctx.fillStyle = cell.color || "white";
ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
}
}

// popup acquisto simulato
function openPurchasePopup() {
if(selectedCells.length === 0) return;
const title = prompt("Enter a title for your purchase:");
if(!title) return;
// salva le celle
selectedCells.forEach(c => {
const key = `${c[0]}-${c[1]}`;
cells[key] = {x:c[0], y:c[1], width:1, height:1, color:'red', title:title};
});
updateCounters();
drawCanvas();
alert(`Your purchase "${title}" has been placed!`);
}

// aggiornamento contatori
function updateCounters() {
let occupied = Object.keys(cells).length;
let free = 2000000 - occupied;
freeCellsSpan.textContent = `Free: ${free}`;
occupiedCellsSpan.textContent = `Occupied: ${occupied}`;
}

// ricerca
searchBtn.addEventListener('click', () => {
const term = searchInput.value.toLowerCase();
for (const key in cells) {
const cell = cells[key];
if(cell.title.toLowerCase().includes(term)) {
// lampeggio blu
ctx.strokeStyle = "blue";
ctx.lineWidth = 2;
ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
}
}
});

// zoom dinamico
canvas.addEventListener('wheel', e => {
e.preventDefault();
const scale = e.deltaY < 0 ? 1.1 : 0.9;
canvas.style.transform = `scale(${scale})`;
});