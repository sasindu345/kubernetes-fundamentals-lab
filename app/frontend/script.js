const API_URL = "http://localhost:3000/api/notes";

// Load notes when page opens
window.onload = () => {
    fetchNotes();
};

// Get all notes
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);
        const notes = await response.json();

        const notesContainer = document.getElementById("notes");
        notesContainer.innerHTML = "";

        notes.forEach(note => {
            notesContainer.innerHTML += `
                <div class="note">
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>

                    <button onclick="deleteNote(${note.id})">
                        Delete
                    </button>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

// Create a note
async function createNote() {

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title || !content) {
        alert("Please fill all fields.");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            content
        })
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    fetchNotes();
}

// Delete a note
async function deleteNote(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    fetchNotes();
}