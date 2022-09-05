const express = require('express');
const path = require('path');
const fs = require('fs');

var uuid = require('uuid')
const notes = require('./db/db.json')

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing urlencoded form data, application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static middleware for serving assets in the public folder
app.use(express.static("public"));

// Route to notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API route reads the db.json file and returns all saved notes as json
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// API route will receive a new note and save to the db.json file
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    req.body.id = uuid()
    notes.push(req.body);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});

// GET route for homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Delete notes. remove notes given the :id property and rewrites to the db.json file
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.json(delNote);
})

// Listen for connections
app.listen(PORT, () => {
    console.log(`Aapp listening at http://localhost:${PORT}`);
  });