let notes = [
    {
        id: 1,
        title: "Learn Kubernetes",
        content: "Deploy my first application"
    }
];

// GET /api/notes
const getNotes = (req, res) => {
    res.status(200).json(notes);
};

// POST /api/notes
const createNote = (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required."
        });
    }

    const note = {
        id: Date.now(),
        title,
        content
    };

    notes.push(note);

    res.status(201).json(note);
};

// DELETE /api/notes/:id
const deleteNote = (req, res) => {
    const id = Number(req.params.id);

    notes = notes.filter(note => note.id !== id);

    res.status(200).json({
        message: "Note deleted."
    });
};

module.exports = {
    getNotes,
    createNote,
    deleteNote
};