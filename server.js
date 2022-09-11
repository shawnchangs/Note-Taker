const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const uniqid = require('uniqid');
const noteData = require('./db/db.json')

const PORT = process.env.PORT || 3755;
const app = express();

// Middleware for parsing urlencoded form data, application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static middleware for serving assets in the public folder
app.use(express.static('public'));


// API route reads the db.json file and returns all saved notes as json
app.get('/api/notes', (req, res) => {
    res.json(noteData);
});

// API route will receive a new note and save to the db.json file
app.post('/api/notes', (req, res) => {
    var newNote = req.body;
    newNote.id = uniqid();
    noteData.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(noteData, null, 4) , (err) => {
        err ? console.log(err) : res.send(newNote)
    })
});

// Delete notes. remove notes given the :id property and rewrites to the db.json file
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        const parsedNotes = JSON.parse(data);
        const updatedNotes = parsedNotes.filter((note) => note.id !== id);

        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4), (err) => {
            err ? console.log(err) : res.json(updatedNotes);
        })   
    })
})

// Route to notes.html file
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Listen for connections
app.listen(PORT, () => {
    console.log(`App listening at http://localHost:${PORT}`);
});
