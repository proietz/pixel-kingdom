const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./pixelkingdom.db");

db.serialize(() => {
db.run(`
CREATE TABLE IF NOT EXISTS cells (
id INTEGER PRIMARY KEY AUTOINCREMENT,
x INTEGER,
y INTEGER,
title TEXT,
color TEXT,
link TEXT,
text TEXT,
image TEXT
)
`);
});

// carica celle
app.get("/api/loadCells", (req, res) => {
db.all("SELECT * FROM cells", [], (err, rows) => {
if (err) return res.json([]);
res.json(rows);
});
});

// acquisto blocco
app.post("/api/buyBlock", (req, res) => {
const { cells, title, color, link, text, image } = req.body;

const placeholders = cells.map(() => "(?,?,?,?,?,?,?)").join(",");
const values = [];

cells.forEach(c => {
values.push(c.x, c.y, title, color, link, text, image);
});

db.run(
`INSERT INTO cells (x,y,title,color,link,text,image) VALUES ${placeholders}`,
values,
err => {
if (err) {
return res.json({ success: false });
}
res.json({ success: true });
}
);
});

app.listen(PORT, () => {
console.log(`Pixel Kingdom online su http://localhost:${PORT}`);
});