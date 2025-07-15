// js/chatbot.js

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
    name: "Oishi", // You can personalize this further if needed
    genres: []
  };

  // Launch chatbot
  chatbotLauncher.addEventListener("click", function () {
    chatbot.classList.remove("hidden");
    chatbotCloud.style.display = "none";
    if (step === 0) {
      appendMessage("bot", "Hi Oishi! 💖 I'm your music buddy MelodyBot! Let’s pick out a custom playlist for you!");
      setTimeout(() => {
        askGenre();
        step = 1;
      }, 1000);
    }
  });

  // Close chatbot
  closeBtn.addEventListener("click", function () {
    chatbot.classList.add("hidden");
    chatbotCloud.style.display = "block";
  });

  // Send button click
  sendBtn.addEventListener("click", handleUserMessage);

  // Press Enter to send
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
        userData.genres.push(...msg.split(",").map(g => g.trim().toLowerCase()));
        appendMessage("bot", "Great taste! 🎶 Now let’s connect to Spotify to build your playlist.");
        requestSpotifyAuth();
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

  function appendSpotifyButton(url) {
    const button = document.createElement("button");
    button.textContent = "🎵 Open Spotify";
    button.className = "spotify-btn";
    button.onclick = () => {
      window.open(url, "_blank");
    };

    const wrapper = document.createElement("div");
    wrapper.className = "bot-message";
    wrapper.appendChild(button);
    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function requestSpotifyAuth() {
    fetch("https://melody-backend.onrender.com/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.auth_url) {
          appendMessage("bot", "Click below to login and get your custom playlist:");
          appendSpotifyButton(data.auth_url);
        } else {
          appendMessage("bot", "Something went wrong connecting to Spotify 😢");
        }
      })
      .catch((err) => {
        console.error(err);
        appendMessage("bot", "Error connecting to backend.");
      });
  }

  // This function should be called by your frontend after auth success (via redirect or polling)
  function generatePlaylist() {
    fetch("https://melody-backend.onrender.com/api/playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.playlist_url) {
          appendMessage("bot", "Here's your custom Spotify playlist! 🎶");
          appendSpotifyButton(data.playlist_url);
        } else {
          appendMessage("bot", "Oops! Couldn't generate the playlist. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        appendMessage("bot", "Server error while generating playlist.");
      });
  }

  // Optional: Call this manually for now
  // setTimeout(generatePlaylist, 15000);
});
