const pool = require("../db");

// GET /api/notes
const getNotes = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notes ORDER BY id ASC"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch notes."
        });
    }
};

// POST /api/notes
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required."
            });
        }

        const result = await pool.query(
            `INSERT INTO notes (title, content)
             VALUES ($1, $2)
             RETURNING *`,
            [title, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create note."
        });
    }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM notes WHERE id = $1",
            [id]
        );

        res.status(200).json({
            message: "Note deleted."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete note."
        });
    }
};

module.exports = {
    getNotes,
    createNote,
    deleteNote
};