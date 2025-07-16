function generateRandomString(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function redirectToSpotifyLogin() {
  const clientId = "YOUR_SPOTIFY_CLIENT_ID";  // replace this
  const redirectUri = "https://developerprajjal.github.io/birthday-for-oishi/callback.html";
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await sha256(codeVerifier);

  localStorage.setItem("code_verifier", codeVerifier);

  const scope = "user-read-private user-read-email playlist-read-private";
  const authUrl = "https://accounts.spotify.com/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  window.location.href = authUrl;
}
