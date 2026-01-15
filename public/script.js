// === Configurazioni iniziali ===
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

let gridWidth = 2000; // celle orizzontali
let gridHeight = 1000; // celle verticali
let cellSize = 5; // pixel per cella
canvas.width = gridWidth * cellSize;
canvas.height = gridHeight * cellSize;

let cells = []; // celle acquistate dal DB
let selectedCells = []; // celle selezionate in drag
let searchCells = []; // celle trovate con ricerca

let isDragging = false;
let dragStart = null;
let zoomLevel = 1;

// === Multilingua ===
const languages = {
it: { title: "Pixel Kingdom – 2.000.000 di celle • 1€ ciascuna", searchPlaceholder: "Parola chiave o coordinate X,Y", buyBtn: "Acquista", cancelBtn: "Annulla", freeLabel: "Celle libere", usedLabel: "Celle occupate", selectedLabel: "Selezionate", popupTitle: "Acquista celle selezionate", instructionsLink: "Come usare il sito", termsLink: "Termini e Condizioni" },
en: { title: "Pixel Kingdom – 2,000,000 cells • 1€ each", searchPlaceholder: "Keyword or X,Y coordinates", buyBtn: "Buy", cancelBtn: "Cancel", freeLabel: "Free cells", usedLabel: "Used cells", selectedLabel: "Selected", popupTitle: "Buy selected cells", instructionsLink: "Instructions", termsLink: "Terms & Conditions" },
fr: { title: "Pixel Kingdom – 2 000 000 cellules • 1€ chacune", searchPlaceholder: "Mot clé ou coordonnées X,Y", buyBtn: "Acheter", cancelBtn: "Annuler", freeLabel: "Cellules libres", usedLabel: "Cellules occupées", selectedLabel: "Sélectionnées", popupTitle: "Acheter les cellules sélectionnées", instructionsLink: "Instructions", termsLink: "Conditions" },
es: { title: "Pixel Kingdom – 2.000.000 celdas • 1€ cada una", searchPlaceholder: "Palabra clave o coordenadas X,Y", buyBtn: "Comprar", cancelBtn: "Cancelar", freeLabel: "Celdas libres", usedLabel: "Celdas ocupadas", selectedLabel: "Seleccionadas", popupTitle: "Comprar celdas seleccionadas", instructionsLink: "Instrucciones", termsLink: "Términos y condiciones" },
de: { title: "Pixel Kingdom – 2.000.000 Zellen • 1€ pro Zelle", searchPlaceholder: "Schlüsselwort oder X,Y Koordinaten", buyBtn: "Kaufen", cancelBtn: "Abbrechen", freeLabel: "Freie Zellen", usedLabel: "Besetzte Zellen", selectedLabel: "Ausgewählt", popupTitle: "Ausgewählte Zellen kaufen", instructionsLink: "Anleitung", termsLink: "AGB" },
ru: { title: "Pixel Kingdom – 2.000.000 клеток • 1€ каждая", searchPlaceholder: "Ключевое слово или координаты X,Y", buyBtn: "Купить", cancelBtn: "Отмена", freeLabel: "Свободные клетки", usedLabel: "Занятые клетки", selectedLabel: "Выбранные", popupTitle: "Купить выбранные клетки", instructionsLink: "Инструкция", termsLink: "Условия" },
ko: { title: "Pixel Kingdom – 2,000,000 칸 • 각 1€", searchPlaceholder: "키워드 또는 X,Y 좌표", buyBtn: "구매", cancelBtn: "취소", freeLabel: "빈 칸", usedLabel: "사용된 칸", selectedLabel: "선택됨", popupTitle: "선택한 칸 구매", instructionsLink: "사용법", termsLink: "약관" },
ja: { title: "Pixel Kingdom – 200万セル • 1€ずつ", searchPlaceholder: "キーワードまたはX,Y座標", buyBtn: "購入", cancelBtn: "キャンセル", freeLabel: "空きセル", usedLabel: "使用済みセル", selectedLabel: "選択済み", popupTitle: "選択したセルを購入", instructionsLink: "使い方", termsLink: "利用規約" },
zh: { title: "Pixel Kingdom – 200万格子 • 每格1€", searchPlaceholder: "关键词或X,Y坐标", buyBtn: "购买", cancelBtn: "取消", freeLabel: "空格子", usedLabel: "已占用格子", selectedLabel: "已选择", popupTitle: "购买已选择的格子", instructionsLink: "使用说明", termsLink: "条款" },
ar: { title: "Pixel Kingdom – 2,000,000 خلية • 1€ لكل خلية", searchPlaceholder: "كلمة مفتاحية أو إحداثيات X,Y", buyBtn: "شراء", cancelBtn: "إلغاء", freeLabel: "الخلايا الحرة", usedLabel: "الخلايا المستخدمة", selectedLabel: "المختارة", popupTitle: "شراء الخلايا المختارة", instructionsLink: "كيفية الاستخدام", termsLink: "الشروط" },
hi: { title: "Pixel Kingdom – 2,000,000 सेल्स • 1€ प्रत्येक", searchPlaceholder: "कीवर्ड या X,Y निर्देशांक", buyBtn: "खरीदें", cancelBtn: "रद्द करें", freeLabel: "खाली सेल्स", usedLabel: "भरी हुई सेल्स", selectedLabel: "चयनित", popupTitle: "चयनित सेल्स खरीदें", instructionsLink: "कैसे उपयोग करें", termsLink: "नियम" },
pl: { title: "Pixel Kingdom – 2 000 000 komórek • 1€ każda", searchPlaceholder: "Słowo kluczowe lub współrzędne X,Y", buyBtn: "Kup", cancelBtn: "Anuluj", freeLabel: "Wolne komórki", usedLabel: "Zajęte komórki", selectedLabel: "Wybrane", popupTitle: "Kup wybrane komórki", instructionsLink: "Instrukcja", termsLink: "Warunki" },
sv: { title: "Pixel Kingdom – 2.000.000 celler • 1€ styck", searchPlaceholder: "Nyckelord eller X,Y koordinater", buyBtn: "Köp", cancelBtn: "Avbryt", freeLabel: "Lediga celler", usedLabel: "Upptagna celler", selectedLabel: "Valda", popupTitle: "Köp valda celler", instructionsLink: "Instruktioner", termsLink: "Villkor" },
no: { title: "Pixel Kingdom – 2.000.000 celler • 1€ per celle", searchPlaceholder: "Søkeord eller X,Y koordinater", buyBtn: "Kjøp", cancelBtn: "Avbryt", freeLabel: "Ledige celler", usedLabel: "Opptatte celler", selectedLabel: "Valgte", popupTitle: "Kjøp valgte celler", instructionsLink: "Instruksjoner", termsLink: "Vilkår" },
da: { title: "Pixel Kingdom – 2.000.000 celler • 1€ pr celle", searchPlaceholder: "Søgeord eller X,Y koordinater", buyBtn: "Køb", cancelBtn: "Annuller", freeLabel: "Ledige celler", usedLabel: "Optagne celler", selectedLabel: "Valgte", popupTitle: "Køb valgte celler", instructionsLink: "Instruktioner", termsLink: "Vilkår" }
};

