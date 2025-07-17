// login.js
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function redirectToSpotifyLogin() {
  const clientId = "9d4c5c3068574999b5ce2dea3bf5db54";
  const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/callback.html";
  const scope = "user-top-read";

  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  localStorage.setItem("code_verifier", codeVerifier);

  const args = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  console.log("🌐 Redirecting to Spotify with:", args.toString());
  window.location = `https://accounts.spotify.com/authorize?${args.toString()}`;
}

// This runs ONLY when Spotify redirects back to our site
window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  if (code) {
    console.log("✅ Authorization code received from Spotify:", code);

    const codeVerifier = localStorage.getItem("code_verifier");
    console.log("📦 Code Verifier from storage:", codeVerifier);

    try {
      const res = await fetch("https://melody-backend-7vmo.onrender.com/api/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          redirect_uri: "https://developerprajjal.github.io/birthday-for-oishi/callback.html",
          code_verifier: codeVerifier,
        }),
      });

      const data = await res.json();
      console.log("🎉 Token Exchange Response:", data);
      if (data.access_token) {
        alert("Login successful! You can now generate a playlist.");
        // store token for future use if needed
        localStorage.setItem("spotify_token", data.access_token);
      } else {
        alert("Something went wrong during token exchange.");
      }
    } catch (err) {
      console.error("❌ Error exchanging token:", err);
    }
  } else {
    console.log("ℹ️ No code found in URL.");
  }
});
