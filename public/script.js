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
let dragStart = null;

/* CONTATORI */
const selectedCount = document.getElementById("selectedCount");

/* MULTILINGUA (ridotta qui per chiarezza) */
const translations = {
it: {
title: "Pixel Kingdom – 2.000.000 di celle • 1€ ciascuna",
popup: "Acquista celle selezionate",
buy: "Acquista",
cancel: "Annulla",
terms: "Termini e Condizioni",
accept: "Accetto i",
free: "Celle libere",
used: "Celle occupate"
},
en: {
title: "Pixel Kingdom – 2,000,000 cells • €1 each",
popup: "Buy selected cells",
buy: "Buy",
cancel: "Cancel",
terms: "Terms & Conditions",
accept: "I accept the",
free: "Free cells",
used: "Occupied cells"
}
};

const langSelect = document.getElementById("languageSelect");

function setLanguage(lang) {
const t = translations[lang];
document.getElementById("titleText").innerText = t.title;
document.getElementById("popupTitle").innerText = t.popup;
document.getElementById("buyBtn").innerText = t.buy;
document.getElementById("cancelBtn").innerText = t.cancel;
document.getElementById("footerTerms").innerText = t.terms;
document.getElementById("termsLink").innerText = t.terms;
document.getElementById("acceptTermsText").innerText = t.accept;
document.getElementById("freeLabel").innerText = t.free;
document.getElementById("usedLabel").innerText = t.used;
}

const savedLang = localStorage.getItem("lang") || "it";
langSelect.value = savedLang;
setLanguage(savedLang);
langSelect.onchange = () => {
localStorage.setItem("lang", langSelect.value);
setLanguage(langSelect.value);
};

/* CARICA CELLE */
fetch("/api/loadCells")
.then(r => r.json())
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

/* SELEZIONE */
canvas.addEventListener("mousedown", e => {
isDragging = true;
selected = [];
dragStart = getCell(e);
});

canvas.addEventListener("mousemove", e => {
if (!isDragging) return;
selected = getSelection(dragStart, getCell(e));
redrawSelection();
});

canvas.addEventListener("mouseup", e => {
isDragging = false;

if (selected.length === 0) {
const cell = getCell(e);
if (!occupied[`${cell.x},${cell.y}`]) {
selected = [cell];
}
}

if (selected.length > 0) openPopup();
});

function getCell(e) {
return {
x: Math.floor(e.offsetX / CELL_SIZE),
y: Math.floor(e.offsetY / CELL_SIZE)
};
}

function getSelection(a, b) {
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

/* EVIDENZIA SELEZIONE */
function redrawSelection() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

Object.values(occupied).forEach(c =>
drawCell(c.x, c.y, c.color)
);

ctx.fillStyle = "rgba(0,150,255,0.5)";
selected.forEach(c => {
ctx.fillRect(
c.x * CELL_SIZE,
c.y * CELL_SIZE,
CELL_SIZE,
CELL_SIZE
);
});

selectedCount.innerText = selected.length;
}

/* POPUP */
const popup = document.getElementById("popup");
const buyBtn = document.getElementById("buyBtn");
const cancelBtn = document.getElementById("cancelBtn");
const acceptTerms = document.getElementById("acceptTerms");

function openPopup() {
popup.classList.remove("hidden");
}

function closePopup() {
popup.classList.add("hidden");
selected = [];
selectedCount.innerText = "0";
}

cancelBtn.onclick = closePopup;

acceptTerms.onchange = () => {
buyBtn.disabled = !acceptTerms.checked;
};

buyBtn.onclick = () => {
alert(`Hai selezionato ${selected.length} celle`);
};

/* CONTATORI */
function updateCounters() {
document.getElementById("usedCount").innerText = Object.keys(occupied).length;
document.getElementById("freeCount").innerText = TOTAL - Object.keys(occupied).length;
}

document.getElementById("year").innerText = new Date().getFullYear();