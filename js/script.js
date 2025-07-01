// Reveal Main Message with Confetti on Heart Tap
document.getElementById("revealBtn").addEventListener("click", () => {
  document.querySelector(".intro").classList.add("hidden");
  document.getElementById("mainMessage").classList.remove("hidden");

  confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
});

// Reveal Image and Compliments
document.getElementById("revealImageBtn").addEventListener("click", () => {
  const revealedImg = document.getElementById("revealedImage");
  const surpriseSection = document.getElementById("surpriseSection");

  if (revealedImg.classList.contains("hidden")) {
    revealedImg.classList.remove("hidden");

    // Show compliment cards directly after image
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

// Floating Cake Emojis
const floatingEmojis = ['🎂', '💝', '🎉', '💖', '🐥'];
setInterval(() => {
  const emoji = document.createElement('div');
  emoji.textContent = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
  emoji.style.position = 'fixed';
  emoji.style.left = Math.random() * 100 + 'vw';
  emoji.style.top = '100vh';
  emoji.style.fontSize = (Math.random() * 24 + 20) + 'px';
  emoji.style.opacity = 0.8;
  emoji.style.zIndex = '9999';
  emoji.style.pointerEvents = 'none';
  emoji.style.animation = 'floatUp 6s linear forwards';
  document.body.appendChild(emoji);
  setTimeout(() => emoji.remove(), 6000);
}, 300);
// Smooth, responsive emoji trail
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

// Smoother, responsive tracking (detects even small movement)
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

  if (distance > 1) { // ~1px movement
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
