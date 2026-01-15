const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./pixelkingdom.db');
db.serialize(() => {
db.run(`CREATE TABLE IF NOT EXISTS cells (
cellId INTEGER PRIMARY KEY,
text TEXT,
image TEXT,
link TEXT,
color TEXT,
title TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
});

app.post('/api/buyCell', (req, res)=>{
const { cellId, text, image, link, color, title } = req.body;
db.get('SELECT * FROM cells WHERE cellId = ?', [cellId], (err,row)=>{
if(row) return res.json({success:false,message:'Cella già occupata'});
db.run('INSERT INTO cells (cellId,text,image,link,color,title) VALUES (?,?,?,?,?,?)',
[cellId,text,image,link,color,title],
err=>{
if(err) return res.json({success:false});
res.json({success:true});
});
});
});

app.get('/api/loadCells', (req,res)=>{
db.all('SELECT * FROM cells', [], (err,rows)=>{ if(err) return res.json([]); res.json(rows); });
});

app.listen(PORT, ()=>console.log(`Pixel Kingdom backend attivo su http://localhost:${PORT}`));