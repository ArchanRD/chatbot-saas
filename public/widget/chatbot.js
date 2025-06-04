/**
 * Conversy Chat Widget
 * Combined chat initialization and messaging functionality
 * Configuration is fetched from server based on API key
 */

(function () {
  // Extract API key from script tag
  const scriptTag = document.currentScript;
  let apiKey = scriptTag?.getAttribute("data-api-key") || "";

  // Widget state
  let widgetConfig = null;
  let chatOpen = false;
  let messages = [];
  let isWaitingForResponse = false;

  // DOM elements (will be populated after creation)
  let chatContainer,
    chatBubble,
    chatPanel,
    messagesContainer,
    inputField,
    sendButton;

  // ===== WIDGET INITIALIZATION (Previously in chat-init.js) =====

  /**
   * Initialize the widget by fetching config and creating DOM elements
   */
  function initWidget() {
    // If no API key provided, check for legacy configuration
    if (!apiKey && window.__CHAT_CONFIG__?.apiKey) {
      apiKey = window.__CHAT_CONFIG__.apiKey;
      console.warn(
        "Conversy: Using window.__CHAT_CONFIG__ is deprecated. Please use data-api-key attribute instead."
      );
    }

    if (!apiKey) {
      console.error(
        "Conversy: API key is required. Add data-api-key attribute to the script tag."
      );
      return;
    }

    // If not fetching config, just create the DOM and event listeners
    createWidgetDOM();
    initEventListeners();

    // Fetch configuration from server
    // fetchConfig(apiKey)
    //   .then(config => {
    //     widgetConfig = config;
    //     createWidgetDOM();
    //     initEventListeners();
    //   })
    //   .catch(error => {
    //     console.error('Conversy: Failed to load widget configuration', error);
    //   });
  }

  /**
   * Fetch widget configuration from server
   */
  // function fetchConfig(apiKey) {
  //   const configUrl = `http://localhost:3000/api/widget-config?apiKey=${encodeURIComponent(
  //     apiKey
  //   )}`;

  //   return fetch(configUrl)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch config: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((config) => {
  //       // Apply default values for any missing properties
  //       return {
  //         theme: {
  //           primary: "#2563eb",
  //           secondary: "#ffffff",
  //           text: "#1f2937",
  //           bubble: "#2563eb",
  //           ...(config.theme || {}),
  //         },
  //         position: config.position || "bottom-right",
  //         title: config.title || "Chat Support",
  //         placeholder: config.placeholder || "Ask anything...",
  //         welcomeMessage:
  //           config.welcomeMessage || "Hello! How can I help you today?",
  //         ...config,
  //       };
  //     });
  // }

  /**
   * Create all DOM elements for the chat widget
   */
  function createWidgetDOM() {
    // Create container
    chatContainer = document.createElement("div");
    chatContainer.id = "conversy-chat-container";
    chatContainer.style.position = "fixed";
    chatContainer.style.zIndex = "9999";

    // Apply position from config
    applyPositionStyles(chatContainer, "bottom-right");

    // Create chat bubble
    chatBubble = document.createElement("div");
    chatBubble.id = "conversy-chat-bubble";
    chatBubble.style.width = "60px";
    chatBubble.style.height = "60px";
    chatBubble.style.borderRadius = "50%";
    chatBubble.style.backgroundColor = "#000000";
    chatBubble.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    chatBubble.style.display = "flex";
    chatBubble.style.alignItems = "center";
    chatBubble.style.justifyContent = "center";
    chatBubble.style.cursor = "pointer";
    chatBubble.style.transition = "transform 0.3s ease";

    // Add chat icon to bubble
    chatBubble.innerHTML = `
      <img src="https://conversy.archan.dev/Conversy-logo-white.png" style="border-radius:50%;padding:5px;height:60px;" />
    `;

    // Create chat panel
    chatPanel = document.createElement("div");
    chatPanel.id = "conversy-chat-panel";
    chatPanel.style.position = "absolute";
    chatPanel.style.width = "350px";
    chatPanel.style.height = "500px";
    chatPanel.style.backgroundColor = "#ffffff";
    chatPanel.style.borderRadius = "20px";
    chatPanel.style.boxShadow = "0 5px 20px rgba(0,0,0,0.15)";
    chatPanel.style.display = "none";
    chatPanel.style.flexDirection = "column";
    chatPanel.style.overflow = "hidden";
    chatPanel.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    // Position the panel according to container position
    positionChatPanel(chatPanel, "bottom-right");

    // Create chat header
    const chatHeader = document.createElement("div");
    chatHeader.style.padding = "16px";
    chatHeader.style.backgroundColor = "#292929";
    chatHeader.style.color = "#ffffff";
    chatHeader.style.fontFamily = "system-ui, -apple-system, sans-serif";
    chatHeader.style.fontSize = "16px";
    chatHeader.style.fontWeight = "600";
    chatHeader.style.borderTopLeftRadius = "20px";
    chatHeader.style.borderTopRightRadius = "20px";
    chatHeader.style.display = "flex";
    chatHeader.style.justifyContent = "space-between";
    chatHeader.style.alignItems = "center";

    chatHeader.innerHTML = `
      <div>Conversy Chat</div>
      <div id="conversy-close-button" style="cursor:pointer;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;

    // Create messages container
    messagesContainer = document.createElement("div");
    messagesContainer.id = "conversy-messages";
    messagesContainer.style.flex = "1";
    messagesContainer.style.padding = "16px";
    messagesContainer.style.overflowY = "auto";
    messagesContainer.style.display = "flex";
    messagesContainer.style.flexDirection = "column";
    messagesContainer.style.gap = "12px";
    messagesContainer.style.fontFamily = "system-ui, -apple-system, sans-serif";
    messagesContainer.style.fontSize = "14px";
    messagesContainer.style.color = "#1f2937";

    // Create input area
    const inputArea = document.createElement("div");
    inputArea.style.borderTop = "1px solid #e5e7eb";
    inputArea.style.padding = "8px 16px";
    inputArea.style.display = "flex";
    inputArea.style.alignItems = "center";
    inputArea.style.gap = "8px";

    // Create input field
    inputField = document.createElement("input");
    inputField.id = "conversy-input";
    inputField.type = "text";
    inputField.placeholder = "Type your message...";
    inputField.style.flex = "1";
    inputField.style.padding = "6px 12px";
    inputField.style.borderRadius = "20px";
    // inputField.style.border = "1px solid #e5e7eb";
    inputField.style.outline = "none";
    inputField.style.fontFamily = "system-ui, -apple-system, sans-serif";
    inputField.style.fontSize = "14px";

    // Create send button
    sendButton = document.createElement("button");
    sendButton.id = "conversy-send";
    sendButton.type = "button";
    sendButton.style.backgroundColor = "#292929";
    sendButton.style.color = "#ffffff";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "20px";
    sendButton.style.padding = "10px 16px";
    sendButton.style.cursor = "pointer";
    sendButton.style.fontFamily = "system-ui, -apple-system, sans-serif";
    sendButton.style.fontSize = "14px";
    sendButton.style.fontWeight = "500";
    sendButton.textContent = "Send";

    // Assemble input area
    inputArea.appendChild(inputField);
    inputArea.appendChild(sendButton);

    // Assemble chat panel
    chatPanel.appendChild(chatHeader);
    chatPanel.appendChild(messagesContainer);
    chatPanel.appendChild(inputArea);

    // Assemble chat container
    chatContainer.appendChild(chatBubble);
    chatContainer.appendChild(chatPanel);

    // Add to document
    document.body.appendChild(chatContainer);

    // Add welcome message if configured
    // if (widgetConfig.welcomeMessage) {
    //   addBotMessage(widgetConfig.welcomeMessage);
    // }
    addBotMessage("Hello! How can I help you?");
  }

  /**
   * Position the chat panel based on the container position
   */
  function positionChatPanel(panel, position) {
    switch (position) {
      case "bottom-right":
        panel.style.bottom = "80px";
        panel.style.right = "0";
        break;
      case "bottom-left":
        panel.style.bottom = "80px";
        panel.style.left = "0";
        break;
      case "top-right":
        panel.style.top = "80px";
        panel.style.right = "0";
        break;
      case "top-left":
        panel.style.top = "80px";
        panel.style.left = "0";
        break;
      default:
        panel.style.bottom = "80px";
        panel.style.right = "0";
    }
  }

  /**
   * Apply position styles to container
   */
  function applyPositionStyles(container, position) {
    const margin = "20px";

    // Reset all positions
    container.style.top = "auto";
    container.style.right = "auto";
    container.style.bottom = "auto";
    container.style.left = "auto";

    // Apply positions based on config
    switch (position) {
      case "bottom-right":
        container.style.bottom = margin;
        container.style.right = margin;
        break;
      case "bottom-left":
        container.style.bottom = margin;
        container.style.left = margin;
        break;
      case "top-right":
        container.style.top = margin;
        container.style.right = margin;
        break;
      case "top-left":
        container.style.top = margin;
        container.style.left = margin;
        break;
      default:
        container.style.bottom = margin;
        container.style.right = margin;
    }
  }

  /**
   * Set up event listeners
   */
  function initEventListeners() {
    // Toggle chat panel on bubble click
    chatBubble.addEventListener("click", toggleChatPanel);

    // Close button
    document
      .getElementById("conversy-close-button")
      .addEventListener("click", closeChatPanel);

    // Send message on button click
    sendButton.addEventListener("click", sendMessage);

    // Send message on Enter key
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    // Set up config update polling
    // startConfigPolling();
  }

  /**
   * Toggle chat panel visibility
   */
  function toggleChatPanel() {
    if (chatOpen) {
      closeChatPanel();
    } else {
      openChatPanel();
    }
  }

  /**
   * Open chat panel
   */
  function openChatPanel() {
    chatPanel.style.display = "flex";
    // Small delay to allow display:flex to take effect before animating
    setTimeout(() => {
      chatPanel.style.opacity = "1";
      chatPanel.style.transform = "translateY(0)";
      chatBubble.style.transform = "scale(0.85)";
    }, 10);
    chatOpen = true;
    inputField.focus();
  }

  /**
   * Close chat panel
   */
  function closeChatPanel() {
    chatPanel.style.opacity = "0";
    chatPanel.style.transform = "translateY(10px)";
    chatBubble.style.transform = "scale(1)";

    // Hide panel after animation completes
    setTimeout(() => {
      chatPanel.style.display = "none";
    }, 300);

    chatOpen = false;
  }

  /**
   * Poll for config updates
   */
  // function startConfigPolling() {
  //   // Check for config updates every 5 minutes
  //   setInterval(() => {
  //     fetchConfig(apiKey)
  //       .then((newConfig) => {
  //         // Check if config has changed
  //         if (JSON.stringify(newConfig) !== JSON.stringify(widgetConfig)) {
  //           // Store new config
  //           const oldConfig = widgetConfig;
  //           widgetConfig = newConfig;

  //           // Update styles
  //           updateWidgetStyles(oldConfig, newConfig);
  //         }
  //       })
  //       .catch((error) => {
  //         console.warn("Conversy: Failed to check for config updates", error);
  //       });
  //   }, 5 * 60 * 1000); // 5 minutes
  // }

  /**
   * Update widget styles when config changes
   */
  function updateWidgetStyles(oldConfig, newConfig) {
    // Update bubble color
    if (oldConfig.theme.bubble !== newConfig.theme.bubble) {
      chatBubble.style.backgroundColor = newConfig.theme.bubble;
    }

    // Update header color and title
    if (oldConfig.theme.primary !== newConfig.theme.primary) {
      const header = chatPanel.querySelector("div:first-child");
      header.style.backgroundColor = newConfig.theme.primary;
      sendButton.style.backgroundColor = newConfig.theme.primary;
    }

    // Update title text
    if (oldConfig.title !== newConfig.title) {
      const titleElement = chatPanel.querySelector(
        "div:first-child div:first-child"
      );
      titleElement.textContent = newConfig.title;
    }

    // Update panel background color
    if (oldConfig.theme.secondary !== newConfig.theme.secondary) {
      chatPanel.style.backgroundColor = newConfig.theme.secondary;
    }

    // Update text color
    if (oldConfig.theme.text !== newConfig.theme.text) {
      messagesContainer.style.color = newConfig.theme.text;
    }

    // Update input placeholder
    if (oldConfig.placeholder !== newConfig.placeholder) {
      inputField.placeholder = newConfig.placeholder;
    }

    // Update position if needed
    if (oldConfig.position !== newConfig.position) {
      applyPositionStyles(chatContainer, newConfig.position);
      positionChatPanel(chatPanel, newConfig.position);
    }
  }

  // ===== CHAT FUNCTIONALITY (Previously in chatbot.js) =====

  /**
   * Send message to backend
   */
  function sendMessage() {
    const messageText = inputField.value.trim();

    if (messageText && !isWaitingForResponse) {
      // Clear input
      inputField.value = "";

      // Add user message to chat
      addUserMessage(messageText);

      // Show typing indicator
      showTypingIndicator();

      // Set waiting state
      isWaitingForResponse = true;

      // Send to backend
      sendMessageToBackend(messageText)
        .then((response) => {
          // Remove typing indicator
          hideTypingIndicator();

          // Add bot response
          addBotMessage(response.message);

          // Reset waiting state
          isWaitingForResponse = false;
        })
        .catch((error) => {
          // Remove typing indicator
          hideTypingIndicator();

          // Add error message
          addBotMessage(
            "Sorry, I'm having trouble connecting. Please try again later."
          );
          console.error("Conversy: Error sending message", error);

          // Reset waiting state
          isWaitingForResponse = false;
        });
    }
  }

  /**
   * Send message to backend API
   */
  function sendMessageToBackend(message) {
    const url = "https://conversy.archan.dev/api/chat";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        message: message,
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      return response.json();
    });
  }

  /**
   * Get or create conversation ID from localStorage
   */
  function getConversationId() {
    const storageKey = `conversy_conversation_${apiKey}`;
    let conversationId = localStorage.getItem(storageKey);

    if (!conversationId) {
      conversationId = generateUUID();
      localStorage.setItem(storageKey, conversationId);
    }

    return conversationId;
  }

  /**
   * Generate UUID for conversation ID
   */
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * Add user message to chat
   */
  function addUserMessage(message) {
    const messageElement = createMessageElement(message, "user");
    messagesContainer.appendChild(messageElement);
    scrollToBottom();

    // Store message
    messages.push({ role: "user", content: message });
  }

  /**
   * Add bot message to chat
   */
  function addBotMessage(message) {
    const messageElement = createMessageElement(message, "bot");
    messagesContainer.appendChild(messageElement);
    scrollToBottom();

    // Store message
    messages.push({ role: "bot", content: message });
  }

  /**
   * Create message element
   */
  function createMessageElement(message, role) {
    const messageElement = document.createElement("div");
    messageElement.className = `conversy-message conversy-${role}-message`;
    messageElement.style.maxWidth = "80%";
    messageElement.style.padding = "10px 14px";
    messageElement.style.borderRadius = "20px";
    messageElement.style.wordBreak = "break-word";

    if (role === "user") {
      messageElement.style.alignSelf = "flex-end";
      messageElement.style.backgroundColor = "#292929";
      messageElement.style.color = "#ffffff";
    } else {
      messageElement.style.alignSelf = "flex-start";
      messageElement.style.backgroundColor = "#f3f4f6";
      messageElement.style.color = "#1f2937";
    }

    // Handle markdown links
    const formattedMessage = message.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>'
    );

    messageElement.innerHTML = formattedMessage;
    return messageElement;
  }

  /**
   * Show typing indicator
   */
  function showTypingIndicator() {
    const indicatorElement = document.createElement("div");
    indicatorElement.id = "conversy-typing-indicator";
    indicatorElement.className = "conversy-message conversy-bot-message";
    indicatorElement.style.alignSelf = "flex-start";
    indicatorElement.style.backgroundColor = "#f3f4f6";
    indicatorElement.style.padding = "10px 14px";
    indicatorElement.style.borderRadius = "20px";
    indicatorElement.style.display = "flex";
    indicatorElement.style.gap = "4px";

    // Add animated dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = "#a0aec0";
      dot.style.animation = "conversy-typing-dot 1.4s infinite ease-in-out";
      dot.style.animationDelay = `${i * 0.2}s`;
      indicatorElement.appendChild(dot);
    }

    // Add animation style
    if (!document.getElementById("conversy-typing-style")) {
      const style = document.createElement("style");
      style.id = "conversy-typing-style";
      style.textContent = `
        @keyframes conversy-typing-dot {
          0%, 20%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `;
      document.head.appendChild(style);
    }

    messagesContainer.appendChild(indicatorElement);
    scrollToBottom();
  }

  /**
   * Hide typing indicator
   */
  function hideTypingIndicator() {
    const indicator = document.getElementById("conversy-typing-indicator");
    if (indicator) {
      indicator.remove();
    }
  }

  /**
   * Scroll messages container to bottom
   */
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Initialize the widget when the DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
