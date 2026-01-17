const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Database SQLite
const db = new sqlite3.Database("./pixelkingdom.db");

db.serialize(() => {
db.run(`
CREATE TABLE IF NOT EXISTS blocks (
id INTEGER PRIMARY KEY,
image TEXT,
link TEXT,
title TEXT
)
`);
});

// carica tutti i blocchi acquistati
app.get("/api/blocks", (req, res) => {
db.all("SELECT * FROM blocks", [], (err, rows) => {
if (err) {
return res.status(500).json({ error: err.message });
}
res.json(rows || []);
});
});

// acquisto blocchi (singolo o multiplo)
app.post("/api/buy", (req, res) => {
const { id, count, title, image, link } = req.body;

if (!id || !count || !title) {
return res.status(400).json({ error: "Missing required data" });
}

const idsToInsert = [];
for (let i = 0; i < count; i++) {
idsToInsert.push(Number(id) + i); // blocchi consecutivi
}

const stmt = db.prepare("INSERT OR IGNORE INTO blocks (id, image, link, title) VALUES (?, ?, ?, ?)");

idsToInsert.forEach(blockId => {
stmt.run(blockId, image || '', link || '', title);
});

stmt.finalize(err => {
if (err) {
return res.status(500).json({ error: err.message });
}
res.json({ success: true, purchased: idsToInsert.length });
});
});

app.listen(PORT, () =>
console.log(`Pixel Kingdom running on http://localhost:${PORT}`)
);