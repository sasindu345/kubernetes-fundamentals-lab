require("dotenv").config();

const express = require("express");
const cors = require("cors");

const notesRoutes = require("./routes/notes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.json({
        message: "Kubernetes Fundamentals Lab API is running 🚀"
    });
});

// Notes API
app.use("/api/notes", notesRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});