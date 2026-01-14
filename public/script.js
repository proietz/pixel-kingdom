// Traduzioni multilingua
const translations = {
it: { title: "Pixel Kingdom", buy: "Acquista Cella", language: "Lingua", popup: "Acquista Cella" },
en: { title: "Pixel Kingdom", buy: "Buy Cell", language: "Language", popup: "Buy Cell" },
es: { title: "Reino Pixel", buy: "Comprar Celda", language: "Idioma", popup: "Comprar Celda" },
fr: { title: "Royaume Pixel", buy: "Acheter Case", language: "Langue", popup: "Acheter Case" },
de: { title: "Pixel Königreich", buy: "Zelle Kaufen", language: "Sprache", popup: "Zelle Kaufen" },
zh: { title: "像素王国", buy: "购买格子", language: "语言", popup: "购买格子" },
ru: { title: "Пиксельное Королевство", buy: "Купить ячейку", language: "Язык", popup: "Купить ячейку" },
ko: { title: "픽셀 왕국", buy: "셀 구매", language: "언어", popup: "셀 구매" }
};

let currentLang = "it";

function changeLanguage(lang) {
currentLang = lang;
document.getElementById("title").innerText = translations[lang].title;
document.getElementById("buyButton").innerText = translations[lang].buy;
document.getElementById("langLabel").innerText = translations[lang].language;
document.getElementById("popupTitle").innerText = translations[lang].popup;
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