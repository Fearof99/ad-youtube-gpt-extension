document.getElementById("askBtn").addEventListener("click", async () => {
    const question = document.getElementById("question").value;
    const responseDiv = document.getElementById("response");
    responseDiv.innerText = "Loading...";

    // Placeholder transcript for testing (Replace with actual transcript from YouTube API)
    const transcript = "This is a sample transcript of the video.";

    try {
        const response = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript, question })
        });
        const data = await response.json();
        responseDiv.innerText = data.answer || "No response received.";
    } catch (error) {
        responseDiv.innerText = "Error: Unable to fetch response.";
    }
});
