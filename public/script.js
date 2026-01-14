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

// ==================== Canvas Grid ====================
const GRID_SIZE = 1000;
const CELL_SIZE = 10;
const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

// Simulazione database delle celle occupate
let occupiedCells = {}; // key: "x_y", value: {text,color,link}

// Disegna griglia
function drawGrid() {
ctx.clearRect(0,0,canvas.width,canvas.height);
for (let key in occupiedCells) {
const [x,y] = key.split("_").map(Number);
ctx.fillStyle = occupiedCells[key].color;
ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
}

drawGrid();
updateCounter();

// ==================== Contatore ====================
function updateCounter() {
const occupied = Object.keys(occupiedCells).length;
const available = GRID_SIZE*GRID_SIZE - occupied;
document.getElementById("occupiedCounter").innerText = `Occupate: ${occupied}`;
document.getElementById("availableCounter").innerText = `Disponibili: ${available}`;
const status = document.getElementById("statusSquare");
status.style.backgroundColor = available>0?"green":"red";
}

// ==================== Popup & Click ====================
let selectedCell = null;
canvas.addEventListener("click",(e)=>{
const rect = canvas.getBoundingClientRect();
const x = Math.floor((e.clientX - rect.left)/CELL_SIZE);
const y = Math.floor((e.clientY - rect.top)/CELL_SIZE);
selectedCell = {x,y};
document.getElementById("popup").classList.remove("hidden");
const key = `${x}_${y}`;
if(occupiedCells[key]){
document.getElementById("cellText").value = occupiedCells[key].text;
document.getElementById("cellColor").value = occupiedCells[key].color;
document.getElementById("cellLink").value = occupiedCells[key].link;
}else{
document.getElementById("cellText").value = "";
document.getElementById("cellColor").value = "#ffffff";
document.getElementById("cellLink").value = "";
}
});

function closePopup(){
document.getElementById("popup").classList.add("hidden");
}

// Simula acquisto
document.getElementById("buyButton").addEventListener("click",()=>{
if(!selectedCell) return;
const key = `${selectedCell.x}_${selectedCell.y}`;
occupiedCells[key]={
text: document.getElementById("cellText").value,
color: document.getElementById("cellColor").value,
link: document.getElementById("cellLink").value
};
drawGrid();
updateCounter();
closePopup();
});

// ==================== Ricerca ====================
function searchCell(){
const query = document.getElementById("searchInput").value.trim().toLowerCase();
if(!query) return;

// Reset canvas highlight
drawGrid();

// Coordinate
const coordMatch = query.match(/^(\d+)[,_ ](\d+)$/);
if(coordMatch){
const x=parseInt(coordMatch[1]);
const y=parseInt(coordMatch[2]);
ctx.strokeStyle="yellow";
ctx.lineWidth=2;
ctx.strokeRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
canvas.scrollIntoView({behavior:"smooth"});
return;
}

// Nome/contenuto
for(let key in occupiedCells){
if(occupiedCells[key].text.toLowerCase().includes(query)){
const [x,y]=key.split("_").map(Number);
ctx.strokeStyle="yellow";
ctx.lineWidth=2;
ctx.strokeRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
}
}