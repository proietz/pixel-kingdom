const grid = document.getElementById("grid");

let isMouseDown = false;
let startId = null;
let selectedBlocks = [];

// Crea 2000x1000 blocchi (2000x1000 div = 2.000.000 px, adattato in blocchi 10x10)
for (let i = 0; i < 20000; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;

block.addEventListener("mousedown", (e) => {
e.preventDefault();
isMouseDown = true;
startId = i;
selectedBlocks = [i];
highlightSelected();
});

block.addEventListener("mouseover", (e) => {
if (!isMouseDown) return;
const currentId = i;
selectedBlocks = getRangeIds(startId, currentId);
highlightSelected();
});

block.addEventListener("mouseup", (e) => {
isMouseDown = false;
if (selectedBlocks.length === 0) selectedBlocks = [i];
// Apri la pagina di acquisto con parametri
const firstId = selectedBlocks[0];
const total = selectedBlocks.length;
window.location.href = `/buy.html?id=${firstId}&total=${total}`;
});

grid.appendChild(block);
}

// Funzione per calcolare intervallo blocchi tra due id
function getRangeIds(start, end) {
const range = [];
const min = Math.min(start, end);
const max = Math.max(start, end);
for (let i = min; i <= max; i++) {
range.push(i);
}
return range;
}

// Evidenzia selezione (solo bordo arancione)
function highlightSelected() {
document.querySelectorAll(".block").forEach(b => {
b.style.border = "1px solid #ddd"; // reset
});
selectedBlocks.forEach(id => {
const el = document.querySelector(`.block[data-id="${id}"]`);
if (el) el.style.border = "2px solid orange";
});
}

// Carica blocchi acquistati
fetch("/api/blocks")
.then(res => res.json())
.then(blocks => {
blocks.forEach(b => {
const el = document.querySelector(`.block[data-id="${b.id}"]`);
if (el) {
el.innerHTML = `<a href="${b.link}" target="_blank">
<img src="${b.image}" title="${b.title}">
</a>`;
el.style.border = "1px solid #000"; // blocco acquistato nero
}
});
});