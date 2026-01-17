const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

const popup = document.getElementById("purchasePopup");
const closeBtn = document.getElementById("closePopup");
const buyBtn = document.getElementById("buyButton");
const acceptTerms = document.getElementById("acceptTerms");

const popupCoords = document.getElementById("popupCoords");
const popupSize = document.getElementById("popupSize");
const popupPrice = document.getElementById("popupPrice");

const CELL_SIZE = 1;
const PRICE_PER_CELL = 1;

let isSelecting = false;
let startCell = null;
let endCell = null;

// CANVAS NERO (COME VERSIONE ORIGINALE)
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ================= SELEZIONE CELLE =================
canvas.addEventListener("mousedown", (e) => {
isSelecting = true;
startCell = getCellFromEvent(e);
endCell = startCell;
});

canvas.addEventListener("mousemove", (e) => {
if (!isSelecting) return;
endCell = getCellFromEvent(e);
redrawSelection();
});

canvas.addEventListener("mouseup", () => {
if (!isSelecting) return;
isSelecting = false;
openPopup();
});

// ================= FUNZIONI =================
function getCellFromEvent(e) {
const rect = canvas.getBoundingClientRect();
return {
x: Math.floor((e.clientX - rect.left) / CELL_SIZE),
y: Math.floor((e.clientY - rect.top) / CELL_SIZE),
};
}

function redrawSelection() {
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const x = Math.min(startCell.x, endCell.x);
const y = Math.min(startCell.y, endCell.y);
const w = Math.abs(startCell.x - endCell.x) + 1;
const h = Math.abs(startCell.y - endCell.y) + 1;

ctx.fillStyle = "rgba(0, 150, 255, 0.4)";
ctx.fillRect(x, y, w, h);
}

function openPopup() {
const x = Math.min(startCell.x, endCell.x);
const y = Math.min(startCell.y, endCell.y);
const w = Math.abs(startCell.x - endCell.x) + 1;
const h = Math.abs(startCell.y - endCell.y) + 1;

const cells = w * h;
const price = cells * PRICE_PER_CELL;

popupCoords.textContent = `Coordinates: (${x}, ${y})`;
popupSize.textContent = `Selected area: ${w} × ${h} = ${cells} cells`;
popupPrice.textContent = `Total price: €${price}`;

popup.classList.remove("hidden");
}

// ================= POPUP CONTROL =================
closeBtn.addEventListener("click", () => {
popup.classList.add("hidden");
});

acceptTerms.addEventListener("change", () => {
buyBtn.disabled = !acceptTerms.checked;
});