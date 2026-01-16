const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

const popup = document.getElementById("popup");
const purchaseConfirm = document.getElementById("purchaseConfirm");
const selectionInfo = document.getElementById("selectionInfo");
const acceptTerms = document.getElementById("acceptTerms");
const selectedCellsInfo = document.getElementById("selectedCellsInfo");

const cellSize = 2; // dimensione singola cella in pixel
const cols = 2000;
const rows = 1000;

// Array per tenere traccia delle celle acquistate
const grid = Array.from({ length: cols }, () => Array(rows).fill(false));

// variabili selezione
let selecting = false;
let startX = 0, startY = 0;
let selectionRect = { x: 0, y: 0, w: 0, h: 0 };

// inizializza canvas nero
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);

// --- EVENTI MOUSE ---
canvas.addEventListener("mousedown", e => {
const rect = canvas.getBoundingClientRect();
startX = Math.floor((e.clientX - rect.left) / cellSize);
startY = Math.floor((e.clientY - rect.top) / cellSize);
selecting = true;
});

canvas.addEventListener("mousemove", e => {
if (!selecting) return;

const rect = canvas.getBoundingClientRect();
const currentX = Math.floor((e.clientX - rect.left) / cellSize);
const currentY = Math.floor((e.clientY - rect.top) / cellSize);

const selX = Math.min(startX, currentX);
const selY = Math.min(startY, currentY);
const selW = Math.abs(currentX - startX) + 1;
const selH = Math.abs(currentY - startY) + 1;

selectionRect = { x: selX, y: selY, w: selW, h: selH };

selectionInfo.textContent = `Selected: ${selW} x ${selH} = ${selW*selH} cells`;

// disegna selezione evidenziata
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);

ctx.strokeStyle = "yellow";
ctx.lineWidth = 2;
ctx.strokeRect(selX*cellSize, selY*cellSize, selW*cellSize, selH*cellSize);
});

canvas.addEventListener("mouseup", e => {
selecting = false;
// mostra popup
popup.classList.remove("hidden");
selectedCellsInfo.textContent = `Selected cells: ${selectionRect.w * selectionRect.h} — Total cost: ${selectionRect.w * selectionRect.h} €`;
});

// --- BUTTON PURCHASE ---
purchaseConfirm.addEventListener("click", () => {
if (!acceptTerms.checked) {
alert("You must accept the terms and conditions!");
return;
}
// aggiorna griglia
for (let x = selectionRect.x; x < selectionRect.x + selectionRect.w; x++) {
for (let y = selectionRect.y; y < selectionRect.y + selectionRect.h; y++) {
grid[x][y] = true;
ctx.fillStyle = "#0af"; // esempio colore acquistato
ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
}
}
popup.classList.add("hidden");
});