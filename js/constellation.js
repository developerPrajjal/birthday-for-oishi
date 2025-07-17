// js/constellation.js

const canvas = document.getElementById("constellationCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  const stars = [];
  const nameLetters = "OISHI".split("");

  function createStar(x, y, letter) {
    return {
      x,
      y,
      radius: 2 + Math.random() * 2,
      alpha: 0,
      fadeIn: true,
      letter,
    };
  }

  const spacing = canvas.width / (nameLetters.length + 1);
  nameLetters.forEach((char, i) => {
    stars.push(createStar(spacing * (i + 1), 100 + Math.random() * 40, char));
  });

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    stars.forEach((star) => {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffb6f0";
      ctx.fillText(star.letter, star.x, star.y - 15);

      if (star.fadeIn) {
        star.alpha += 0.01;
        if (star.alpha >= 1) star.fadeIn = false;
      } else {
        star.alpha -= 0.005;
        if (star.alpha <= 0.4) star.fadeIn = true;
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }

  drawStars();
}
