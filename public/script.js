const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 4;
const GRID_WIDTH = 2000;
const GRID_HEIGHT = 1000;

canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = GRID_HEIGHT * CELL_SIZE;

let selected = [];
let occupied = {};

fetch("/api/loadCells")
.then(res => res.json())
.then(data => {
data.forEach(c => {
occupied[`${c.x},${c.y}`] = c;
drawCell(c.x, c.y, c.color);
});
updateCounter();
});

function drawCell(x, y, color) {
ctx.fillStyle = color;
ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

canvas.addEventListener("mousedown", e => {
selected = [];
const x = Math.floor(e.offsetX / CELL_SIZE);
const y = Math.floor(e.offsetY / CELL_SIZE);
if (!occupied[`${x},${y}`]) {
selected.push({ x, y });
openPopup();
}
});

function openPopup() {
document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
document.getElementById("popup").classList.add("hidden");
}

const acceptTerms = document.getElementById("acceptTerms");
const buyBtn = document.getElementById("buyBtn");

acceptTerms.addEventListener("change", () => {
buyBtn.disabled = !acceptTerms.checked;
});

buyBtn.onclick = () => {
if (!acceptTerms.checked) return;

const payload = {
cells: selected,
title: title.value,
color: color.value,
link: link.value,
text: text.value,
image: image.value
};

fetch("/api/buyBlock", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload)
}).then(() => location.reload());
};

function updateCounter() {
document.getElementById("counter").innerText =
`Celle occupate: ${Object.keys(occupied).length} / 2.000.000`;
}