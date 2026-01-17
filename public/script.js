const grid = document.getElementById("grid");

// crea 20.000 blocchi (200 x 100)
for (let i = 0; i < 20000; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;
block.onclick = () => {
window.location.href = `/buy.html?id=${i}`;
};
grid.appendChild(block);
}

// carica blocchi acquistati
fetch("/api/blocks")
.then(res => res.json())
.then(blocks => {
blocks.forEach(b => {
const el = document.querySelector(`.block[data-id="${b.id}"]`);
if (el) {
el.innerHTML = `<a href="${b.link}" target="_blank">
<img src="${b.image}" title="${b.title}">
</a>`;
}
});
});