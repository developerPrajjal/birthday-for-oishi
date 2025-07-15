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

  // Token check only AFTER chatbot is launched
  let storedToken = localStorage.getItem("spotify_token");
  let storedGenres = localStorage.getItem("selected_genres");

  // Launch chatbot
  chatbotLauncher.addEventListener("click", function () {
    chatbot.classList.remove("hidden");
    chatbotCloud.style.display = "none";

    // ✅ Clear old messages every open
    chatbotBody.innerHTML = "";

    // If user has previously authorized Spotify
    if (storedToken && storedGenres && step === 0) {
      userData.genres = storedGenres.split(",");
      appendMessage("bot", `Welcome back Oishi! 💖 Let's recreate your playlist from earlier! 🎧`);
      generatePlaylistWithToken(storedToken);
      step = 99; // Prevent re-entry
      return;
    }

    if (step === 0) {
      appendMessage("bot", "Hi Oishi! 💖 I'm your music buddy MelodyAI! Let’s pick a custom playlist for you!");
      setTimeout(() => {
        askGenre();
        step = 1;
      }, 1200);
    }
  });

  // Close chatbot
  closeBtn.addEventListener("click", function () {
    chatbot.classList.add("hidden");
    chatbotCloud.style.display = "block";
  });

  // Send message button
  sendBtn.addEventListener("click", handleUserMessage);
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleUserMessage();
    }
  });

  function handleUserMessage() {
    const msg = userInput.value.trim();
    if (msg !== "") {
      appendMessage("user", msg);
      userInput.value = "";
      chatbotBody.scrollTop = chatbotBody.scrollHeight;

      if (step === 1) {
        userData.genres = msg.split(",").map(g => g.trim().toLowerCase());
        appendMessage("bot", "Great taste! 🎶 Now click below to connect to Spotify to build your playlist.");
        appendSpotifyAuthButton();
        step = 2;
      }
    }
  }

  function askGenre() {
    appendMessage("bot", "Tell me your favorite music genres (comma-separated, like pop, indie, lo-fi):");
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
    const clientId = "9d4c5c3068574999b5ce2dea3bf5db54"; // Replace with your own if needed
    const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/callback.html";
    const scope = "playlist-modify-public playlist-modify-private";
    const state = encodeURIComponent(genres.join(","));

    const codeVerifier = generateCodeVerifier();
    generateCodeChallenge(codeVerifier).then(codeChallenge => {
      localStorage.setItem("code_verifier", codeVerifier); // store for callback

      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
      window.location.href = authUrl;
    });
  }

  function generatePlaylistWithToken(token) {
    appendMessage("bot", "Creating your custom playlist now 🎧...");

    fetch("https://melody-backend-7vmo.onrender.com/api/playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: token,
        genres: userData.genres
      })
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
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
});
