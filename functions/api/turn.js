// Cloudflare Pages Function: hands out short-lived TURN credentials. Secrets live in Pages settings, never in the browser.
export async function onRequestGet({ env }) {
  if (!env.TURN_KEY_ID || !env.TURN_API_TOKEN) return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  const r = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.TURN_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ttl: 86400 })
  });
  if (!r.ok) return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  return new Response(await r.text(), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
