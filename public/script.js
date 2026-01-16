const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const purchaseConfirm = document.getElementById('purchaseConfirm');
const selectionInfo = document.getElementById('selectionInfo');
const popupCoordinates = document.getElementById('popupCoordinates');
const cellCounter = document.getElementById('cellCounter');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let isMouseDown = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let scale = 1;

// Griglia dati: false = libera, true = occupata
const grid = Array(canvasHeight).fill().map(() => Array(canvasWidth).fill(false));

// Eventi mouse
canvas.addEventListener('mousedown', e => {
const rect = canvas.getBoundingClientRect();
startX = Math.floor((e.clientX - rect.left) / scale);
startY = Math.floor((e.clientY - rect.top) / scale);
isMouseDown = true;
updateSelectionInfo(startX, startY, startX, startY, e.clientX, e.clientY);
selectionInfo.classList.remove('hidden');
});

canvas.addEventListener('mousemove', e => {
if (!isMouseDown) return;
const rect = canvas.getBoundingClientRect();
endX = Math.floor((e.clientX - rect.left) / scale);
endY = Math.floor((e.clientY - rect.top) / scale);
updateSelectionInfo(startX, startY, endX, endY, e.clientX, e.clientY);
drawCanvas();
});

canvas.addEventListener('mouseup', e => {
if (!isMouseDown) return;
isMouseDown = false;
selectionInfo.classList.add('hidden');
endX = Math.floor(endX);
endY = Math.floor(endY);
showPopup(startX, startY, endX, endY);
});

// Zoom con rotella
canvas.addEventListener('wheel', e => {
e.preventDefault();
const delta = e.deltaY < 0 ? 0.1 : -0.1;
scale = Math.min(Math.max(0.1, scale + delta), 5);
drawCanvas();
});

// Disegna canvas
function drawCanvas() {
ctx.clearRect(0, 0, canvasWidth, canvasHeight);
ctx.save();
ctx.scale(scale, scale);

for (let y = 0; y < canvasHeight; y++) {
for (let x = 0; x < canvasWidth; x++) {
if (grid[y][x]) {
ctx.fillStyle = '#fff';
ctx.fillRect(x, y, 1, 1);
}
}
}

// Evidenzia selezione
if (isMouseDown) {
const x0 = Math.min(startX, endX);
const y0 = Math.min(startY, endY);
const w = Math.abs(endX - startX) + 1;
const h = Math.abs(endY - startY) + 1;
ctx.fillStyle = 'rgba(0,255,255,0.3)';
ctx.fillRect(x0, y0, w, h);
}

ctx.restore();
}

// Popup
function showPopup(x0, y0, x1, y1) {
const startXSel = Math.min(x0, x1);
const startYSel = Math.min(y0, y1);
const width = Math.abs(x1 - x0) + 1;
const height = Math.abs(y1 - y0) + 1;
popupCoordinates.textContent = `Top-left: (${startXSel},${startYSel})`;
popup.querySelector('#popupTitle').value = '';
popup.querySelector('#popupText').value = '';
popup.querySelector('#popupLink').value = '';
popup.querySelector('#popupColor').value = '#ffffff';
popup.querySelector('#popupImage').value = '';
popup.querySelector('#acceptTermsPopup').checked = false;

popup.classList.remove('hidden');

// Salva selezione temporanea
popup.dataset.startX = startXSel;
popup.dataset.startY = startYSel;
popup.dataset.width = width;
popup.dataset.height = height;
}

// Chiudi popup
closePopup.addEventListener('click', () => popup.classList.add('hidden'));

// Conferma acquisto
purchaseConfirm.addEventListener('click', () => {
if (!document.getElementById('acceptTermsPopup').checked) {
alert('Please accept terms & conditions!');
return;
}
const startXSel = parseInt(popup.dataset.startX);
const startYSel = parseInt(popup.dataset.startY);
const width = parseInt(popup.dataset.width);
const height = parseInt(popup.dataset.height);

for (let y = startYSel; y < startYSel + height; y++) {
for (let x = startXSel; x < startXSel + width; x++) {
grid[y][x] = true;
}
}

// Aggiorna contatore globale
const occupied = grid.flat().filter(c => c).length;
const free = canvasWidth * canvasHeight - occupied;
cellCounter.textContent = `Free: ${free.toLocaleString()} | Occupied: ${occupied.toLocaleString()}`;

drawCanvas();
popup.classList.add('hidden');
});

// Info selezione vicino mouse
function updateSelectionInfo(x0, y0, x1, y1, mouseX, mouseY) {
const width = Math.abs(x1 - x0) + 1;
const height = Math.abs(y1 - y0) + 1;
selectionInfo.textContent = `${width} x ${height} = ${width*height} cells`;
selectionInfo.style.left = `${mouseX + 15}px`;
selectionInfo.style.top = `${mouseY + 15}px`;
}