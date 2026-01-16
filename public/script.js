const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const wrapper = document.getElementById("canvas-wrapper");

// popup
const popup = document.getElementById("purchasePopup");
const purchaseCancel = document.getElementById("purchaseCancel");
const purchaseConfirm = document.getElementById("purchaseConfirm");
const selectionInfo = document.getElementById("selectionInfo");
const acceptTerms = document.getElementById("acceptTerms");

// cell counter
const freeCellsSpan = document.getElementById("freeCells");
const occupiedCellsSpan = document.getElementById("occupiedCells");

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

// gestione selezione celle
let isSelecting = false;
let selectStartX, selectStartY;
let selectionRect = null;
let occupiedCells = {}; // chiavi "x_y"

// inizializza canvas nero
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// update contatore
function updateCounter() {
const total = canvas.width * canvas.height; // qui consideriamo 1px = 1 cella
const occupied = Object.keys(occupiedCells).length;
freeCellsSpan.textContent = `Free: ${total - occupied}`;
occupiedCellsSpan.textContent = `Occupied: ${occupied}`;
}
updateCounter();

// trasformazioni zoom/pan
function updateTransform() {
canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// zoom
wrapper.addEventListener("wheel", (e) => {
e.preventDefault();
const zoomFactor = 0.1;
const direction = e.deltaY > 0 ? -1 : 1;

const newScale = scale + direction * zoomFactor;
if (newScale < 0.2 || newScale > 5) return; // limiti
scale = newScale;
updateTransform();
});

// pan
wrapper.addEventListener("mousedown", (e) => {
if(e.target === canvas) {
isSelecting = true;
const rect = canvas.getBoundingClientRect();
selectStartX = (e.clientX - rect.left) / scale;
selectStartY = (e.clientY - rect.top) / scale;
} else {
isDragging = true;
startX = e.clientX - offsetX;
startY = e.clientY - offsetY;
wrapper.style.cursor = "grabbing";
}
});

window.addEventListener("mouseup", (e) => {
if(isSelecting) {
isSelecting = false;
showPopup();
}
isDragging = false;
wrapper.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
if (isDragging) {
offsetX = e.clientX - startX;
offsetY = e.clientY - startY;
updateTransform();
}
if (isSelecting) {
const rect = canvas.getBoundingClientRect();
const currentX = (e.clientX - rect.left) / scale;
const currentY = (e.clientY - rect.top) / scale;
const width = currentX - selectStartX;
const height = currentY - selectStartY;

// disegna selezione temporanea
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle = "yellow";
ctx.lineWidth = 2;
ctx.strokeRect(selectStartX, selectStartY, width, height);

selectionRect = {x: selectStartX, y: selectStartY, w: width, h: height};
selectionInfo.textContent = `Selected: ${Math.abs(Math.round(width))} x ${Math.abs(Math.round(height))} = ${Math.abs(Math.round(width*height))} cells`;
}
});

// click singolo
canvas.addEventListener("click", (e) => {
if(!isSelecting) {
const rect = canvas.getBoundingClientRect();
const x = Math.floor((e.clientX - rect.left)/scale);
const y = Math.floor((e.clientY - rect.top)/scale);
selectionRect = {x, y, w:1, h:1};
selectionInfo.textContent = `Selected: 1 x 1 = 1 cell`;
showPopup();
}
});

// mostra popup
function showPopup() {
popup.classList.remove("hidden");
}

// chiudi popup
purchaseCancel.addEventListener("click", () => {
popup.classList.add("hidden");
});

// conferma acquisto (demo senza Stripe)
purchaseConfirm.addEventListener("click", () => {
if(!acceptTerms.checked){
alert("You must accept the Terms & Conditions");
return;
}
// qui andrà integrazione Stripe
const cellsBought = Math.abs(Math.round(selectionRect.w * selectionRect.h));
alert(`Purchase confirmed!\nCells: ${cellsBought}\nTotal: ${cellsBought}€`);
popup.classList.add("hidden");

// segna celle come occupate (demo)
for(let i=0;i<cellsBought;i++){
occupiedCells[`${i}_${i}`] = true;
}
updateCounter();
});