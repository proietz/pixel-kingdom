const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// dimensione canvas = 2 milioni di celle
canvas.width = 2000;
canvas.height = 1000;

// stato
let isDragging = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

// celle acquistate (mock)
const boughtCells = [];

// disegna canvas nero
function drawBase() {
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// celle acquistate
boughtCells.forEach(c => {
ctx.fillStyle = c.color;
ctx.fillRect(c.x, c.y, c.w, c.h);
});
}

// evidenzia selezione
function drawSelection() {
drawBase();
ctx.strokeStyle = "yellow";
ctx.lineWidth = 1;
ctx.strokeRect(
Math.min(startX, endX),
Math.min(startY, endY),
Math.abs(endX - startX),
Math.abs(endY - startY)
);
}

// mouse events
canvas.addEventListener("mousedown", e => {
const rect = canvas.getBoundingClientRect();
startX = Math.floor(e.clientX - rect.left);
startY = Math.floor(e.clientY - rect.top);
endX = startX;
endY = startY;
isDragging = true;
});

canvas.addEventListener("mousemove", e => {
if (!isDragging) return;
const rect = canvas.getBoundingClientRect();
endX = Math.floor(e.clientX - rect.left);
endY = Math.floor(e.clientY - rect.top);
drawSelection();
});

canvas.addEventListener("mouseup", () => {
isDragging = false;

const x = Math.min(startX, endX);
const y = Math.min(startY, endY);
const w = Math.abs(endX - startX) + 1;
const h = Math.abs(endY - startY) + 1;

if (w === 1 && h === 1) {
alert(`Selected cell: (${x}, ${y})`);
} else {
alert(`Selected block: ${w} x ${h}`);
}

// mock acquisto
boughtCells.push({
x,
y,
w,
h,
color: "red"
});

drawBase();
});

// zoom
let scale = 1;
canvas.addEventListener("wheel", e => {
e.preventDefault();
scale += e.deltaY * -0.001;
scale = Math.min(Math.max(0.5, scale), 10);
canvas.style.transform = `scale(${scale})`;
});

// init
drawBase();