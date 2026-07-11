const express = require("express");

const {
    getNotes,
    createNote,
    deleteNote
} = require("../controllers/notesController");

const router = express.Router();

// GET all notes
router.get("/", getNotes);

// Create a new note
router.post("/", createNote);

// Delete a note
router.delete("/:id", deleteNote);

module.exports = router;