// script.js - Pixel Kingdom (canvas 2000x1000, selezione multipla, popup, evidenziazione)

// Canvas e contesto
const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 2000;
canvas.height = 1000;

let scale = 1;
let offsetX = 0;
let offsetY = 0;

// Griglia nera iniziale
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);

// Variabili selezione
let isSelecting = false;
let selectStartX = 0;
let selectStartY = 0;
let selectionRect = {x:0,y:0,w:0,h:0};
let occupiedCells = {}; // demo, celle già acquistate

// Zoom
canvas.addEventListener("wheel", (e) => {
e.preventDefault();
const zoomFactor = 1.1;
const prevScale = scale;

if(e.deltaY < 0){
scale *= zoomFactor;
} else {
scale /= zoomFactor;
}
scale = Math.min(Math.max(scale, 0.2), 5); // limiti min/max zoom

// centraggio su mouse
offsetX -= (canvas.width/2 - offsetX) * (scale/prevScale -1);
offsetY -= (canvas.height/2 - offsetY) * (scale/prevScale -1);
updateTransform();
});

// Aggiorna trasformazione canvas
function updateTransform(){
ctx.setTransform(scale,0,0,scale,offsetX,offsetY);
drawCanvas();
}

// Disegna griglia nera + celle occupate
function drawCanvas(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);

// celle occupate
for(let key in occupiedCells){
const [x,y] = key.split("_").map(Number);
ctx.fillStyle = "red";
ctx.fillRect(x, y, 1,1);
}

// evidenzia selezione
if(selectionRect.w > 0 && selectionRect.h >0){
ctx.strokeStyle = "yellow";
ctx.lineWidth = 2;
ctx.strokeRect(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
}
}

drawCanvas();

// Selezione con mouse
const wrapper = document.getElementById("canvasWrapper");
const selectionInfo = document.getElementById("selectionInfo");
const popup = document.getElementById("popup");
const purchaseConfirm = document.getElementById("purchaseConfirm");
const acceptTerms = document.getElementById("acceptTerms");

let isDragging = false;
let startX = 0;
let startY = 0;

// Mouse down
wrapper.addEventListener("mousedown", (e) => {
const rect = canvas.getBoundingClientRect();
if(e.target === canvas){
isSelecting = true;
selectStartX = (e.clientX - rect.left)/scale;
selectStartY = (e.clientY - rect.top)/scale;
} else {
isDragging = true;
startX = e.clientX - offsetX;
startY = e.clientY - offsetY;
wrapper.style.cursor = "grabbing";
}
});

// Mouse move
window.addEventListener("mousemove", (e) => {
const rect = canvas.getBoundingClientRect();

if (isDragging) {
offsetX = e.clientX - startX;
offsetY = e.clientY - startY;
updateTransform();
}

if (isSelecting) {
const currentX = (e.clientX - rect.left)/scale;
const currentY = (e.clientY - rect.top)/scale;

const startXCell = Math.floor(selectStartX);
const startYCell = Math.floor(selectStartY);
const endXCell = Math.floor(currentX);
const endYCell = Math.floor(currentY);

const selX = Math.min(startXCell, endXCell);
const selY = Math.min(startYCell, endYCell);
const selW = Math.abs(endXCell - startXCell) + 1;
const selH = Math.abs(endYCell - startYCell) + 1;

selectionRect = { x: selX, y: selY, w: selW, h: selH };

// Aggiorna info selezione in tempo reale
selectionInfo.textContent = `Selected: ${selW} x ${selH} = ${selW*selH} cells`;

// ridisegna canvas
drawCanvas();
}
});

// Mouse up
window.addEventListener("mouseup", () => {
if(isSelecting){
isSelecting = false;
showPopup();
}
isDragging = false;
wrapper.style.cursor = "grab";
});

// Click singolo
canvas.addEventListener("click", (e) => {
if(!isSelecting){
const rect = canvas.getBoundingClientRect();
const x = Math.floor((e.clientX - rect.left)/scale);
const y = Math.floor((e.clientY - rect.top)/scale);

selectionRect = { x, y, w:1, h:1 };
selectionInfo.textContent = `Selected: 1 x 1 = 1 cell`;
showPopup();
}
});

// Mostra popup
function showPopup(){
document.getElementById("popupTitle").textContent = `Purchase ${selectionRect.w} x ${selectionRect.h} = ${selectionRect.w*selectionRect.h} cells`;
popup.classList.remove("hidden");
}

// Acquisto demo
purchaseConfirm.addEventListener("click", () => {
if(!acceptTerms.checked){
alert("You must accept the Terms & Conditions");
return;
}

const cellsBought = selectionRect.w * selectionRect.h;
alert(`Purchase confirmed!\nCells: ${selectionRect.w} x ${selectionRect.h} = ${cellsBought} cells\nTotal: ${cellsBought}€`);
popup.classList.add("hidden");

// aggiorna celle occupate
for(let i=0;i<selectionRect.w;i++){
for(let j=0;j<selectionRect.h;j++){
const key = `${selectionRect.x + i}_${selectionRect.y + j}`;
occupiedCells[key] = true;
}
}
updateCounter();
});

// Contatore celle libere/occupate
function updateCounter(){
const totalCells = canvas.width * canvas.height;
const occupied = Object.keys(occupiedCells).length;
const free = totalCells - occupied;
document.getElementById("cellCounter").textContent = `Free: ${free} | Occupied: ${occupied}`;
}

updateCounter();