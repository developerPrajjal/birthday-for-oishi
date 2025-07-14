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

// Show/Hide chatbot
chatbotLauncher.addEventListener("click", () => {
  melodyChatbot.classList.remove("hidden");
  chatbotCloud.classList.add("hidden");
});

closeChatbot.addEventListener("click", () => {
  melodyChatbot.classList.add("hidden");
  chatbotCloud.classList.remove("hidden");
});

// Handle message send
sendMsg.addEventListener("click", handleUserMessage);
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") handleUserMessage();
});

function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  setTimeout(() => handleBotResponse(message), 600);
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
    initiateSpotifyLogin(selectedGenres);
    step = 2;
  } else {
    appendMessage("bot", "Hang tight while I get your playlist ready! 🎵");
  }
}

// PKCE helpers
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join("");
}

async function initiateSpotifyLogin(genres) {
  const clientId = "9d4c5c3068574999b5ce2dea3bf5db54";
  const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/callback.html";
  const state = encodeURIComponent(genres.join(","));
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store code_verifier to exchange later
  sessionStorage.setItem("code_verifier", codeVerifier);

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=playlist-modify-public&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  appendMessage("bot", "Click the button below to log in with Spotify and get your custom playlist!");

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

// ⏪ Handle redirect playlist (after callback)
window.addEventListener("load", () => {
  if (window.location.hash.includes("playlist")) {
    const token = localStorage.getItem("spotify_token");
    const genres = localStorage.getItem("selected_genres");
    if (token && genres) {
      appendMessage("bot", `Here’s your playlist based on: ${genres}`);
      appendMessage("bot", "🎉 Playlist creation coming soon!");
    }
  }
});
