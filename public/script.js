const grid = document.getElementById("grid");
const TOTAL_BLOCKS = 20000; // 200x100

// crea la griglia
for (let i = 0; i < TOTAL_BLOCKS; i++) {
const block = document.createElement("div");
block.className = "block";
block.dataset.id = i;
block.onclick = () => {
// apri pagina di acquisto per questo blocco
window.location.href = `/buy.html?id=${i}`;
};
grid.appendChild(block);
}

// crea contatori (liberi / occupati)
const counterContainer = document.createElement("div");
counterContainer.style.margin = "10px 0";
counterContainer.innerHTML = `
<span id="blocks-occupied">Occupied: 0</span> |
<span id="blocks-free">Free: ${TOTAL_BLOCKS}</span>
`;
document.body.insertBefore(counterContainer, grid);

// funzione per aggiornare contatore
function updateCounters() {
fetch("/api/blocks")
.then(res => res.json())
.then(blocks => {
const occupied = blocks.length;
const free = TOTAL_BLOCKS - occupied;
document.getElementById("blocks-occupied").innerText = `Occupied: ${occupied}`;
document.getElementById("blocks-free").innerText = `Free: ${free}`;
});
}

// aggiorna al caricamento pagina
updateCounters();

// aggiorna periodicamente ogni 5 secondi (opzionale)
setInterval(updateCounters, 5000);

// carica blocchi acquistati e mostra immagini/link
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