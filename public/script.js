const promptInput = document.getElementById("prompt-input");
const generateBtn = document.getElementById("generate-btn");
const imageBox = document.getElementById("image-box");
const placeholderText = document.getElementById("placeholder");

async function generateImage() {
const promptText = promptInput.value.trim();


if (!promptText) {
    alert("Please enter a description for the image!");
    return;
}

generateBtn.disabled = true;
generateBtn.innerText = "Generating...";

if (placeholderText) {
    placeholderText.style.display = "none";
}

const oldImage = imageBox.querySelector("img");
if (oldImage) {
    if (oldImage.dataset.objectUrl) {
        URL.revokeObjectURL(oldImage.dataset.objectUrl);
    }
    oldImage.remove();
}

const oldLoader = imageBox.querySelector(".loading-spinner");
if (oldLoader) {
    oldLoader.remove();
}

const loadingMessage = document.createElement("p");
loadingMessage.className = "loading-spinner";
loadingMessage.innerText = "Generating your AI image...";
imageBox.appendChild(loadingMessage);

try {
    // Request goes to our own Node.js backend.
    const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: promptText
        })
    });

    if (!response.ok) {
        let errorMessage = `Request failed (${response.status})`;

        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch {
            // Keep the default error message.
        }

        throw new Error(errorMessage);
    }

    const imageBlob = await response.blob();
    console.log("Image type:", imageBlob.type);
    console.log("Image size:", imageBlob.size, "bytes");
    
    const aiImageUrl = URL.createObjectURL(imageBlob);

    const newImage = document.createElement("img");
    newImage.src = aiImageUrl;
    newImage.alt = promptText;
    newImage.dataset.objectUrl = aiImageUrl;
    newImage.style.width = "100%";
newImage.style.height = "100%";
newImage.style.objectFit = "cover";
newImage.style.borderRadius = "8px";
newImage.style.display = "block";

    imageBox.appendChild(newImage);

} catch (error) {
    console.error("Image generation error:", error);
    alert("Image generation failed: " + error.message);

    if (placeholderText) {
        placeholderText.style.display = "block";
    }
} finally {
    loadingMessage.remove();
    generateBtn.disabled = false;
    generateBtn.innerText = "Generate";
}


}

generateBtn.addEventListener("click", generateImage);

promptInput.addEventListener("keydown", (event) => {
if (event.key === "Enter") {
generateImage();
}
});
