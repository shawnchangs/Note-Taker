const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 8789;
const app = express();

const noteData = require('./db/db.json')


// Middleware for parsing urlencoded form data, application/json
// Static middleware for serving assets in the public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());



// API route reads the db.json file and returns all saved notes as json
// Routes notes and index 
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      var notes = JSON.parse(data);
      res.json(notes);
    });
  });

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// API route will receive a new note and save to the db.json file
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      var notes = JSON.parse(data);
      let userNote = req.body;
      userNote.id = Math.floor(Math.random() * 5000);
      notes.push(userNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
        res.json(userNote);
    });
    }); 
  });

// Delete notes. remove notes given the :id property and rewrites to the db.json file
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    const newNotes = notes.filter(note => note.id !== parseInt(req.params.id));
  
  fs.writeFile('./db/db.json', JSON.stringify(newNotes), (err, data) => {
    res.json(notes[req.params.id]);
  });
});
});

// Listen for connections
app.listen(PORT, () => {
    console.log(`App listening at http://localHost:${PORT}`);
});
