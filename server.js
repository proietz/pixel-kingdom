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
cellId INTEGER PRIMARY KEY,
text TEXT,
link TEXT,
color TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);
});

app.post("/api/buyCell", (req, res) => {
const { cellId, text, link, color } = req.body;

db.get("SELECT cellId FROM cells WHERE cellId = ?", [cellId], (err, row) => {
if (row) {
return res.json({ success: false });
}

db.run(
"INSERT INTO cells (cellId, text, link, color) VALUES (?, ?, ?, ?)",
[cellId, text, link, color],
err => {
if (err) return res.json({ success: false });
res.json({ success: true });
}
);
});
});

app.get("/api/loadCells", (req, res) => {
db.all("SELECT * FROM cells", [], (err, rows) => {
if (err) return res.json([]);
res.json(rows);
});
});

app.listen(PORT, () => {
console.log("Pixel Kingdom attivo su http://localhost:3000");
});