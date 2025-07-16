console.log("✅ callback.js loaded");

window.onload = async function () {
  console.log("🌐 Window loaded");

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    console.error("❌ No authorization code found in URL");
    return;
  }

  console.log("🟡 Code received from Spotify:", code);

  // The code_verifier should match what you used in the login flow
  const codeVerifier = localStorage.getItem("code_verifier");
  if (!codeVerifier) {
    console.error("❌ No code_verifier found in localStorage.");
    return;
  }

  try {
    const response = await fetch("https://melody-backend-7vmo.onrender.com/api/exchange-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        codeVerifier: codeVerifier,
        redirectUri: "https://developerprajjal.github.io/birthday-for-oishi/callback.html"
      })
    });

    const data = await response.json();

    if (!data.access_token) {
      console.error("❌ Token exchange failed:", data);
      return;
    }

    console.log("✅ Got access token from backend:", data.access_token);

    // Store token for later use (e.g., playlist generation)
    localStorage.setItem("access_token", data.access_token);

    // OPTIONAL: Redirect to main page or show success UI
    window.location.href = "/birthday-for-oishi/index.html?auth=success";
  } catch (err) {
    console.error("❌ Error during token exchange:", err);
  }
};
