document.addEventListener("DOMContentLoaded", function () {
  const chatbotLauncher = document.getElementById("chatbotLauncher");
  const chatbot = document.getElementById("melodyChatbot");
  const closeBtn = document.getElementById("closeChatbot");
  const chatbotCloud = document.getElementById("chatbotCloud");
  const sendBtn = document.getElementById("sendMsg");
  const userInput = document.getElementById("userInput");
  const chatbotBody = document.getElementById("chatbotBody");

  let step = 0;
  let userData = {
    name: "Oishi",
    genres: []
  };

  // Launch chatbot
  chatbotLauncher.addEventListener("click", function () {
    chatbot.classList.remove("hidden");
    chatbotCloud.style.display = "none";

    if (step === 0) {
      appendMessage("bot", "Hi Oishi! 💖 I'm your music buddy MelodyAI! Let’s pick a custom playlist for you!");
      step = 1;
    }
  });

  // Close chatbot
  closeBtn.addEventListener("click", function () {
    chatbot.classList.add("hidden");
    chatbotCloud.style.display = "block";
  });

  sendBtn.addEventListener("click", handleUserMessage);
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleUserMessage();
    }
  });

  function handleUserMessage() {
    const msg = userInput.value.trim();
    if (msg === "") return;

    appendMessage("user", msg);
    userInput.value = "";
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    if (step === 1) {
      // Greeting received, now ask genre
      setTimeout(() => {
        appendMessage("bot", "Tell me your favorite music genres (comma-separated, like pop, indie, lo-fi):");
        step = 2;
      }, 800);
    } else if (step === 2) {
      userData.genres = msg.split(",").map(g => g.trim().toLowerCase());
      appendMessage("bot", "Great taste! 🎶 Now click below to connect to Spotify to build your playlist.");
      appendSpotifyAuthButton();
      step = 3;
    }
  }

  function appendMessage(sender, text) {
    const msgElem = document.createElement("div");
    msgElem.className = sender === "bot" ? "bot-message" : "user-message";
    msgElem.textContent = text;
    chatbotBody.appendChild(msgElem);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function appendSpotifyAuthButton() {
    const button = document.createElement("button");
    button.textContent = "🎵 Connect to Spotify";
    button.className = "spotify-btn";
    button.onclick = () => redirectToSpotifyAuth(userData.genres);

    const wrapper = document.createElement("div");
    wrapper.className = "bot-message";
    wrapper.appendChild(button);
    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function redirectToSpotifyAuth(genres) {
    const clientId = "9d4c5c3068574999b5ce2dea3bf5db54"; // Your Spotify client ID
    const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/callback.html";
    const scope = "playlist-modify-public playlist-modify-private";
    const state = encodeURIComponent(genres.join(","));

    const codeVerifier = generateCodeVerifier();
    localStorage.setItem("code_verifier", codeVerifier);

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
      window.location.href = authUrl;
    });
  }

  // Playlist generation (only after callback)
  const storedToken = localStorage.getItem("spotify_token");
  const storedGenres = localStorage.getItem("selected_genres");
  if (storedToken && storedGenres && window.location.hash === "#playlist") {
    chatbot.classList.remove("hidden");
    chatbotCloud.style.display = "none";

    appendMessage("bot", "Welcome back Oishi! 💖 Let's recreate your playlist from earlier! 🎧");
    appendMessage("bot", "Creating your custom playlist now 🎧...");

    generatePlaylistWithToken(storedToken, storedGenres.split(","));
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("selected_genres");
  }

  function generatePlaylistWithToken(token, genres) {
    fetch("https://melody-backend-7vmo.onrender.com/api/playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, genres })
    })
    .then(res => res.json())
    .then(data => {
      if (data.playlist_url) {
        appendMessage("bot", "Here’s your custom Spotify playlist! 🎉");
        appendSpotifyButton(data.playlist_url);
      } else {
        appendMessage("bot", "Oops! Couldn't generate your playlist.");
      }
    })
    .catch(() => {
      appendMessage("bot", "Server error while generating playlist.");
    });
  }

  function appendSpotifyButton(url) {
    const link = document.createElement("a");
    link.href = url;
    link.textContent = "🎧 Open Playlist on Spotify";
    link.className = "spotify-btn";
    link.target = "_blank";

    const wrapper = document.createElement("div");
    wrapper.className = "bot-message";
    wrapper.appendChild(link);
    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function generateCodeVerifier() {
    const array = new Uint32Array(56);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
  }

  function generateCodeChallenge(codeVerifier) {
    return sha256base64url(codeVerifier);
  }

  async function sha256base64url(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
});
