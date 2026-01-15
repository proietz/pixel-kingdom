const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const wrapper = document.getElementById("canvas-wrapper");

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

// popup
const popup = document.getElementById("purchasePopup");
const purchaseCancel = document.getElementById("purchaseCancel");
const purchaseConfirm = document.getElementById("purchaseConfirm");

// inizializza canvas nero
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function updateTransform() {
canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// zoom con rotella
wrapper.addEventListener("wheel", (e) => {
e.preventDefault();
const zoomFactor = 0.1;
const direction = e.deltaY > 0 ? -1 : 1;

const newScale = scale + direction * zoomFactor;
if (newScale < 0.2 || newScale > 10) return;
scale = newScale;
updateTransform();
});

// pan
wrapper.addEventListener("mousedown", (e) => {
isDragging = true;
startX = e.clientX - offsetX;
startY = e.clientY - offsetY;
wrapper.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
isDragging = false;
wrapper.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
if (!isDragging) return;
offsetX = e.clientX - startX;
offsetY = e.clientY - startY;
updateTransform();
});

// click su canvas per popup
canvas.addEventListener("click", (e) => {
popup.classList.remove("hidden");
});

// chiudi popup
purchaseCancel.addEventListener("click", () => {
popup.classList.add("hidden");
});

// conferma acquisto (solo demo)
purchaseConfirm.addEventListener("click", () => {
alert("Cell purchase confirmed!\nYou chose: \n" +
"Title: " + document.getElementById("cellTitle").value + "\n" +
"Color: " + document.getElementById("cellColor").value + "\n" +
"Text: " + document.getElementById("cellText").value + "\n" +
"Image: " + document.getElementById("cellImage").value + "\n" +
"Link: " + document.getElementById("cellLink").value);
popup.classList.add("hidden");
});