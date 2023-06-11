const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

router.get('/api/notes', (req, res) => {
  let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
  res.json(data);
});

router.post('/api/notes', (req, res) => {
  let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
  let newNote = req.body;
  newNote.id = uuidv4(); // Assign a unique id
  data.push(newNote);
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(data, null, 2));
  res.json(newNote);
});

router.delete('/api/notes/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
    const noteId = req.params.id;
    let newData = data.filter(note => note.id !== noteId);
    fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(newData, null, 2));
    res.json({message: `Note ${noteId} has been deleted`});
  });

module.exports = router;
