// js/chatbot.js

document.addEventListener("DOMContentLoaded", function () {
  const chatbotLauncher = document.getElementById("chatbotLauncher");
  const chatbot = document.getElementById("melodyChatbot");
  const closeBtn = document.getElementById("closeChatbot");
  const chatbotCloud = document.getElementById("chatbotCloud");
  const sendBtn = document.getElementById("sendMsg");
  const userInput = document.getElementById("userInput");
  const chatbotBody = document.getElementById("chatbotBody");

  // Toggle Chatbot On Click
  chatbotLauncher.addEventListener("click", function () {
    chatbot.classList.remove("hidden");
    chatbotCloud.style.display = "none"; // Hide cloud message
  });

  // Close Chatbot
  closeBtn.addEventListener("click", function () {
    chatbot.classList.add("hidden");
    chatbotCloud.style.display = "block"; // Show cloud message again
  });

  // Handle Send Button Click
  sendBtn.addEventListener("click", function () {
    const msg = userInput.value.trim();
    if (msg !== "") {
      // Show user message
      const userMsgElem = document.createElement("div");
      userMsgElem.className = "user-message";
      userMsgElem.textContent = msg;
      chatbotBody.appendChild(userMsgElem);

      // Scroll to bottom
      chatbotBody.scrollTop = chatbotBody.scrollHeight;

      userInput.value = "";

      // Dummy bot response
      setTimeout(() => {
        const botMsgElem = document.createElement("div");
        botMsgElem.className = "bot-message";
        botMsgElem.textContent = "That's lovely! 😊";
        chatbotBody.appendChild(botMsgElem);

        const spotifyBtn = document.createElement("button");
spotifyBtn.textContent = "🎵 Connect to Spotify";
spotifyBtn.classList.add("spotify-connect-btn");
spotifyBtn.onclick = redirectToSpotifyAuth;
chatbotBody.appendChild(spotifyBtn);


        // Scroll again
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
      }, 700);
    }
  });

  // Allow Enter Key to Send
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });
});

// Spotify OAuth Setup
function redirectToSpotifyAuth() {
  const clientId = "9d4c5c3068574999b5ce2dea3bf5db54";
  const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/";
  const scopes = "playlist-modify-private playlist-modify-public";

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

  window.location.href = authUrl;
}
function redirectToSpotifyAuth() {
  const clientId = "9d4c5c3068574999b5ce2dea3bf5db54"; // Replace with your actual Spotify client ID
  const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/callback.html";
  const scopes = "playlist-modify-public";

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

  window.location.href = authUrl;
}
