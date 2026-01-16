const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

const popup = document.getElementById("popup");
const popupClose = document.getElementById("popupClose");
const purchaseConfirm = document.getElementById("purchaseConfirm");
const selectionInfo = document.getElementById("selectionInfo");
const mouseCounter = document.getElementById("mouseCounter");
const popupCoords = document.getElementById("popupCoords");
const selectedCellsInfo = document.getElementById("selectedCellsInfo");
const acceptTerms = document.getElementById("acceptTerms");

const cellSize = 2;
const cols = 2000;
const rows = 1000;

// Array celle
const grid = Array.from({ length: cols }, () => Array(rows).fill(false));

// Selezione
let selecting = false;
let startX = 0, startY = 0;
let selectionRect = { x:0,y:0,w:0,h:0 };

// Inizializza canvas nero
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);

// --- EVENTI MOUSE ---
canvas.addEventListener("mousedown", e => {
const rect = canvas.getBoundingClientRect();
startX = Math.floor((e.clientX - rect.left)/cellSize);
startY = Math.floor((e.clientY - rect.top)/cellSize);
selecting = true;

mouseCounter.classList.remove("hidden");
});

canvas.addEventListener("mousemove", e => {
if (!selecting) return;

const rect = canvas.getBoundingClientRect();
const currentX = Math.floor((e.clientX - rect.left)/cellSize);
const currentY = Math.floor((e.clientY - rect.top)/cellSize);

const selX = Math.min(startX, currentX);
const selY = Math.min(startY, currentY);
const selW = Math.abs(currentX - startX) + 1;
const selH = Math.abs(currentY - startY) + 1;

selectionRect = { x: selX, y: selY, w: selW, h: selH };

selectionInfo.textContent = `Selected: ${selW} x ${selH} = ${selW*selH} cells`;

// evidenzia selezione
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);
ctx.strokeStyle = "yellow";
ctx.lineWidth = 2;
ctx.strokeRect(selX*cellSize, selY*cellSize, selW*cellSize, selH*cellSize);

// aggiorna contatore celle
let free=0, occupied=0;
for(let x=0;x<cols;x++){
for(let y=0;y<rows;y++){
grid[x][y]?occupied++:free++;
}
}
mouseCounter.textContent = `Free: ${free} | Occupied: ${occupied}`;
});

canvas.addEventListener("mouseup", e => {
selecting = false;
popup.classList.remove("hidden");
popupCoords.textContent = `Coords: ${selectionRect.x},${selectionRect.y}`;
selectedCellsInfo.textContent = `Selected cells: ${selectionRect.w * selectionRect.h} — Total cost: ${selectionRect.w * selectionRect.h} €`;
});

// --- BUTTONS ---
popupClose.addEventListener("click", ()=>popup.classList.add("hidden"));

purchaseConfirm.addEventListener("click", ()=>{
if(!acceptTerms.checked){
alert("You must accept the terms and conditions!");
return;
}
for(let x=selectionRect.x;x<selectionRect.x+selectionRect.w;x++){
for(let y=selectionRect.y;y<selectionRect.y+selectionRect.h;y++){
grid[x][y]=true;
ctx.fillStyle="#0af";
ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
}
}
popup.classList.add("hidden");
});