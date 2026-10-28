const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
try {
const { prompt } = req.body;


    if (!prompt || !prompt.trim()) {
        return res.status(400).json({
            error: "Please enter an image prompt."
        });
    }

    const response = await fetch(
    "https://ai-image-generator.guptapratishtha98.workers.dev/generate",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt.trim()
        })
    }
);

if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudflare AI error:", response.status, errorText);

    return res.status(response.status).json({
        error: "Image generation failed. Please try again."
    });
}

const imageBuffer = Buffer.from(await response.arrayBuffer());

res.set("Content-Type", response.headers.get("content-type") || "image/png");
res.send(imageBuffer);

} catch (error) {
    console.error("Server error:", error.message);

    res.status(500).json({
        error: "Something went wrong while generating the image."
    });
}


});

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});
