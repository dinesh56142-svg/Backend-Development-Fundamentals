const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// GET /
app.get("/", (request, response) => {
    response.status(200).send(
        "Welcome to D. Dinesh Sesha Sai's Node.js and Express Lab!"
    );
});

// GET /about
app.get("/about", (request, response) => {
    response.status(200).json({
        name: "D. Dinesh Sesha Sai",
        section: "AI&ML-2B"
    });
});

// GET /time
app.get("/time", (request, response) => {
    response.status(200).json({
        currentDateTime: new Date()
    });
});

// 404 handler
app.use((request, response) => {
    response.status(404).send("404 - Page Not Found");
});

// Start locally, but export app for Vercel
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Express server running at http://localhost:${PORT}`);
    });
}

module.exports = app;