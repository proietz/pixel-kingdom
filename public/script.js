// Traduzioni multilingua
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

// Popup simulato per acquisto
let selectedCell = null;
function openPopup(cell) {
selectedCell = cell;
document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
document.getElementById("popup").classList.add("hidden");
}

// Griglia 1000x1000
const grid = document.getElementById("grid");
for (let i = 0; i < 1000000; i++) {
const cell = document.createElement("div");
cell.classList.add("cell");
cell.addEventListener("click", () => openPopup(cell));
grid.appendChild(cell);
}