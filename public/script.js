const grid = document.getElementById("grid");

let isDragging = false;
let startBlock = null;
let selectedBlocks = [];

// crea 2000x1000 blocchi da 10x10 (200x100 blocchi)
for (let i = 0; i < 20000; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;

// click singolo
block.addEventListener("click", (e) => {
if (!isDragging) {
window.location.href = `/buy.html?ids=${block.dataset.id}&total=1`;
}
});

// mousedown per iniziare il drag
block.addEventListener("mousedown", (e) => {
isDragging = true;
startBlock = block;
selectedBlocks = [block.dataset.id];
highlightSelectedBlocks();
updateCounter(e); // mostra contatore
counter.style.display = "block";
e.preventDefault();
});

// mouseover durante il drag
block.addEventListener("mouseover", (e) => {
if (isDragging && startBlock) {
const startIndex = parseInt(startBlock.dataset.id);
const currentIndex = parseInt(block.dataset.id);

const startRow = Math.floor(startIndex / 200);
const startCol = startIndex % 200;
const currentRow = Math.floor(currentIndex / 200);
const currentCol = currentIndex % 200;

const minRow = Math.min(startRow, currentRow);
const maxRow = Math.max(startRow, currentRow);
const minCol = Math.min(startCol, currentCol);
const maxCol = Math.max(startCol, currentCol);

selectedBlocks = [];
for (let r = minRow; r <= maxRow; r++) {
for (let c = minCol; c <= maxCol; c++) {
selectedBlocks.push(r * 200 + c);
}
}

highlightSelectedBlocks();
}
});

grid.appendChild(block);
});

// contatore dinamico dei blocchi selezionati
const counter = document.createElement("div");
counter.id = "blockCounter";
counter.style.position = "fixed";
counter.style.pointerEvents = "none";
counter.style.background = "#000";
counter.style.color = "#fff";
counter.style.padding = "4px 8px";
counter.style.borderRadius = "4px";
counter.style.fontSize = "12px";
counter.style.display = "none";
document.body.appendChild(counter);

function updateCounter(e) {
counter.textContent = `${selectedBlocks.length} blocks selected`;
counter.style.left = e.pageX + 15 + "px";
counter.style.top = e.pageY + 15 + "px";
}

// mousemove per aggiornare la posizione del contatore
document.addEventListener("mousemove", (e) => {
if (isDragging) {
updateCounter(e);
}
});

// mouseup per terminare il drag
document.addEventListener("mouseup", () => {
if (isDragging && selectedBlocks.length > 0) {
const total = selectedBlocks.length;
const ids = selectedBlocks.join(",");
window.location.href = `/buy.html?ids=${ids}&total=${total}`;
}
isDragging = false;
startBlock = null;
selectedBlocks = [];
clearHighlights();
counter.style.display = "none"; // nasconde contatore
});

// funzione per evidenziare blocchi selezionati
function highlightSelectedBlocks() {
document.querySelectorAll(".block").forEach(b => {
if (selectedBlocks.includes(parseInt(b.dataset.id))) {
b.style.backgroundColor = "#aaf"; // colore evidenziazione
} else {
b.style.backgroundColor = "";
}
});
}

// funzione per rimuovere evidenziazioni
function clearHighlights() {
document.querySelectorAll(".block").forEach(b => {
b.style.backgroundColor = "";
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