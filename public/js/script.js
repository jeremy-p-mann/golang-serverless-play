async function simulateAsyncPostRequest() {
    return new Promise((resolve, reject) => {
        const randomTime = Math.random() * 2000 + 1000;
        const shouldFail = Math.random() < 0.5;
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Request failed: it's just random yo."));
            } else {
                resolve("I am robot.");
            }
        }, randomTime);
    });
}

function createMessage(role, content, timestamp) {
    const localTimeStamp = timestamp.toLocaleTimeString();
    const newMessage = document.createElement("li");
    newMessage.classList.add("message");

    const chatMetadata = document.createElement("div");
    chatMetadata.classList.add("chat-metadata");

    const newMessageRole = document.createElement("span");
    newMessageRole.textContent = role;
    newMessageRole.classList.add("message-role");
    chatMetadata.appendChild(newMessageRole);

    const messageTimestamp = document.createElement("span");
    messageTimestamp.textContent = `[${localTimeStamp}] `;
    messageTimestamp.classList.add("message-timestamp");
    chatMetadata.appendChild(messageTimestamp);

    newMessage.appendChild(chatMetadata);

    const newMessageContent = document.createElement("pre");
    newMessageContent.textContent = content;
    newMessageContent.classList.add("message-content");
    newMessage.appendChild(newMessageContent);

    return newMessage;
}

function addMessage(chatMessages, newMessage) {
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function submitChatMessage(buttonClickEvent) {
    const button = document.getElementById("submitButton");
    const textInput = document.getElementById("textInput");

    button.disabled = true;
    textInput.disabled = true;

    const chatMessages = document.getElementById("chatMessages");
    const chat_timestamp = new Date();

    const newMessage = createMessage("Human: ", textInput.value, chat_timestamp);
    addMessage(chatMessages, newMessage);

    console.log(chat_timestamp);

    simulateAsyncPostRequest()
        .then((response) => {
            const response_timestamp = new Date();
            const replyMessage = createMessage("AI: ", response, response_timestamp);
            addMessage(chatMessages, replyMessage);
            textInput.value = "";
            textInput.disabled = false;
            button.disabled = false;
        })
        .catch((error) => {
            console.error(error);
            const response_timestamp = new Date();
            const replyMessage = createMessage(
                "System: ",
                error.toString(),
                response_timestamp,
            );
            addMessage(chatMessages, replyMessage);
            textInput.disabled = false;
            button.disabled = false;
        });
}

document
    .getElementById("submitButton")
    .addEventListener("click", submitChatMessage);
