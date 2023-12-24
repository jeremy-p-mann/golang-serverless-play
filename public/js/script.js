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

    const newMessageRole = document.createElement("span");
    newMessageRole.textContent = role;
    newMessageRole.classList.add("message-role");
    newMessage.appendChild(newMessageRole);

    const newMessageContent = document.createElement("span");
    newMessageContent.textContent = content;
    newMessageContent.classList.add("message-content");
    newMessage.appendChild(newMessageContent);

    const messageTimestamp = document.createElement("span");
    messageTimestamp.textContent = `[${localTimeStamp}] `;
    messageTimestamp.classList.add("message-timestamp");
    newMessage.appendChild(messageTimestamp);

    return newMessage;
}

function submitChatMessage(buttonClickEvent) {
    const button = document.getElementById("submitButton");
    const textInput = document.getElementById("textInput");

    button.disabled = true;
    textInput.disabled = true;

    const chatMessages = document.getElementById("chatMessages");
    const chat_timestamp = new Date();

    const newMessage = createMessage("Human: ", textInput.value, chat_timestamp);
    chatMessages.appendChild(newMessage);

    console.log(chat_timestamp);

    simulateAsyncPostRequest()
        .then((response) => {
            const response_timestamp = new Date();
            const replyMessage = createMessage("AI: ", response, response_timestamp);
            chatMessages.appendChild(replyMessage);
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
            chatMessages.appendChild(replyMessage);
            textInput.disabled = false;
            button.disabled = false;
        });
}

document
    .getElementById("submitButton")
    .addEventListener("click", submitChatMessage);