let currentLang = "it";

// Imposta lingua automatica in base alla regione
const userLang = navigator.language.slice(0,2);
if(languages[userLang]) currentLang = userLang; else currentLang = "en";

// Aggiorna testi
function updateLanguage(){
const lang = languages[currentLang];
document.getElementById("titleText").textContent = lang.title;
document.getElementById("searchInput").placeholder = lang.searchPlaceholder;
document.getElementById("buyBtn")?.textContent = lang.buyBtn;
document.getElementById("cancelBtn")?.textContent = lang.cancelBtn;
document.getElementById("freeLabel").textContent = lang.freeLabel;
document.getElementById("usedLabel").textContent = lang.usedLabel;
document.getElementById("selectedLabel").textContent = lang.selectedLabel;
document.getElementById("termsLink").textContent = lang.termsLink;
document.getElementById("instructionsLink").textContent = lang.instructionsLink;
}

updateLanguage();

// Popola selezione lingue
const langSelect = document.getElementById("languageSelect");
for(const code in languages){
const opt = document.createElement("option");
opt.value = code;
opt.textContent = code.toUpperCase();
if(code===currentLang) opt.selected=true;
langSelect.appendChild(opt);
}
langSelect.addEventListener("change",(e)=>{ currentLang=e.target.value; updateLanguage(); });

// === Funzioni canvas e celle ===
let offsetX=0, offsetY=0;
let isMouseDown=false;
let startCell=null;

