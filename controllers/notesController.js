const data = {
notes : require('../model/notes.json'),
setNotes: function(data) {this.notes = data}

}
const getAllNotes = (req, res) => {
    res.json(data.notes);
}

const createNewNote =(req, res) => {
    const newNote = {
        id: data.notes?.length ? data.notes[data.notes.length - 1].id + 1 : 1,
        title : req.body.title,
        description : req.body.description

    }

    if (!newNote.title || !newNote.description) {
        return res.status(400).json({'message': "Title and Description required to add a new note"})
        
    }
    data.setNotes([...data.notes, newNote]);
    res.status(201).json(data.notes)


}

const updateNote = (req, res) => {
    const note = data.note.find(emp => emp.id === parseInt(req.body.id));
    if (!note) {
        return res.status(400).json({ "message": `Note ID ${req.body.id} not found` });
    }
    if (req.body.title) note.title = req.body.title;
    if (req.body.description) note.description = req.body.description;
    const filteredArray = data.notes.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, note];
    data.setNotes(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.notes);
}


const deleteNote = (req, res) => {
    const note = data.notes.find(emp => emp.id === parseInt(req.body.id));
    if (!note) {
        return res.status(400).json({ "message": `Note ID ${req.body.id} not found` });
    }
    const filteredArray = data.notes.filter(emp => emp.id !== parseInt(req.body.id));
    data.setNotes([...filteredArray]);
    res.json(data.notes);
}

const getNote = (req, res) => {
    const note = data.notes.find(emp => emp.title === req.body.title);
    if (!note) {
        return res.status(400).json({ "message": `Note ID ${req.body.title} not found` });
    }
    res.json(note);
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote,
    getNote
}