// Chat Bubble Widget
class ChatBubble {
  constructor(config) {
    this.config = {
      apiKey: config.apiKey || "",
      theme: {
        primary: config.theme?.primary || "#2563eb",
        secondary: config.theme?.secondary || "#ffffff",
        text: config.theme?.text || "#1f2937",
        bubble: config.theme?.bubble || "#2563eb",
      },
      position: config.position || "bottom-right",
      title: config.title || "Chat with us",
      placeholder: config.placeholder || "Type your message...",
    };

    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    this.createStyles();
    this.createBubble();
    this.createChatWindow();
    this.attachEventListeners();
  }

  createStyles() {
    const styles = `
      .chat-bubble-container * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      
      .chat-bubble {
        position: fixed;
        ${
          this.config.position.includes("bottom")
            ? "bottom: 20px;"
            : "top: 20px;"
        }
        ${
          this.config.position.includes("right")
            ? "right: 20px;"
            : "left: 20px;"
        }
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${this.config.theme.bubble};
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
        z-index: 9998;
      }

      .chat-bubble:hover {
        transform: scale(1.1);
      }

      .chat-window {
        position: fixed;
        ${
          this.config.position.includes("bottom")
            ? "bottom: 100px;"
            : "top: 100px;"
        }
        ${
          this.config.position.includes("right")
            ? "right: 20px;"
            : "left: 20px;"
        }
        width: 360px;
        height: 500px;
        background-color: ${this.config.theme.secondary};
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: none;
        flex-direction: column;
        z-index: 9999;
        overflow: hidden;
      }

      .chat-header {
        background-color: ${this.config.theme.primary};
        color: ${this.config.theme.secondary};
        padding: 16px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .message {
        margin-bottom: 12px;
        max-width: 80%;
        padding: 8px 12px;
        border-radius: 12px;
        word-wrap: break-word;
      }

      .user-message {
        background-color: ${this.config.theme.primary};
        color: ${this.config.theme.secondary};
        margin-left: auto;
      }

      .bot-message {
        background-color: #f3f4f6;
        color: ${this.config.theme.text};
      }

      .chat-input {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      }

      .chat-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        outline: none;
      }

      .chat-input input:focus {
        border-color: ${this.config.theme.primary};
      }

      .send-button {
        background-color: ${this.config.theme.primary};
        color: ${this.config.theme.secondary};
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .send-button:hover {
        background-color: ${this.adjustColor(this.config.theme.primary, -20)};
      }

      .close-button {
        background: none;
        border: none;
        color: ${this.config.theme.secondary};
        cursor: pointer;
        padding: 4px;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  adjustColor(color, amount) {
    return color; // For simplicity, we're not implementing color adjustment
  }

  createBubble() {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="message-square" color="${this.config.theme.secondary}">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    `;
    document.body.appendChild(bubble);
  }

  createChatWindow() {
    const chatWindow = document.createElement("div");
    chatWindow.className = "chat-window";
    chatWindow.innerHTML = `
      <div class="chat-header">
        <span>${this.config.title}</span>
        <button class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input">
        <input type="text" placeholder="${this.config.placeholder}">
        <button class="send-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(chatWindow);
  }

  attachEventListeners() {
    const bubble = document.querySelector(".chat-bubble");
    const chatWindow = document.querySelector(".chat-window");
    const closeButton = chatWindow.querySelector(".close-button");
    const input = chatWindow.querySelector("input");
    const sendButton = chatWindow.querySelector(".send-button");

    bubble.addEventListener("click", () => this.toggleChat());
    closeButton.addEventListener("click", () => this.toggleChat());

    const sendMessage = async () => {
      const message = input.value.trim();
      input.value = "";
      if (message) {
        this.addMessage(message, "user");
        const request = await fetch(`https://conversy.archan.dev/api/chat`, {
          body: JSON.stringify({ message, apiKey: this.config.apiKey }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        this.addMessage(response.message, "bot");
      }
    };

    sendButton.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  toggleChat() {
    const chatWindow = document.querySelector(".chat-window");
    this.isOpen = !this.isOpen;
    chatWindow.style.display = this.isOpen ? "flex" : "none";
    if (this.isOpen) {
      chatWindow.querySelector("input").focus();
    }
  }

  addMessage(text, sender) {
    const messagesContainer = document.querySelector(".chat-messages");
    const message = document.createElement("div");
    message.className = `message ${sender}-message`;
    message.textContent = text;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Make ChatBubble available globally
window.ChatBubble = ChatBubble;
