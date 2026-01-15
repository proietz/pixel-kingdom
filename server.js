const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const CELL_SIZE = 4;
const WIDTH = 2000;
const HEIGHT = 1000;
canvas.width = WIDTH * CELL_SIZE;
canvas.height = HEIGHT * CELL_SIZE;

// ========================== DATI ==========================
let occupied = {}; // "x,y": {color,title,text,link,image}
let selected = [];
let isDragging = false;
let dragStart = null;
let searchHighlighted = [];

// ========================= MULTILINGUA ====================
const languages = ["it","en","es","fr","de","pt","ru","ko","zh","ar","hi","pl","sv","no","fi","da","ja"];
const translations = {
it:{title:"Pixel Kingdom – 2.000.000 di celle • 1€ ciascuna", popup:"Acquista celle selezionate", buy:"Acquista", cancel:"Annulla", terms:"Termini e Condizioni", instr:"Come usare il sito", free:"Celle libere", used:"Celle occupate", selected:"Selezionate", search:"Parola chiave o coordinate X,Y", example:"Es. Foto Cane"},
en:{title:"Pixel Kingdom – 2,000,000 cells • €1 each", popup:"Buy selected cells", buy:"Buy", cancel:"Cancel", terms:"Terms & Conditions", instr:"How to use the site", free:"Free cells", used:"Occupied cells", selected:"Selected", search:"Keyword or coordinates X,Y", example:"Ex. Dog Photo"},
// altre lingue da aggiungere qui...
};

// ====================== RILEVAMENTO LINGUA AUTOMATICA =========
let userLang = navigator.language.slice(0,2);
if(!languages.includes(userLang)) userLang="en";
const langSelect = document.getElementById("languageSelect");
languages.forEach(l=>{ const o=document.createElement("option"); o.value=l; o.innerText=l; langSelect.appendChild(o); });
langSelect.value = userLang;
setLanguage(userLang);
langSelect.onchange=()=>{ setLanguage(langSelect.value); };

function setLanguage(lang){
const t=translations[lang];
document.getElementById("titleText").innerText=t.title;
document.getElementById("popupTitle").innerText=t.popup;
document.getElementById("buyBtn").innerText=t.buy;
document.getElementById("cancelBtn").innerText=t.cancel;
document.getElementById("termsLink").innerText=t.terms;
document.getElementById("instructionsLink").innerText=t.instr;
document.getElementById("freeLabel").innerText=t.free;
document.getElementById("usedLabel").innerText=t.used;
document.getElementById("selectedLabel").innerText=t.selected;
document.getElementById("searchInput").placeholder=t.search;
document.getElementById("cellTitleInput").placeholder=t.example;
}

// ====================== CELLE ===========================
function drawCell(x,y,color){ ctx.fillStyle=color; ctx.fillRect(x*CELL_SIZE,y*CELL_SIZE,CELL_SIZE,CELL_SIZE); }
function getCell(e){ return {x:Math.floor(e.offsetX/CELL_SIZE),y:Math.floor(e.offsetY/CELL_SIZE)}; }
function getSelection(a,b){
const cells=[]; const minX=Math.min(a.x,b.x), maxX=Math.max(a.x,b.x);
const minY=Math.min(a.y,b.y), maxY=Math.max(a.y,b.y);
for(let x=minX;x<=maxX;x++){ for(let y=minY;y<=maxY;y++){ cells.push({x,y}); } }
return cells;
}

// ==================== ZOOM ============================
let scale=1, originX=0, originY=0;
canvas.addEventListener("wheel", e=>{
e.preventDefault();
const mouseX=e.offsetX, mouseY=e.offsetY;
const delta=e.deltaY>0?0.9:1.1;
scale*=delta;
originX=mouseX-(mouseX-originX)*delta;
originY=mouseY-(mouseY-originY)*delta;
redraw();
});

// ==================== REDRAW ===========================
function redraw(){
ctx.setTransform(scale,0,0,scale,originX,originY);
ctx.clearRect(0,0,canvas.width,canvas.height);
Object.entries(occupied).forEach(([key,val])=>drawCell(val.x,val.y,val.color||"red"));
ctx.fillStyle="rgba(0,150,255,0.5)";
selected.forEach(c=>ctx.fillRect(c.x*CELL_SIZE,c.y*CELL_SIZE,CELL_SIZE,CELL_SIZE));
if(searchHighlighted.length>0){
ctx.strokeStyle="blue"; ctx.lineWidth=2;
searchHighlighted.forEach(c=>ctx.strokeRect(c.x*CELL_SIZE,c.y*CELL_SIZE,CELL_SIZE,CELL_SIZE));
}
document.getElementById("selectedCount").innerText=selected.length;
}

// ==================== DRAG & CLICK ======================
canvas.addEventListener("mousedown", e=>{ isDragging=true; selected=[]; dragStart=getCell(e); });
canvas.addEventListener("mousemove", e=>{ if(!isDragging) return; selected=getSelection(dragStart,getCell(e)); redraw(); });
canvas.addEventListener("mouseup", e=>{ isDragging=false; if(selected.length===0) selected=[getCell(e)]; if(selected.length>0) openPopup(); });

// ==================== POPUP ============================
const popup = document.getElementById("popup");
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.onclick=()=>{ popup.classList.add("hidden"); selected=[]; redraw(); };
function openPopup(){ popup.classList.remove("hidden"); }

// ==================== RICERCA ==========================
const searchInput=document.getElementById("searchInput");
const searchBtn=document.getElementById("searchBtn");
searchBtn.onclick=()=>{
const query=searchInput.value.trim(); if(!query)return;
searchHighlighted=[];
if(query.includes(",")){ const parts=query.split(","); if(parts.length===2){ const x=parseInt(parts[0]),y=parseInt(parts[1]); if(!isNaN(x)&&!isNaN(y)){ if(occupied[`${x},${y}`]) searchHighlighted.push({x,y}); } } }
else{ for(const key in occupied){ if(occupied[key].title && occupied[key].title.toLowerCase().includes(query.toLowerCase())){
const coords=key.split(","); searchHighlighted.push({x:parseInt(coords[0]),y:parseInt(coords[1])});
}}}
redraw();
};

// ==================== ANNO FOOTER =======================
document.getElementById("year").innerText=new Date().getFullYear();