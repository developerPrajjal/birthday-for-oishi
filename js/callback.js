console.log("✅ callback.js loaded");

window.onload = async function () {
  console.log("🌐 Window loaded");

  // Try to get the 'code' from URL (with fallback for GitHub Pages)
  let code = null;

  try {
    const params = new URLSearchParams(window.location.search);
    code = params.get("code");
  } catch (err) {
    console.warn("⚠️ URLSearchParams failed, trying manual parsing.");
  }

  // Manual fallback if URLSearchParams fails
  if (!code && window.location.href.includes("?code=")) {
    const query = window.location.href.split("?")[1];
    const pairs = query.split("&");
    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      if (key === "code") {
        code = decodeURIComponent(value);
        break;
      }
    }
  }

  if (!code) {
    console.error("❌ No authorization code found in URL");
    document.body.innerHTML = `
      <h2 style="text-align:center; color: #e74c3c; font-family: sans-serif; margin-top: 50px;">
        Failed to retrieve access token 😢
      </h2>
      <p style="text-align:center; font-family: sans-serif;">
        No authorization code found in the URL.
      </p>
    `;
    return;
  }

  console.log("🟡 Code received from Spotify:", code);

  // Get the code_verifier from localStorage
  const codeVerifier = localStorage.getItem("code_verifier");

  if (!codeVerifier) {
    console.error("❌ No code_verifier found in localStorage.");
    document.body.innerHTML = `
      <h2 style="text-align:center; color: #e67e22; font-family: sans-serif; margin-top: 50px;">
        Missing Code Verifier ⚠️
      </h2>
      <p style="text-align:center; font-family: sans-serif;">
        Please restart the login flow from the beginning.
      </p>
    `;
    return;
  }

  // Exchange the code for an access token
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
      document.body.innerHTML = `
        <h2 style="text-align:center; color: #c0392b; font-family: sans-serif; margin-top: 50px;">
          Token exchange failed 😢
        </h2>
        <p style="text-align:center; font-family: sans-serif;">
          Error: ${data.error_description || "Unknown error"}
        </p>
      `;
      return;
    }

    console.log("✅ Got access token from backend:", data.access_token);

    // Save the token for later use
    localStorage.setItem("access_token", data.access_token);

    // Redirect to main page
    window.location.href = "/birthday-for-oishi/index.html?auth=success";

  } catch (err) {
    console.error("❌ Error during token exchange:", err);
    document.body.innerHTML = `
      <h2 style="text-align:center; color: #e74c3c; font-family: sans-serif; margin-top: 50px;">
        Network Error 🚫
      </h2>
      <p style="text-align:center; font-family: sans-serif;">
        Could not reach the backend server.
      </p>
    `;
  }
};