function drawGrid(){
ctx.clearRect(0,0,canvas.width,canvas.height);
// Celle acquistate
cells.forEach(c=>{
ctx.fillStyle=c.color || "#ff0000";
ctx.fillRect(c.x*cellSize, c.y*cellSize, cellSize, cellSize);
});
// Celle selezionate
selectedCells.forEach(c=>{
ctx.fillStyle="rgba(0,0,255,0.3)";
ctx.fillRect(c.x*cellSize, c.y*cellSize, cellSize, cellSize);
});
// Celle in ricerca
searchCells.forEach(c=>{
ctx.strokeStyle="blue";
ctx.lineWidth=1;
ctx.strokeRect(c.x*cellSize, c.y*cellSize, cellSize, cellSize);
});
}

function canvasCoords(e){
const rect = canvas.getBoundingClientRect();
return {
x: Math.floor((e.clientX-rect.left)/cellSize),
y: Math.floor((e.clientY-rect.top)/cellSize)
}
}

// Drag & click
canvas.addEventListener("mousedown",(e)=>{
isMouseDown=true;
const pos=canvasCoords(e);
startCell={x:pos.x, y:pos.y};
selectedCells=[pos];
updateSelectedCount();
drawGrid();
});
canvas.addEventListener("mousemove",(e)=>{
if(!isMouseDown) return;
const pos=canvasCoords(e);
selectedCells=[];
const x1=Math.min(startCell.x,pos.x), x2=Math.max(startCell.x,pos.x);
const y1=Math.min(startCell.y,pos.y), y2=Math.max(startCell.y,pos.y);
for(let i=x1;i<=x2;i++){
for(let j=y1;j<=y2;j++){
selectedCells.push({x:i,y:j});
}
}
updateSelectedCount();
drawGrid();
});
canvas.addEventListener("mouseup",(e)=>{
isMouseDown=false;
showPopup();
});

// Aggiorna contatori
function updateSelectedCount(){ document.getElementById("selectedCount").textContent=selectedCells.length; }
function updateFreeUsed(){
const free=gridWidth*gridHeight-cells.length;
document.getElementById("freeCount").textContent=free;
document.getElementById("usedCount").textContent=cells.length;
}

// === Popup acquisto ===
const popup=document.getElementById("popup");
const buyBtn=document.getElementById("buyBtn");
const cancelBtn=document.getElementById("cancelBtn");

function showPopup(){ popup.classList.remove("hidden"); }
cancelBtn.addEventListener("click",()=>{ popup.classList.add("hidden"); selectedCells=[]; drawGrid(); updateSelectedCount(); });

// Compra celle
buyBtn.addEventListener("click", async ()=>{
const title=document.getElementById("cellTitleInput").value;
if(!title) return alert("Titolo obbligatorio!");
const color=document.getElementById("cellColorInput").value;
const text=document.getElementById("cellTextInput").value;
const link=document.getElementById("cellLinkInput").value;
const image=document.getElementById("cellImageInput").value;

const payload=selectedCells.map(c=>({x:c.x,y:c.y,title,text,color,link,image}));
const res=await fetch("/api/buyCell",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cells:payload})});
const data=await res.json();
if(data.success){
alert(`Acquisto completato! Coordinate: ${selectedCells.map(c=>`(${c.x},${c.y})`).join(", ")} Titolo: ${title}`);
selectedCells=[]; popup.classList.add("hidden");
loadCells();
} else alert("Errore: "+data.message);
});

// === Carica celle dal server ===
async function loadCells(){
const res=await fetch("/api/loadCells");
const data=await res.json();
cells=data;
updateFreeUsed();
drawGrid();
}
loadCells();

// === Ricerca celle ===
document.getElementById("searchBtn").addEventListener("click",()=>{
const val=document.getElementById("searchInput").value.trim();
if(!val){ searchCells=[]; drawGrid(); return; }
searchCells=cells.filter(c=> c.title.includes(val) || `${c.x},${c.y}`===val);
drawGrid();
});

// === Zoom dinamico ===
canvas.addEventListener("wheel",(e)=>{
e.preventDefault();
if(e.deltaY<0) zoomLevel*=1.1; else zoomLevel/=1.1;
canvas.style.transform=`scale(${zoomLevel})`;
});