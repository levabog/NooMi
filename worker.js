// NooMi Worker: serves the site and hands out short-lived Cloudflare TURN credentials at /api/turn.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/turn") {
      const empty = () => new Response("[]", { headers: { "content-type": "application/json", "cache-control": "no-store" } });
      if (!env.TURN_KEY_ID || !env.TURN_API_TOKEN) return empty();
      try {
        const r = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`, {
          method: "POST",
          headers: { Authorization: `Bearer ${env.TURN_API_TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ ttl: 86400 })
        });
        if (!r.ok) return empty();
        return new Response(await r.text(), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
      } catch (e) { return empty(); }
    }
    return env.ASSETS.fetch(request);
  }
};
