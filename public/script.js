const translations = {
it: { title: "Pixel Kingdom", buy: "Acquista Cella", language: "Lingua", popup: "Acquista Cella", info: "1 milione di celle — 1€ per cella" },
en: { title: "Pixel Kingdom", buy: "Buy Cell", language: "Language", popup: "Buy Cell", info: "1 million cells — 1$ per cell" },
es: { title: "Reino Pixel", buy: "Comprar Celda", language: "Idioma", popup: "Comprar Celda", info: "1 millón de celdas — 1$ por celda" },
fr: { title: "Royaume Pixel", buy: "Acheter Case", language: "Langue", popup: "Acheter Case", info: "1 million de cases — 1$ par case" },
de: { title: "Pixel Königreich", buy: "Zelle Kaufen", language: "Sprache", popup: "Zelle Kaufen", info: "1 Million Zellen — 1$ pro Zelle" },
zh: { title: "像素王国", buy: "购买格子", language: "语言", popup: "购买格子", info: "100万格子 — 每格1美元" },
ru: { title: "Пиксельное Королевство", buy: "Купить ячейку", language: "Язык", popup: "Купить ячейку", info: "1 миллион ячеек — 1$ за ячейку" },
ko: { title: "픽셀 왕국", buy: "셀 구매", language: "언어", popup: "셀 구매", info: "100만 셀 — 셀당 1달러" }
};

let currentLang = "it";
function changeLanguage(lang) {
currentLang = lang;
document.getElementById("title").innerText = translations[lang].title;
document.getElementById("buyButton").innerText = translations[lang].buy;
document.getElementById("langLabel").innerText = translations[lang].language;
document.getElementById("popupTitle").innerText = translations[lang].popup;
document.getElementById("infoText").innerText = translations[lang].info;
}

// ==================== Gestione griglia ====================
const GRID_SIZE = 1000;
const visibleRows = 50; // visualizza 50 righe alla volta per virtualizzazione
const gridContainer = document.querySelector(".grid-container");
const grid = document.getElementById("grid");

// Simulazione database delle celle occupate
let occupiedCells = {}; // key: "x_y", value: {text,color,link}

// Funzione per aggiornare contatore
function updateCounter() {
const occupied = Object.keys(occupiedCells).length;
const available = GRID_SIZE * GRID_SIZE - occupied;
document.getElementById("occupiedCounter").innerText = `Occupate: ${occupied}`;
document.getElementById("availableCounter").innerText = `Disponibili: ${available}`;
const status = document.getElementById("statusSquare");
status.style.backgroundColor = available > 0 ? "green" : "red";
}

// Crea celle virtuali visibili solo quelle necessarie
function renderGrid() {
grid.innerHTML = "";
const fragment = document.createDocumentFragment();
for (let row = 0; row < GRID_SIZE; row++) {
for (let col = 0; col < GRID_SIZE; col++) {
const key = `${col}_${row}`;
const cell = document.createElement("div");
cell.classList.add("cell");
cell.dataset.x = col;
cell.dataset.y = row;
if (occupiedCells[key]) cell.style.background = occupiedCells[key].color;
cell.addEventListener("click", () => openPopup(cell));
fragment.appendChild(cell);
}
}
grid.appendChild(fragment);
}

renderGrid();
updateCounter();

// ==================== Popup acquisto ====================
let selectedCell = null;
function openPopup(cell) {
selectedCell = cell;
document.getElementById("popup").classList.remove("hidden");
const key = `${cell.dataset.x}_${cell.dataset.y}`;
if (occupiedCells[key]) {
document.getElementById("cellText").value = occupiedCells[key].text;
document.getElementById("cellColor").value = occupiedCells[key].color;
document.getElementById("cellLink").value = occupiedCells[key].link;
} else {
document.getElementById("cellText").value = "";
document.getElementById("cellColor").value = "#ffffff";
document.getElementById("cellLink").value = "";
}
}

function closePopup() {
document.getElementById("popup").classList.add("hidden");
}

// Simula acquisto
document.getElementById("buyButton").addEventListener("click", () => {
if (!selectedCell) return;
const x = selectedCell.dataset.x;
const y = selectedCell.dataset.y;
const key = `${x}_${y}`;
occupiedCells[key] = {
text: document.getElementById("cellText").value,
color: document.getElementById("cellColor").value,
link: document.getElementById("cellLink").value
};
selectedCell.style.background = occupiedCells[key].color;
updateCounter();
closePopup();
});

// ==================== Ricerca ====================
function searchCell() {
const query = document.getElementById("searchInput").value.trim().toLowerCase();
if (!query) return;
// reset highlight
document.querySelectorAll(".cell").forEach(c => c.classList.remove("highlight"));

// Ricerca coordinate
const coordMatch = query.match(/^(\d+)[,_ ](\d+)$/);
if (coordMatch) {
const x = parseInt(coordMatch[1]);
const y = parseInt(coordMatch[2]);
const key = `${x}_${y}`;
const cell = [...document.querySelectorAll(".cell")].find(c => c.dataset.x==x && c.dataset.y==y);
if (cell) {
cell.classList.add("highlight");
cell.scrollIntoView({behavior:"smooth",block:"center"});
}
return;
}

// Ricerca per nome/contenuto
for (let key in occupiedCells) {
if (occupiedCells[key].text.toLowerCase().includes(query)) {
const [x,y] = key.split("_");
const cell = [...document.querySelectorAll(".cell")].find(c => c.dataset.x==x && c.dataset.y==y);
if (cell) {
cell.classList.add("highlight");
}
}
}
}