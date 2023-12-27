async function simulateAsyncActorResponse(actor) {
    return new Promise((resolve, reject) => {
        const randomTime = Math.random() * 2000 + 1000;
        const shouldFail = Math.random() < 0.5;
        setTimeout(() => {
            if (shouldFail) {
                reject(
                    new Error(`Request failed: it's just random yo. Actor: ${actor}`),
                );
            } else {
                resolve(`I am ${actor}.`);
            }
        }, randomTime);
    });
}

function createMessage(role, content, timestamp, duration) {
    const localTimeStamp = timestamp.toLocaleTimeString();
    const template = document.getElementById("messageTemplate");
    const newMessage = document.importNode(template.content, true);
    const newMessageRole = newMessage.querySelector(".message-role");
    const messageTimestamp = newMessage.querySelector(".message-timestamp");
    const newMessageContent = newMessage.querySelector(".message-content");
    newMessageRole.textContent = role;
    messageTimestamp.textContent = `[${localTimeStamp}]`;
    if (duration) {
        console.log(duration)
        messageTimestamp.textContent = `[${localTimeStamp}][${duration}s]`;
    } else {
        messageTimestamp.textContent = `[${localTimeStamp}]`;
    }
    newMessageContent.textContent = content;
    return newMessage;
}

function addMessage(chatMessages, newMessage) {
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function disableUserInput() {
    const button = document.getElementById("submitButton");
    const textInput = document.getElementById("textInput");
    button.disabled = true;
    textInput.disabled = true;
}

function enableUserInput({ reset }) {
    const button = document.getElementById("submitButton");
    const textInput = document.getElementById("textInput");
    textInput.disabled = false;
    button.disabled = false;
    if (reset) {
        textInput.value = "";
    }
}

function submitChatMessage(buttonClickEvent) {
    disableUserInput();

    const chatMessages = document.getElementById("chatMessages");
    const human_message_timestamp = new Date();

    const newMessage = createMessage(
        "Human ",
        textInput.value,
        human_message_timestamp,
    );
    addMessage(chatMessages, newMessage);
    submitActorMessage('AI')
}

function submitActorMessage(actor) {
    const start_time = new Date();
    const chatMessages = document.getElementById("chatMessages");
    disableUserInput();

    simulateAsyncActorResponse(actor)
        .then((response) => {
            const response_timestamp = new Date();
            const duration = Math.round((response_timestamp - start_time) / 1000);
            const replyMessage = createMessage(
                `${actor}: `,
                response,
                response_timestamp,
                duration,
            );
            addMessage(chatMessages, replyMessage);
            enableUserInput({ reset: true });
        })
        .catch((error) => {
            console.error(error);
            const response_timestamp = new Date();
            const duration = Math.round((response_timestamp - start_time) / 1000);
            const replyMessage = createMessage(
                "System",
                error.toString(),
                response_timestamp,
                duration,
            );
            addMessage(chatMessages, replyMessage);
            enableUserInput({ reset: false });
        });
}

document
    .getElementById("submitButton")
    .addEventListener("click", submitChatMessage);
