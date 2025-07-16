console.log("✅ callback.js loaded");

window.onload = async function () {
  console.log("🌐 Window loaded");

  // Step 1: Get authorization code from URL
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    console.error("❌ No authorization code found in URL");
    document.body.innerHTML = `
      <h2>Failed to retrieve access token 😢</h2>
      <p>No authorization code found in the URL.</p>
    `;
    return;
  }

  console.log("🟡 Code received from Spotify:", code);

  // Step 2: Get the stored code_verifier from localStorage (from login step)
  const codeVerifier = localStorage.getItem("code_verifier");

  if (!codeVerifier) {
    console.error("❌ No code_verifier found in localStorage.");
    document.body.innerHTML = `
      <h2>Failed to retrieve access token 😢</h2>
      <p>Missing code_verifier. Please retry the login.</p>
    `;
    return;
  }

  try {
    // Step 3: Send POST request to backend to exchange code for access_token
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

    // Step 4: Handle response
    if (!data.access_token) {
      console.error("❌ Token exchange failed:", data);
      document.body.innerHTML = `
        <h2>Failed to retrieve access token 😢</h2>
        <p>${data.error || "Something went wrong."}</p>
      `;
      return;
    }

    console.log("✅ Got access token from backend:", data.access_token);

    // Step 5: Store token and redirect to homepage
    localStorage.setItem("access_token", data.access_token);

    // ✅ Redirect back to main page
    window.location.href = "/birthday-for-oishi/index.html?auth=success";

  } catch (err) {
    console.error("❌ Error during token exchange:", err);
    document.body.innerHTML = `
      <h2>Failed to retrieve access token 😢</h2>
      <p>${err.message || "Unexpected error occurred."}</p>
    `;
  }
};
