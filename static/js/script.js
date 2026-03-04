document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    const messagesContainer = document.getElementById('messagesContainer');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    let typingIndicator = null;

    // Функція для форматування часу
    function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Функція для додавання повідомлення у чат
    function addMessage(sender, message, isTyping = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const senderDiv = document.createElement('div');
        senderDiv.classList.add('message-sender');
        senderDiv.textContent = sender === 'bot' ? 'Karolinka' : 'Ви';

        const textDiv = document.createElement('div');
        textDiv.classList.add('message-text');
        textDiv.textContent = message;

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = formatTime();

        messageContent.appendChild(senderDiv);
        messageContent.appendChild(textDiv);
        messageContent.appendChild(timeDiv);
        messageDiv.appendChild(messageContent);

        messagesContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        return messageDiv;
    }

    // Функція для показу індикатора набору
    function showTypingIndicator() {
        if (typingIndicator) return;

        typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');

        const dot1 = document.createElement('div');
        dot1.classList.add('typing-dot');

        const dot2 = document.createElement('div');
        dot2.classList.add('typing-dot');

        const dot3 = document.createElement('div');
        dot3.classList.add('typing-dot');

        typingIndicator.appendChild(dot1);
        typingIndicator.appendChild(dot2);
        typingIndicator.appendChild(dot3);

        messagesContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Функція для видалення індикатора набору
    function removeTypingIndicator() {
        if (typingIndicator) {
            messagesContainer.removeChild(typingIndicator);
            typingIndicator = null;
        }
    }

    // Функція для відправки повідомлення
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage('user', message);
        userInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error(`Помилка сервера: ${response.status}`);
            }

            const data = await response.json();
            removeTypingIndicator();
            addMessage('bot', data.response);
        } catch (error) {
            removeTypingIndicator();
            addMessage('bot', `Сталася помилка: ${error.message}`);
        }
    }

    // Обробники подій
    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Фокус на інпут при завантаженні сторінки
    userInput.focus();
});