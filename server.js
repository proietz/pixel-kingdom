const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = new sqlite3.Database('./pixelkingdom.db');

db.serialize(() => {
db.run(`CREATE TABLE IF NOT EXISTS cells (
cellId INTEGER PRIMARY KEY,
x INT,
y INT,
color TEXT,
title TEXT,
text TEXT,
link TEXT,
image TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
});

// Acquisto celle (array di celle)
app.post('/api/buyCell', (req, res) => {
const { cells } = req.body; // [{x,y,color,title,text,link,image}]
if (!cells || cells.length === 0) return res.json({ success: false, message: "Nessuna cella selezionata" });

const placeholders = cells.map(c => `(${c.x},${c.y},'${c.color}','${c.title}','${c.text}','${c.link}','${c.image}')`).join(",");
db.run(`INSERT INTO cells (x,y,color,title,text,link,image) VALUES ${placeholders}`, err => {
if (err) return res.json({ success: false, message: err.message });
res.json({ success: true });
});
});

// Carica tutte le celle
app.get('/api/loadCells', (req, res) => {
db.all('SELECT * FROM cells', [], (err, rows) => {
if (err) return res.json([]);
res.json(rows);
});
});

app.listen(PORT, () => console.log(`Pixel Kingdom backend attivo su http://localhost:${PORT}`));