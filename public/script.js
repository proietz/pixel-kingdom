const grid = document.getElementById("grid");

let isDragging = false;
let startBlock = null;
let selectedBlocks = [];

// crea 20.000 blocchi (200 x 100)
for (let i = 0; i < 20000; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;

block.addEventListener("mousedown", (e) => {
isDragging = true;
startBlock = block;
selectedBlocks = [block];
highlightBlocks(selectedBlocks);
});

block.addEventListener("mouseover", (e) => {
if (isDragging) {
const endBlock = block;
selectedBlocks = getBlocksInRectangle(startBlock, endBlock);
highlightBlocks(selectedBlocks);
}
});

block.addEventListener("mouseup", (e) => {
if (isDragging) {
isDragging = false;
openPurchasePopup(selectedBlocks);
}
});

grid.appendChild(block);
});

document.addEventListener("mouseup", () => {
isDragging = false;
});

// evidenzia i blocchi selezionati
function highlightBlocks(blocks) {
document.querySelectorAll(".block").forEach(b => b.classList.remove("highlight"));
blocks.forEach(b => b.classList.add("highlight"));
}

// ottieni tutti i blocchi dentro il rettangolo selezionato
function getBlocksInRectangle(start, end) {
const allBlocks = Array.from(document.querySelectorAll(".block"));
const startId = parseInt(start.dataset.id);
const endId = parseInt(end.dataset.id);

const startRow = Math.floor(startId / 200);
const startCol = startId % 200;
const endRow = Math.floor(endId / 200);
const endCol = endId % 200;

const minRow = Math.min(startRow, endRow);
const maxRow = Math.max(startRow, endRow);
const minCol = Math.min(startCol, endCol);
const maxCol = Math.max(startCol, endCol);

return allBlocks.filter(b => {
const id = parseInt(b.dataset.id);
const row = Math.floor(id / 200);
const col = id % 200;
return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
});
}

// popup acquisto blocchi
function openPurchasePopup(blocks) {
const totalBlocks = blocks.length;

const popup = document.createElement("div");
popup.id = "purchase-popup";
popup.innerHTML = `
<h3>Purchase Blocks</h3>
<p>Selected blocks: ${totalBlocks}</p>
<label>Title (required): <input type="text" id="block-title" placeholder="Example: My Art"></label><br>
<label>Image URL: <input type="text" id="block-image"></label><br>
<label>Text: <input type="text" id="block-text"></label><br>
<label>Link URL: <input type="text" id="block-link"></label><br>
<label>Color Pattern: <input type="color" id="block-color"></label><br>
<label><input type="checkbox" id="accept-terms"> I accept <a href="terms.html" target="_blank">Terms and Conditions</a></label><br><br>
<button id="buy-button">Buy</button>
<button id="cancel-button">Cancel</button>
`;
document.body.appendChild(popup);

document.getElementById("cancel-button").onclick = () => {
document.body.removeChild(popup);
};

document.getElementById("buy-button").onclick = () => {
const title = document.getElementById("block-title").value;
const image = document.getElementById("block-image").value;
const text = document.getElementById("block-text").value;
const link = document.getElementById("block-link").value;
const color = document.getElementById("block-color").value;
const accepted = document.getElementById("accept-terms").checked;

if (!title) {
alert("Title is required!");
return;
}

if (!accepted) {
alert("You must accept the Terms and Conditions!");
return;
}

// simulazione acquisto
blocks.forEach(b => {
b.style.background = color || "#ddd";
if (image) b.innerHTML = `<img src="${image}" title="${title}">`;
else if (text) b.textContent = text;
else if (link) b.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
});

document.body.removeChild(popup);
selectedBlocks = [];
};
}