const grid = document.getElementById("grid");

let isDragging = false;
let startBlockId = null;
let selectedBlocks = new Set();

// crea 20.000 blocchi (200 x 100)
for (let i = 0; i < 20000; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;

// click singolo o start trascinamento
block.addEventListener("mousedown", () => {
isDragging = true;
startBlockId = i;
selectedBlocks = new Set([i]);
highlightSelection();
});

block.addEventListener("mouseenter", () => {
if (isDragging) {
const currentId = i;
const minId = Math.min(startBlockId, currentId);
const maxId = Math.max(startBlockId, currentId);
selectedBlocks = new Set();
for (let id = minId; id <= maxId; id++) {
selectedBlocks.add(id);
}
highlightSelection();
}
});

block.addEventListener("mouseup", () => {
isDragging = false;
const ids = Array.from(selectedBlocks);
const totalBlocks = ids.length;
window.location.href = `/buy.html?id=${ids[0]}&count=${totalBlocks}`;
});

grid.appendChild(block);
}

document.addEventListener("mouseup", () => {
isDragging = false;
});

function highlightSelection() {
document.querySelectorAll(".block").forEach(b => {
if (selectedBlocks.has(Number(b.dataset.id))) {
b.style.border = "2px solid blue"; // evidenziato
} else {
b.style.border = "1px solid #ddd"; // normale
}
});
}

// carica blocchi acquistati
fetch("/api/blocks")
.then(res => res.json())
.then(blocks => {
blocks.forEach(b => {
const el = document.querySelector(`.block[data-id="${b.id}"]`);
if (el) {
el.innerHTML = `<a href="${b.link}" target="_blank">
<img src="${b.image}" title="${b.title}">
</a>`;
}
});
});