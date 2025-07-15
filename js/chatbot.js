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
        // Store genres
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
    button.onclick = () => {
      fetch("https://melody-backend.onrender.com/api/auth")
        .then(res => res.json())
        .then(data => {
          if (data.auth_url) {
            window.open(data.auth_url, "_blank");
            appendMessage("bot", "Once you’re logged in, I’ll handle the rest automatically 🎧");
          } else {
            appendMessage("bot", "Something went wrong getting the login link 😢");
          }
        })
        .catch(() => {
          appendMessage("bot", "Error connecting to backend.");
        });
    };

    const wrapper = document.createElement("div");
    wrapper.className = "bot-message";
    wrapper.appendChild(button);
    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }
});
