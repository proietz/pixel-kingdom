const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const cellSize = 10;
const rows = 1415;
const cols = 1415;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

// Celle inizialmente tutte null
let cells = Array.from({length: rows}, () => Array(cols).fill(null));

let selecting = false;
let startX = 0, startY = 0;
let selectedCells = [];

let currentLang = 'en'; // default inglese

const languages = {
en: {buyPopupTitle:"Buy selected cells"},
it: {buyPopupTitle:"Acquista celle selezionate"},
fr: {buyPopupTitle:"Acheter les cellules"},
es: {buyPopupTitle:"Comprar celdas"},
de: {buyPopupTitle:"Zellen kaufen"},
ru: {buyPopupTitle:"Купить выбранные клетки"},
ko: {buyPopupTitle:"선택한 셀 구매"},
ja: {buyPopupTitle:"選択したセルを購入"},
zh: {buyPopupTitle:"购买所选单元格"},
ar: {buyPopupTitle:"شراء الخلايا المحددة"},
hi: {buyPopupTitle:"चयनित कोशिकाएँ खरीदें"},
pl: {buyPopupTitle:"Kup wybrane komórki"},
sv: {buyPopupTitle:"Köp valda celler"},
no: {buyPopupTitle:"Kjøp valgte celler"},
da: {buyPopupTitle:"Køb valgte celler"}
};

// Zoom canvas
let scale = 1;
canvas.addEventListener("wheel", e=>{
e.preventDefault();
scale += e.deltaY * -0.001;
scale = Math.min(Math.max(0.1, scale), 10);
canvas.style.transform = `scale(${scale})`;
});

function drawGrid(){
ctx.clearRect(0,0,canvas.width,canvas.height);
for(let r=0;r<rows;r++){
for(let c=0;c<cols;c++){
const cell = cells[r][c];
if(cell){
ctx.fillStyle = cell.color || "#fff";
ctx.fillRect(c*cellSize,r*cellSize,cellSize,cellSize);
}
ctx.strokeStyle = "#333";
ctx.strokeRect(c*cellSize,r*cellSize,cellSize,cellSize);
}
}
}
drawGrid();

function updateCounters(){
let free=0, used=0;
for(let r=0;r<rows;r++){
for(let c=0;c<cols;c++){
if(cells[r][c]) used++; else free++;
}
}
document.getElementById("freeCount").textContent=free;
document.getElementById("usedCount").textContent=used;
document.getElementById("selectedCount").textContent=selectedCells.length;
}

// Selezione click/drag
canvas.addEventListener("mousedown", e=>{
selecting=true;
const rect = canvas.getBoundingClientRect();
startX = Math.floor((e.clientX-rect.left)/cellSize);
startY = Math.floor((e.clientY-rect.top)/cellSize);
selectedCells = [];
});

canvas.addEventListener("mousemove", e=>{
if(!selecting) return;
const rect = canvas.getBoundingClientRect();
const x = Math.floor((e.clientX-rect.left)/cellSize);
const y = Math.floor((e.clientY-rect.top)/cellSize);
selectedCells = [];
const minX = Math.min(startX,x);
const maxX = Math.max(startX,x);
const minY = Math.min(startY,y);
const maxY = Math.max(startY,y);
for(let r=minY;r<=maxY;r++){
for(let c=minX;c<=maxX;c++){
selectedCells.push([r,c]);
}
}
drawGrid();
highlightSelected();
updateCounters();
});

canvas.addEventListener("mouseup", e=>{
selecting=false;
if(selectedCells.length>0){
openPopup();
}
});

function highlightSelected(){
ctx.strokeStyle = "yellow";
selectedCells.forEach(([r,c])=>{
ctx.strokeRect(c*cellSize,r*cellSize,cellSize,cellSize);
});
}

// Popup acquisto
const popup = document.getElementById("popup");
const buyBtn = document.getElementById("buyBtn");
const cancelBtn = document.getElementById("cancelBtn");

function openPopup(){
popup.style.display="block";
document.getElementById("popupTitle").textContent = languages[currentLang].buyPopupTitle;
}

cancelBtn.addEventListener("click", ()=>{ popup.style.display="none"; });

buyBtn.addEventListener("click", ()=>{
const title = document.getElementById("cellTitleInput").value.trim();
const text = document.getElementById("cellTextInput").value;
const color = document.getElementById("cellColorInput").value;
const link = document.getElementById("cellLinkInput").value;
const img = document.getElementById("cellImageInput").value;

if(!title){ alert("Insert a title"); return; }

selectedCells.forEach(([r,c])=>{
cells[r][c] = {title,text,color,link,img};
});

alert(`Purchase completed!\nTitle: ${title}\nCells: ${selectedCells.length}`);
popup.style.display="none";
selectedCells = [];
drawGrid();
updateCounters();
});

// Ricerca
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", ()=>{
const query = document.getElementById("searchInput").value.trim().toLowerCase();
if(!query) return;
drawGrid();
let found = [];
for(let r=0;r<rows;r++){
for(let c=0;c<cols;c++){
const cell = cells[r][c];
if(cell && (cell.title.toLowerCase().includes(query) || `${r},${c}`===query)){
found.push([r,c]);
}
}
}
found.forEach(([r,c])=>{
ctx.strokeStyle = "blue";
ctx.lineWidth=2;
ctx.strokeRect(c*cellSize,r*cellSize,cellSize,cellSize);
});
});

// Cambia lingua dal menu
document.getElementById("langSelect").addEventListener("change", e=>{
currentLang = e.target.value;
document.getElementById("popupTitle").textContent = languages[currentLang].buyPopupTitle;
});