document.addEventListener("DOMContentLoaded", () => {
  const chatbotButton = document.getElementById("chatbotLauncher");
  const chatbotContainer = document.getElementById("melodyChatbot");
  const closeChatbotBtn = document.getElementById("closeChatbot");
  const chatWindow = document.getElementById("chatbotBody");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendMsg");
  const bgMusic = document.getElementById("bgMusic"); // 🎵 Background music reference

  let currentChatAudio = null; // 🔊 Track chatbot audio

  // Toggle chatbot
  chatbotButton.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    document.getElementById("chatbotCloud").style.display = "none";
  });

  closeChatbotBtn.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");

    // ▶️ Resume background music when chatbot closes
    if (bgMusic && bgMusic.paused) {
      bgMusic.play();
    }

    // ⏹️ Also stop chatbot audio if open
    if (currentChatAudio && !currentChatAudio.paused) {
      currentChatAudio.pause();
      currentChatAudio.currentTime = 0;
    }
  });

  // Add message to chat
  function addMessage(sender, text, isHTML = false) {
    const message = document.createElement("div");
    message.className = sender === "user" ? "user-message" : "bot-message";
    message.innerHTML = isHTML ? text : text;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Greet with mood options
  function greetUser() {
    addMessage("bot", "Hi Oishi! 💖 I'm your music buddy! How are you feeling today?");
    const moods = [
      { emoji: "😊", label: "Happy" },
      { emoji: "😢", label: "Sad" },
      { emoji: "😌", label: "Chill" },
      { emoji: "🧘‍♀️", label: "Calm" },
      { emoji: "💘", label: "Romantic" },
    ];

    const moodOptions = document.createElement("div");
    moodOptions.className = "mood-options";

    moods.forEach(({ emoji, label }) => {
      const btn = document.createElement("button");
      btn.className = "mood-button";
      btn.textContent = `${emoji} ${label}`;
      btn.addEventListener("click", () => handleMoodSelection(label));
      moodOptions.appendChild(btn);
    });

    chatWindow.appendChild(moodOptions);
  }

  // Mood handler
  function handleMoodSelection(mood) {
    const moodData = {
      Happy: {
        message: "Yay! Here's something to keep the joy flowing! 🌈",
        file: "assets/Ekhon Anek Raat-Anupam Roy.mp3",
      },
      Sad: {
        message: "Sending warm hugs... 💗 This melody might help.",
        file: "assets/Nei Tumi Aager Moto.mp3",
      },
      Chill: {
        message: "Here’s your chill zone. 🎧 Just vibe...",
        file: "assets/Journey Song.mp3",
      },
      Calm: {
        message: "Take a deep breath... Here’s something soothing. 🌿",
        file: "assets/Bondhu-Chol.mp3",
      },
      Romantic: {
        message: "For your soft little heart 💘 Enjoy this tune:",
        file: "assets/Bhalobeshey Basho Naa.mp3",
      },
    };

    const selected = moodData[mood];
    addMessage("bot", selected.message);

    // Create audio player dynamically
    const audioHTML = `
      <div class="audio-wrapper">
        <audio controls id="chatAudio">
          <source src="${selected.file}" type="audio/mpeg">
          Your browser does not support the audio tag.
        </audio>
      </div>
    `;

    addMessage("bot", audioHTML, true);

    setTimeout(() => {
      const audioElement = document.getElementById("chatAudio");

      if (audioElement) {
        // 🔇 Pause background music when chatbot audio plays
        audioElement.addEventListener("play", () => {
          if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
          }

          // Save reference to currently playing chat audio
          currentChatAudio = audioElement;
        });

        // 🔁 Resume BGM when chatbot audio ends
        audioElement.addEventListener("ended", () => {
          if (bgMusic && bgMusic.paused) {
            bgMusic.play();
          }
        });
      }
    }, 100); // Delay to ensure element is added
  }

  // Fallback text input
  sendButton.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (text) {
      addMessage("user", text);
      addMessage("bot", "Please select a mood from the buttons above 💖");
      userInput.value = "";
    }
  });

  greetUser();
});
