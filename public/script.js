const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const wrapper = document.getElementById("canvas-wrapper");

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

// riempi canvas nero
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function updateTransform() {
  canvas.style.transform =
    `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// ZOOM CON ROTELLA
wrapper.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomFactor = 0.1;
  const direction = e.deltaY > 0 ? -1 : 1;

  const newScale = scale + direction * zoomFactor;
  if (newScale < 0.2 || newScale > 10) return;

  scale = newScale;
  updateTransform();
});

// PAN
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
