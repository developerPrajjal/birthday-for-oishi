document.addEventListener("DOMContentLoaded", () => {
  const chatbotButton = document.getElementById("chatbot-button");
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeChatbotBtn = document.getElementById("close-chatbot");
  const chatWindow = document.getElementById("chat-window");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  // Toggle chatbot
  chatbotButton.addEventListener("click", () => {
    chatbotContainer.style.display = "flex";
    setTimeout(() => chatbotContainer.classList.add("open"), 100);
  });

  closeChatbotBtn.addEventListener("click", () => {
    chatbotContainer.classList.remove("open");
    setTimeout(() => chatbotContainer.style.display = "none", 300);
  });

  // Add message to chat
  function addMessage(sender, text, isHTML = false) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.innerHTML = isHTML ? text : `<p>${text}</p>`;
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
        file: "assets/audio/happy.mp3",
      },
      Sad: {
        message: "Sending warm hugs... 💗 This melody might help.",
        file: "assets/audio/sad.mp3",
      },
      Chill: {
        message: "Here’s your chill zone. 🎧 Just vibe...",
        file: "assets/audio/chill.mp3",
      },
      Calm: {
        message: "Take a deep breath... Here’s something soothing. 🌿",
        file: "assets/audio/calm.mp3",
      },
      Romantic: {
        message: "For your soft little heart 💘 Enjoy this tune:",
        file: "assets/audio/romantic.mp3",
      },
    };

    const selected = moodData[mood];

    addMessage("bot", selected.message);
    addMessage(
      "bot",
      `
      <div class="audio-wrapper">
        <audio controls>
          <source src="${selected.file}" type="audio/mpeg">
          Your browser does not support the audio tag.
        </audio>
      </div>
      `,
      true
    );
  }

  // Fallback for manual text entry
  sendButton.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (text) {
      addMessage("user", text);
      addMessage("bot", "Please select a mood from the buttons above 💖");
      userInput.value = "";
    }
  });

  greetUser(); // Start conversation
});
