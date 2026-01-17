let isDragging = false;
let startBlock = null;
let selectedBlocks = [];
const grid = document.getElementById("grid");

// crea 20.000 blocchi (200 x 100)
for (let i = 0; i < 20000; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;
block.addEventListener("mousedown", () => {
isDragging = true;
startBlock = block;
selectedBlocks = [block];
highlightBlocks(selectedBlocks);
});

block.addEventListener("mouseover", () => {
if (isDragging) {
const endBlock = block;
selectedBlocks = getBlocksInRectangle(startBlock, endBlock);
highlightBlocks(selectedBlocks);
}
});

block.addEventListener("mouseup", () => {
if (isDragging) {
isDragging = false;
openPurchasePopup(selectedBlocks);
}
});
grid.appendChild(block);
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
function highlightBlocks(blocks) {
document.querySelectorAll(".block").forEach(b => b.classList.remove("highlight"));
blocks.forEach(b => b.classList.add("highlight"));
}

function getBlocksInRectangle(start, end) {
const allBlocks = Array.from(document.querySelectorAll(".block"));
const startId = parseInt(start.dataset.id);
const endId = parseInt(end.dataset.id);

const startRow = Math.floor(startId / 200);
const startCol = startId % 200;
const endRow = Math.floor(endId / 200);
const endCol = endId % 200;

const minRow = Math.min(startRow, endRow);
const maxRow = Math.max(startRow, endRow);
const minCol = Math.min(startCol, endCol);
const maxCol = Math.max(startCol, endCol);

return allBlocks.filter(b => {
const id = parseInt(b.dataset.id);
const row = Math.floor(id / 200);
const col = id % 200;
return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
});
}