// Function to create and inject the chat interface
const createChatInterface = () => {
    // Chat container styling
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

    // Message display area
    const messageDisplay = document.createElement("div");
    messageDisplay.style.maxHeight = "300px";
    messageDisplay.style.overflowY = "auto";
    messageDisplay.style.padding = "5px";
    messageDisplay.style.marginBottom = "10px";

    // Input and send button container
    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";

    // Input field styling
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Ask a question...";
    input.style.flex = "1";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "5px";
    input.style.padding = "8px";
    input.style.marginRight = "5px";

    // Send button styling
    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "8px 12px";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.backgroundColor = "#4CAF50";
    sendButton.style.color = "#fff";
    sendButton.style.cursor = "pointer";

    // Append elements
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    chatContainer.appendChild(messageDisplay);
    chatContainer.appendChild(inputContainer);
    document.body.appendChild(chatContainer);

    // Function to display messages as chat bubbles
    const addMessage = (text, sender = "user") => {
        const messageBubble = document.createElement("div");
        messageBubble.textContent = text;
        messageBubble.style.padding = "10px";
        messageBubble.style.margin = "5px 0";
        messageBubble.style.borderRadius = "10px";
        messageBubble.style.maxWidth = "80%";
        messageBubble.style.alignSelf = sender === "user" ? "flex-end" : "flex-start";
        messageBubble.style.backgroundColor = sender === "user" ? "#DCF8C6" : "#E9E9EB";
        messageBubble.style.color = "#333";

        messageDisplay.appendChild(messageBubble);
        messageDisplay.scrollTop = messageDisplay.scrollHeight; // Auto-scroll to the latest message
        return messageBubble;
    };

    // Event listener for sending the question
    sendButton.addEventListener("click", async () => {
        const question = input.value.trim();
        if (!question) return;

        // Display user's question
        addMessage(question, "user");
        input.value = "";

        // Display loading message for GPT response
        const loadingMessage = addMessage("Loading...", "bot");

        try {
            console.log("Sending request to backend...");
            const response = await fetch("http://localhost:3000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: "Sample transcript", question }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Received response from backend:", data);

                // Display GPT response
                addMessage(data.answer || "No response received.", "bot");
            } else {
                console.error(`Network response was not ok: ${response.statusText}`);
                addMessage(`Error: ${response.statusText}`, "bot");
            }
        } catch (error) {
            console.error("Error in fetch request:", error);
            addMessage("Error: Unable to fetch response.", "bot");
        } finally {
            // Remove loading message regardless of success or failure
            messageDisplay.removeChild(loadingMessage);
        }
    });
};

// Inject the chat interface when the page loads
window.addEventListener("load", createChatInterface);
