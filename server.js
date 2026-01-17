const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

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

// carica blocchi acquistati
app.get("/api/blocks", (req, res) => {
db.all("SELECT * FROM blocks", [], (err, rows) => {
res.json(rows || []);
});
});

// acquisto blocco (pagamento simulato)
app.post("/api/buy", (req, res) => {
const { id, image, link, title } = req.body;

db.run(
"INSERT INTO blocks (id, image, link, title) VALUES (?, ?, ?, ?)",
[id, image, link, title],
() => res.json({ success: true })
);
});

app.listen(PORT, () =>
console.log(`Pixel Kingdom running on http://localhost:${PORT}`)
);