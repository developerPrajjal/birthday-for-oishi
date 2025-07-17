document.addEventListener("DOMContentLoaded", () => {
  const chatbotButton = document.getElementById("chatbotLauncher");
  const chatbotContainer = document.getElementById("melodyChatbot");
  const closeChatbotBtn = document.getElementById("closeChatbot");
  const chatWindow = document.getElementById("chatbotBody");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendMsg");

  // Toggle chatbot
  chatbotButton.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    setTimeout(() => chatbotContainer.classList.add("open"), 100);
  });

  closeChatbotBtn.addEventListener("click", () => {
    chatbotContainer.classList.remove("open");
    setTimeout(() => chatbotContainer.classList.add("hidden"), 300);
  });

  // Add message to chat
  function addMessage(sender, text, isHTML = false) {
    const message = document.createElement("div");
    message.className = `${sender}-message`;
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
    const playlistLinks = {
      Happy: {
        message: "Yay! Here's something to keep the joy flowing! 🌈",
        link: "https://www.youtube.com/watch?v=ZbZSe6N_BXs&list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
      },
      Sad: {
        message: "Sending warm hugs... 💗 This playlist might help.",
        link: "https://www.youtube.com/watch?v=hoPugqYMISM&list=PLzAUj-EoS1r4Hlm6EUWzPZvx1WxYAsA0b",
      },
      Chill: {
        message: "Here’s your chill zone playlist. 🎧 Just vibe...",
        link: "https://www.youtube.com/watch?v=5qap5aO4i9A",
      },
      Calm: {
        message: "Take a deep breath... Here’s something soothing. 🌿",
        link: "https://www.youtube.com/watch?v=y3n2PB9p7fI",
      },
      Romantic: {
        message: "For your soft little heart 💘 Enjoy these sweet melodies:",
        link: "https://www.youtube.com/watch?v=JGwWNGJdvx8&list=PLuVWbdCEh2T9JZTy05PTFqPEoR4N04hxY",
      },
    };

    const moodData = playlistLinks[mood];

    addMessage("bot", moodData.message);
    addMessage("bot", `<a href="${moodData.link}" target="_blank" class="playlist-link">🎵 Open Playlist</a>`, true);
  }

  // Manual send
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
