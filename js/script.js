// Reveal Main Message with Confetti and Start Music
document.getElementById("revealBtn").addEventListener("click", () => {
  // Hide intro, show main message
  document.querySelector(".intro").classList.add("hidden");
  document.getElementById("mainMessage").classList.remove("hidden");

  // 🎶 Start background music on interaction
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch((e) => {
      console.warn("Autoplay blocked:", e);
    });
  }

  // 🎉 Confetti burst
  confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
});

// Reveal Image and Compliments
document.getElementById("revealImageBtn").addEventListener("click", () => {
  const revealedImg = document.getElementById("revealedImage");
  const surpriseSection = document.getElementById("surpriseSection");

  if (revealedImg.classList.contains("hidden")) {
    revealedImg.classList.remove("hidden");

    // Show compliment cards shortly after image is revealed
    setTimeout(() => {
      surpriseSection.classList.remove("hidden");
    }, 500);
  }
});

// Reveal Letters and Duckling Dance
document.getElementById("openEnvelope").addEventListener("click", () => {
  document.getElementById("letters").classList.remove("hidden");
  document.getElementById("ducklingDance").classList.remove("hidden");
});

// Floating Cake Emojis (slow upward effect)
const floatingEmojis = ['🎂', '💝', '🎉', '💖', '🐥'];
setInterval(() => {
  const emoji = document.createElement('div');
  emoji.textContent = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
  emoji.style.position = 'fixed';
  emoji.style.left = Math.random() * 100 + 'vw';
  emoji.style.top = '100vh';
  emoji.style.fontSize = (Math.random() * 18 + 14) + 'px';
  emoji.style.opacity = 0.6;
  emoji.style.zIndex = '9999';
  emoji.style.pointerEvents = 'none';
  emoji.style.transition = 'transform 6s linear, opacity 6s ease-out';
  document.body.appendChild(emoji);

  requestAnimationFrame(() => {
    emoji.style.transform = 'translateY(-120vh)';
    emoji.style.opacity = '0';
  });

  setTimeout(() => emoji.remove(), 6000);
}, 400);

// Trail Emoji Logic on Cursor/Touch Move
const trailEmojis = ['💗', '🎂', '🎉', '🎈', '💖'];

function createTrailEmoji(x, y) {
  const emoji = document.createElement("div");
  emoji.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
  emoji.className = "emoji-trail";
  emoji.style.left = x + "px";
  emoji.style.top = y + "px";

  document.body.appendChild(emoji);

  requestAnimationFrame(() => {
    emoji.style.opacity = "0";
    emoji.style.transform += " translateY(-10px)";
  });

  setTimeout(() => emoji.remove(), 800);
}

let lastX = null;
let lastY = null;

function shouldSpawn(x, y) {
  if (lastX === null || lastY === null) {
    lastX = x;
    lastY = y;
    return true;
  }

  const dx = x - lastX;
  const dy = y - lastY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 2) {
    lastX = x;
    lastY = y;
    return true;
  }

  return false;
}

function handleMove(e) {
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);

  if (x && y && shouldSpawn(x, y)) {
    createTrailEmoji(x, y);
  }
}

window.addEventListener("mousemove", handleMove);
window.addEventListener("touchmove", handleMove);
const gameLauncher = document.getElementById("gameLauncher");
const duckGameModal = document.getElementById("duckGameModal");
const startGameBtn = document.getElementById("startGameBtn");
const closeGameBtn = document.getElementById("closeGameBtn");
const gameArea = document.getElementById("gameArea");
const scoreCounter = document.getElementById("scoreCounter");

let score = 0;
let gameInterval = null;

gameLauncher.addEventListener("click", () => {
  duckGameModal.classList.remove("hidden");
});

closeGameBtn.addEventListener("click", () => {
  duckGameModal.classList.add("hidden");
  clearInterval(gameInterval);
  gameArea.innerHTML = "";
  score = 0;
  scoreCounter.textContent = score;
});

startGameBtn.addEventListener("click", () => {
  score = 0;
  scoreCounter.textContent = score;
  gameArea.innerHTML = "";

  gameInterval = setInterval(() => {
    const duck = document.createElement("div");
    duck.className = "duckling";
    duck.textContent = "🐥";
    duck.style.left = Math.random() * 200 + "px";
    duck.style.top = Math.random() * 200 + "px";

    duck.addEventListener("click", () => {
      score++;
      scoreCounter.textContent = score;
      duck.remove();
    });

    gameArea.appendChild(duck);

    setTimeout(() => {
      duck.remove();
    }, 1000);

    if (score >= 10) {
      clearInterval(gameInterval);
      document.getElementById("gameSuccess").classList.remove("hidden");
confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
document.getElementById("gameSuccess").scrollIntoView({ behavior: "smooth" });
      duckGameModal.classList.add("hidden");
      gameArea.innerHTML = "";
    }
  }, 800);
});

