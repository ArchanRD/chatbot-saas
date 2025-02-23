// Initialize chat widget with default config
(function () {
  // Wait for chatbot.js to load and window.__CHAT_CONFIG__ to be set
  const initChat = () => {
    if (window.ChatBubble && window.__CHAT_CONFIG__) {
      new ChatBubble(window.__CHAT_CONFIG__);
    } else {
      setTimeout(initChat, 100);
    }
  };

  initChat();
})();
