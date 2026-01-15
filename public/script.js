const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 4;
const WIDTH = 2000;
const HEIGHT = 1000;
const TOTAL = WIDTH * HEIGHT;

canvas.width = WIDTH * CELL_SIZE;
canvas.height = HEIGHT * CELL_SIZE;

let occupied = {};
let selected = [];
let isDragging = false;
let startCell = null;

fetch("/api/loadCells")
.then(res => res.json())
.then(data => {
data.forEach(c => {
occupied[`${c.x},${c.y}`] = c;
drawCell(c.x, c.y, c.color);
});
updateCounters();
});

function drawCell(x, y, color) {
ctx.fillStyle = color;
ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

canvas.addEventListener("mousedown", e => {
isDragging = true;
selected = [];
startCell = getCell(e);
});

canvas.addEventListener("mousemove", e => {
if (!isDragging) return;
selected = getBlock(startCell, getCell(e));
});

canvas.addEventListener("mouseup", () => {
isDragging = false;
if (selected.length > 0) openPopup();
});

function getCell(e) {
return {
x: Math.floor(e.offsetX / CELL_SIZE),
y: Math.floor(e.offsetY / CELL_SIZE)
};
}

function getBlock(a, b) {
const cells = [];
const minX = Math.min(a.x, b.x);
const maxX = Math.max(a.x, b.x);
const minY = Math.min(a.y, b.y);
const maxY = Math.max(a.y, b.y);

for (let x = minX; x <= maxX; x++) {
for (let y = minY; y <= maxY; y++) {
if (!occupied[`${x},${y}`]) cells.push({ x, y });
}
}
return cells;
}

function openPopup() {
document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
document.getElementById("popup").classList.add("hidden");
}

function updateCounters() {
document.getElementById("usedCount").innerText = Object.keys(occupied).length;
document.getElementById("freeCount").innerText = TOTAL - Object.keys(occupied).length;
}

document.getElementById("year").innerText = new Date().getFullYear();