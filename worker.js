export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/generate" && request.method === "POST") {
      const { prompt } = await request.json();
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      return new Response(r.body, {
        status: r.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    return env.ASSETS.fetch(request);
  }
};
