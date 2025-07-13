// Elements
const launcher = document.getElementById("chatbotLauncher");
const cloud = document.getElementById("chatbotCloud");
const box = document.getElementById("melodyChatbot");
const closeBtn = document.getElementById("closeChatbot");
const sendBtn = document.getElementById("sendMsg");
const input = document.getElementById("userInput");
const body = document.getElementById("chatbotBody");

// Open chatbot
launcher.addEventListener("click", () => {
  box.classList.remove("hidden");
  cloud.classList.add("hidden");
});

// Close chatbot
closeBtn.addEventListener("click", () => {
  box.classList.add("hidden");
  cloud.classList.remove("hidden");
});

// Send message events
sendBtn.addEventListener("click", handleUserMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") handleUserMessage();
});

// Handle and display messages
function handleUserMessage() {
  const msg = input.value.trim();
  if (!msg) return;
  append("user-message", msg);
  input.value = "";
  setTimeout(() => append("bot-message", "That's cute! 😊"), 500);
}

function append(cls, text) {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}
