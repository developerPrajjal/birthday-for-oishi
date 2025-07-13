// Elements
const chatbotLauncher = document.getElementById("chatbotLauncher");
const melodyChatbot = document.getElementById("melodyChatbot");
const chatbotCloud = document.getElementById("chatbotCloud");
const closeChatbot = document.getElementById("closeChatbot");
const sendMsg = document.getElementById("sendMsg");
const userInput = document.getElementById("userInput");
const chatbotBody = document.getElementById("chatbotBody");

let step = 0;
let selectedGenres = [];

chatbotLauncher.addEventListener("click", () => {
  melodyChatbot.classList.remove("hidden");
  chatbotCloud.classList.add("hidden");
});

closeChatbot.addEventListener("click", () => {
  melodyChatbot.classList.add("hidden");
  chatbotCloud.classList.remove("hidden");
});

// Handle sending message
sendMsg.addEventListener("click", handleUserMessage);
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleUserMessage();
  }
});

function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  setTimeout(() => {
    handleBotResponse(message);
  }, 600);
}

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
  msgDiv.textContent = text;
  chatbotBody.appendChild(msgDiv);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function handleBotResponse(userMsg) {
  if (step === 0) {
    appendMessage("bot", "Awesome! 🎧 What genre(s) of music do you love? You can mention more than one.");
    step = 1;
  } else if (step === 1) {
    selectedGenres = userMsg.split(",").map((genre) => genre.trim());
    appendMessage("bot", `Great taste! Creating a custom playlist for: ${selectedGenres.join(", ")}`);
    generateSpotifyAuthLink(selectedGenres);
    step = 2;
  } else {
    appendMessage("bot", "Hang tight while I get your playlist ready! 🎵");
  }
}

function generateSpotifyAuthLink(genres) {
  const clientId = "9d4c5c3068574999b5ce2dea3bf5db54"; // 🔁 Replace this with your actual Client ID
  const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/callback.html";
  const scope = "playlist-modify-public";
  const state = encodeURIComponent(genres.join(","));
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${state}`;

  appendMessage("bot", "Click the button below to open Spotify and generate your playlist!");
  
  const button = document.createElement("button");
  button.textContent = "🎵 Open Spotify";
  button.className = "spotify-btn";
  button.onclick = () => window.open(authUrl, "_blank");

  const wrapper = document.createElement("div");
  wrapper.className = "bot-message";
  wrapper.appendChild(button);
  chatbotBody.appendChild(wrapper);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}
