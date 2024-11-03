const createChatInterface = () => {
    const chatContainer = document.createElement("div");
    chatContainer.style.position = "fixed";
    chatContainer.style.bottom = "20px";
    chatContainer.style.right = "20px";
    chatContainer.style.width = "350px";
    chatContainer.style.backgroundColor = "#ffffff";
    chatContainer.style.border = "1px solid #ccc";
    chatContainer.style.borderRadius = "10px";
    chatContainer.style.padding = "10px";
    chatContainer.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    chatContainer.style.fontFamily = "Arial, sans-serif";
    chatContainer.style.zIndex = "1000";

    const messageDisplay = document.createElement("div");
    messageDisplay.style.maxHeight = "300px";
    messageDisplay.style.overflowY = "auto";
    messageDisplay.style.padding = "5px";
    messageDisplay.style.marginBottom = "10px";

    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Ask a question...";
    input.style.flex = "1";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "5px";
    input.style.padding = "8px";
    input.style.marginRight = "5px";

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "8px 12px";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.backgroundColor = "#4CAF50";
    sendButton.style.color = "#fff";
    sendButton.style.cursor = "pointer";

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    chatContainer.appendChild(messageDisplay);
    chatContainer.appendChild(inputContainer);
    document.body.appendChild(chatContainer);

    const addMessage = (text, sender = "user") => {
        const messageBubble = document.createElement("div");
        messageBubble.textContent = text;
        messageBubble.style.padding = "10px";
        messageBubble.style.margin = "5px 0";
        messageBubble.style.borderRadius = "10px";
        messageBubble.style.maxWidth = "80%";
        messageBubble.style.wordWrap = "break-word";
        messageBubble.style.alignSelf = sender === "user" ? "flex-end" : "flex-start";
        messageBubble.style.backgroundColor = sender === "user" ? "#DCF8C6" : "#E9E9EB";
        messageBubble.style.color = "#333";

        messageDisplay.appendChild(messageBubble);
        messageDisplay.scrollTop = messageDisplay.scrollHeight;

        return messageBubble;
    };

    const getVideoId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v'); // Assumes `v` parameter is present in URL
    };

    sendButton.addEventListener("click", async () => {
        const question = input.value.trim();
        const videoId = getVideoId();

        if (!question || !videoId) return;

        addMessage(question, "user");
        input.value = "";

        const loadingMessage = addMessage("Loading...", "bot");

        try {
            const response = await fetch("http://localhost:3000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoId, question }),
            });

            const data = await response.json();
            messageDisplay.removeChild(loadingMessage);
            addMessage(data.answer || "No response received.", "bot");
        } catch (error) {
            console.error("Error in fetch request:", error);
            messageDisplay.removeChild(loadingMessage);
            addMessage("Error: Unable to fetch response.", "bot");
        }
    });
};

window.addEventListener("load", createChatInterface);
