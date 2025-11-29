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
  let widgetState = {};
  let chatbotCustomization = null;
  let chatOpen = false;
  let messages = [];
  let isWaitingForResponse = false;
  let logoUrl = null;

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
      console.error('Conversy: API key is empty. Provide a valid API key.');
      return;
    }
    
    // Store API key in widget state
    widgetState.apiKey = apiKey;
    
    // Create the widget DOM first
    createWidgetDOM();
    
    // Initialize event listeners
    initEventListeners();
    
    // Fetch chatbot configuration
    fetchChatbotCustomization(apiKey)
      .then(customization => {
        chatbotCustomization = customization;
        updateWidgetWithCustomization(customization);
      })
      .catch(error => {
        console.error('Conversy: Failed to load chatbot customization', error);
      });
  }

  /**
   * Fetch chatbot customization from server
   */
  function fetchChatbotCustomization(apiKey) {
    const configUrl = `https://conversy.archan.dev/api/widget-config?apiKey=${encodeURIComponent(
      apiKey
    )}`;

    return fetch(configUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch customization: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Apply default values for any missing properties
        return {
          theme: {
            primary_color: "#2563eb",
            text_color: "#1F2937",
            font_family: "Inter",
            font_size: "medium",
            border_radius: 8,
            chat_position: "bottom-right",
            ...(data.theme || {}),
          },
          welcome_mesg: data.welcome_mesg || "Hello! How can I help you today?",
          tone: data.tone || "friendly",
          answer_style: data.answer_style || "concise",
          name: data.name || "SupportBot",
          description: data.description || "AI Assistant",
          ...data,
        };
      });
  }
  
  /**
   * Apply theme settings to the widget
   */
  function applyTheme(theme) {
    if (!theme) return;
    
    // Update chat panel header
    const headerElement = document.getElementById('conversy-chat-header');
    if (headerElement) {
      if (theme.primary_color) {
        headerElement.style.backgroundColor = theme.primary_color;
      }
      // Update header title text color
      if (theme.text_color) {
        const headerTitle = document.getElementById('conversy-header-title');
        if (headerTitle) {
          headerTitle.style.color = theme.text_color;
        }
      }
    }
    
    // Update send button
    if (sendButton && theme.primary_color) {
      sendButton.style.backgroundColor = theme.primary_color;
    }
    
    // Update text color (only for user messages, bot messages stay black)
    if (theme.text_color) {
      // Update existing user messages with the new text color
      const existingUserMessages = messagesContainer?.querySelectorAll('.conversy-user-message');
      if (existingUserMessages) {
        existingUserMessages.forEach(messageEl => {
          messageEl.style.color = theme.text_color;
        });
      }
      
      // Ensure all bot messages are black
      const existingBotMessages = messagesContainer?.querySelectorAll('.conversy-bot-message');
      if (existingBotMessages) {
        existingBotMessages.forEach(messageEl => {
          messageEl.style.color = "#000000";
        });
      }
    }
    
    // Update font size (only for messages/conversation area)
    if (theme.font_size) {
      // Map font_size values to pixel sizes
      let fontSize;
      switch (theme.font_size) {
        case "small":
          fontSize = "0.875rem"; // 14px
          break;
        case "large":
          fontSize = "1.125rem"; // 18px
          break;
        case "medium":
        default:
          fontSize = "1rem"; // 16px
          break;
      }
      
      // Apply font size only to messages container (affects user and bot messages)
      if (messagesContainer) {
        messagesContainer.style.fontSize = fontSize;
      }
      
      // Update existing message elements if any
      const existingMessages = messagesContainer?.querySelectorAll('.conversy-message');
      if (existingMessages) {
        existingMessages.forEach(messageEl => {
          messageEl.style.fontSize = fontSize;
        });
      }
    }
    
    // Update border radius for all elements
    if (theme.border_radius) {
      const borderRadius = `${theme.border_radius}px`;
      
      // Update chat panel border radius
      if (chatPanel) {
        chatPanel.style.borderRadius = borderRadius;
      }
      
      // Update header border radius
      if (headerElement) {
        headerElement.style.borderTopLeftRadius = borderRadius;
        headerElement.style.borderTopRightRadius = borderRadius;
      }
    }
    
    // Update position
    if (theme.chat_position) {
      applyPositionStyles(chatContainer, theme.chat_position);
      positionChatPanel(chatPanel, theme.chat_position);
    }
    
    // Store colors in CSS variables for message styling
    if (theme.primary_color) {
      // Store the color in a CSS variable for user message styling
      document.documentElement.style.setProperty('--user-message-color', theme.primary_color);
    }
    
    if (theme.text_color) {
      // Store the text color in CSS variable for user message styling only
      document.documentElement.style.setProperty('--text-color', theme.text_color);
    }
  }
  
  /**
   * Update widget with customization settings
   */
  function updateWidgetWithCustomization(customization) {
    if (!customization) return;
    
    // Update welcome message if available
    if (customization.welcome_mesg && messagesContainer) {
      // Clear existing messages
      messagesContainer.innerHTML = '';
      // Add custom welcome message
      addBotMessage(customization.welcome_mesg);
    }
    
    // Store logo URL if available
    if (customization.logo_url) {
      logoUrl = customization.logo_url;
      updateChatBubbleLogo();
    }
    
    // Update theme if available
    if (customization.theme) {
      applyTheme(customization.theme);
    }
    
    // Update customization info
    updateCustomizationInfo(customization);
    
    // Add branding footer
    addBrandingFooter();
  }

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
    chatBubble.style.overflow = "hidden";
    
    // Default logo will be set in updateChatBubbleLogo
    updateChatBubbleLogo();

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
    chatHeader.id = "conversy-chat-header";
    chatHeader.style.padding = "16px";
    chatHeader.style.backgroundColor = "#292929";
    chatHeader.style.color = "var(--bot-text-color, #1f2937)";
    chatHeader.style.fontFamily = "system-ui, -apple-system, sans-serif";
    chatHeader.style.fontSize = "16px";
    chatHeader.style.fontWeight = "600";
    chatHeader.style.borderTopLeftRadius = "20px";
    chatHeader.style.borderTopRightRadius = "20px";
    chatHeader.style.display = "flex";
    chatHeader.style.justifyContent = "space-between";
    chatHeader.style.alignItems = "center";

    chatHeader.innerHTML = `
      <div id="conversy-header-title">SupportBot</div>
      <div id="conversy-close-button" style="cursor:pointer;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;

    // Create customization info container (will be populated later)
    const customizationInfoContainer = document.createElement("div");
    customizationInfoContainer.id = "conversy-customization-info";
    customizationInfoContainer.style.padding = "6px 10px";
    customizationInfoContainer.style.fontSize = "10px";
    customizationInfoContainer.style.color = "#6b7280";
    customizationInfoContainer.style.textAlign = "center";
    customizationInfoContainer.style.borderBottom = "1px solid #e5e7eb";
    customizationInfoContainer.style.backgroundColor = "#f9fafb";
    customizationInfoContainer.style.display = "none"; // Hide until populated

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
    messagesContainer.style.color = "#000000"; // Default to black (bot messages inherit this)

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
    chatPanel.appendChild(customizationInfoContainer);
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

    // Update text color (only affects user messages, bot messages stay black)
    // Note: text_color is applied per message element, not to the container

    // Update input field text color (if needed)
    // This section is reserved for future input field text color customization

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
    
    // Include customization options in the request if available
    const requestBody = {
      message: message,
    };
    
    // Add customization options if available
    if (chatbotCustomization) {
      requestBody.customization = {
        tone: chatbotCustomization.tone,
        answer_style: chatbotCustomization.answer_style
      };
    }
    
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'x-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
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
      
      // Use theme color from CSS variable or fallback to default
      const userMessageColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--user-message-color').trim() || "#292929";
      
      messageElement.style.backgroundColor = userMessageColor;
      
      // Use theme text color from CSS variable or fallback to default
      const userTextColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-color').trim() || "#1f2937";
      messageElement.style.color = userTextColor;
    } else {
      messageElement.style.alignSelf = "flex-start";
      messageElement.style.backgroundColor = "#f3f4f6";
      
      // Bot messages always use black text
      messageElement.style.color = "#000000";
    }

    // Create a container for the markdown content
    const contentContainer = document.createElement('div');
    contentContainer.className = 'conversy-markdown-content';
    
    // Process the message with our custom markdown renderer
    contentContainer.innerHTML = renderMarkdown(message);

    messageElement.appendChild(contentContainer);
    return messageElement;
  }
  
  /**
   * Simple markdown renderer that handles common elements
   */
  function renderMarkdown(text) {
    if (typeof text !== 'string') {
      text = String(text || '');
    }
    
    // Sanitize the text first
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    // Process code blocks first (```code```)
    text = text.replace(/```([\s\S]*?)```/g, function(match, code) {
      return '<pre><code>' + code.trim() + '</code></pre>';
    });
    
    // Process inline code (`code`)
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Process headings (# Heading)
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Process bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process italic (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Process links ([text](url))
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Process unordered lists
    text = text.replace(/^\s*-\s+(.*$)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Process ordered lists
    text = text.replace(/^\s*\d+\.\s+(.*$)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/gs, function(match) {
      // Only wrap in <ol> if not already wrapped in <ul>
      if (!match.startsWith('<ul>')) {
        return '<ol>' + match + '</ol>';
      }
      return match;
    });
    
    // Process paragraphs and line breaks
    text = text.replace(/\n\s*\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs if not already wrapped
    if (!text.startsWith('<h') && !text.startsWith('<ul') && !text.startsWith('<ol') && !text.startsWith('<p')) {
      text = '<p>' + text + '</p>';
    }
    
    return text;
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
  
  /**
   * Update customization info below header
   */
  function updateCustomizationInfo(customization) {
    if (!customization) return;
    
    // Get the customization info container
    const infoElement = document.getElementById('conversy-customization-info');
    if (!infoElement) return;
    
    // Hide the customization info element since we're not showing tone and style anymore
    infoElement.style.display = 'none';
    infoElement.textContent = '';
    
    // Update header title to SupportBot
    const headerTitle = document.getElementById('conversy-header-title');
    if (headerTitle) {
      headerTitle.textContent = "SupportBot";
    }
  }
  
  /**
   * Update chat bubble with custom logo if available
   */
  function updateChatBubbleLogo() {
    if (!chatBubble) return;
    
    // Clear existing content
    chatBubble.innerHTML = '';
    
    // Create image element
    const imgElement = document.createElement('img');
    
    if (logoUrl) {
      // Use custom logo
      imgElement.src = logoUrl;
      imgElement.alt = "Chatbot Logo";
      imgElement.style.width = "100%";
      imgElement.style.height = "100%";
      imgElement.style.objectFit = "cover";
      imgElement.style.borderRadius = "50%";
      
      // Add error handling
      imgElement.onerror = function() {
        // Fallback to default logo on error
        imgElement.src = "https://conversy.archan.dev/Conversy-logo-white.png";
        imgElement.style.padding = "5px";
        console.warn("Failed to load custom logo, using default");
      };
    } else {
      // Use default logo
      imgElement.src = "https://conversy.archan.dev/Conversy-logo-white.png";
      imgElement.alt = "Conversy Logo";
      imgElement.style.padding = "5px";
      imgElement.style.height = "100%";
    }
    
    // Append image to chat bubble
    chatBubble.appendChild(imgElement);
  }
  
  /**
   * Add branding footer at the bottom
   */
  function addBrandingFooter() {
    // Remove existing branding if any
    const existingBranding = document.getElementById('conversy-branding-footer');
    if (existingBranding) {
      existingBranding.remove();
    }
    
    // Get primary color or use default
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--user-message-color').trim() || '#2563eb';
    
    // Create a darker shade of the primary color for the gradient
    const darkerColor = createDarkerShade(primaryColor);
    
    // Create branding footer
    const brandingFooter = document.createElement('div');
    brandingFooter.id = 'conversy-branding-footer';
    brandingFooter.style.padding = '6px';
    brandingFooter.style.fontSize = '9px';
    brandingFooter.style.color = '#ffffff';
    brandingFooter.style.textAlign = 'center';
    brandingFooter.style.marginTop = 'auto';
    brandingFooter.style.background = `linear-gradient(90deg, ${primaryColor}, ${darkerColor})`;
    brandingFooter.innerHTML = 'Powered by <a href="https://conversy.archan.dev" target="_blank" style="color: #ffffff; text-decoration: none;">Conversy</a>';
    
    // Add to chat panel
    if (chatPanel) {
      chatPanel.appendChild(brandingFooter);
    }
  }
  
  /**
   * Create a darker shade of a color
   * @param {string} color - The color in hex format (e.g., #2563eb)
   * @returns {string} - A darker shade of the color
   */
  function createDarkerShade(color) {
    // Remove the # if present
    color = color.replace('#', '');
    
    // Parse the hex values
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // Make the color darker by reducing each component by 30%
    r = Math.max(0, Math.floor(r * 0.7));
    g = Math.max(0, Math.floor(g * 0.7));
    b = Math.max(0, Math.floor(b * 0.7));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Initialize the widget when the DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
