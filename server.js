const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Assign a unique id to the new note

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
  
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ message: 'Note deleted.' });
          }
        });
      }
    });
  });

  const port = process.env.PORT || 3000; // FINALLY!! this is what lets me use heroku's dynamic port

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });