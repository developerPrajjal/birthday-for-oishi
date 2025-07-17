// login.js

const backendURL = "https://melody-backend-7vmo.onrender.com";

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
  const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi";
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

  window.location = `https://accounts.spotify.com/authorize?${args.toString()}`;
}

// --- NEW: Check if we were redirected from Spotify with ?code
window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    const codeVerifier = localStorage.getItem("code_verifier");

    if (!codeVerifier) {
      console.error("Missing code_verifier in localStorage");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          code_verifier: codeVerifier,
          redirect_uri: "https://developerprajjal.github.io/birthday-for-oishi",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Your Top Spotify Tracks:");
        console.log(data.playlists); // Array of track info
        // You can inject into chatbot or UI here
      } else {
        console.error("Error from backend:", data.error || data);
      }
    } catch (err) {
      console.error("Network or backend error:", err);
    }
  }
});
