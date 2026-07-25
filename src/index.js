import { CONFIG } from "./config";
import { determineOperatingMode } from "./services/operations.js";


async function sendTelegram(env, message) {
    try {
        await fetch(
            `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: env.TELEGRAM_CHAT_ID,
                    text: message,
                }),
            }
        );
    } catch (err) {
        console.log("Telegram notification failed:", err);
    }
}

export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        //
        // FORCE EVERYONE TO THE MAINTENANCE PAGE
        //
        const operation = determineOperatingMode(CONFIG);

        if (operation.mode === "maintenance") {
            return fetchFallback(request);
        }

        if (operation.mode === "closed") {
            return fetchFallback(request);
        }

        try {

            const originUrl = new URL(request.url);
            originUrl.hostname = "beach-orders.30north.coffee";

            const headers = new Headers(request.headers);

            headers.set("X-Forwarded-Host", "beach.30north.coffee");
            headers.set("X-Forwarded-Proto", "https");

            const originRequest = new Request(originUrl.toString(), {
                method: request.method,
                headers,
                body: request.body,
                redirect: "manual",
            });

            const originResponse = await fetch(originRequest);

            const isDown = await env.STATUS_KV.get("isDown");

            //
            // ORIGIN RETURNED A SERVER ERROR
            //
            if (originResponse.status >= 500) {

                // Count every visitor that sees the fallback page
                //this is commented cos it crashes on free cloudflare
                // const fallbackHits = Number(await env.STATUS_KV.get("fallbackHits") || 0);
                //  await env.STATUS_KV.put("fallbackHits", String(fallbackHits + 1));

                // Only notify once
                if (!isDown) {

                    try {
                        await env.STATUS_KV.put("isDown", "true");
                        await env.STATUS_KV.put("downSince", Date.now().toString());
                    } catch (e) {
                        console.error("Unable to update KV:", e);
                    }

                    await sendTelegram(
                        env,
                        `🚨 Beach Ordering DOWN

Host:
${url.hostname}

Path:
${url.pathname}

HTTP Status:
${originResponse.status}

Time:
${new Date().toLocaleString("en-GB", {
                            timeZone: "Africa/Cairo"
                        })}

Fallback:
ACTIVE`
                    );
                }

                return fetchFallback(request);
            }

            //
            // SITE HAS RECOVERED
            //
            if (isDown) {

                const downSince = Number(await env.STATUS_KV.get("downSince") || Date.now());
                // const fallbackHits = Number(await env.STATUS_KV.get("fallbackHits") || 0);

                const durationMinutes = Math.round((Date.now() - downSince) / 60000);

                await sendTelegram(
                    env,
                    `✅ Beach Ordering RECOVERED

Host:
${url.hostname}

Recovered:
${new Date().toLocaleString("en-GB", {
                        timeZone: "Africa/Cairo"
                    })}

Downtime:
${durationMinutes} minute${durationMinutes === 1 ? "" : "s"}`
                );

                try {
                    await env.STATUS_KV.delete("isDown");
                    await env.STATUS_KV.delete("downSince");
                } catch (e) {
                    console.error("Unable to delete KV:", e);
                }
                // await env.STATUS_KV.delete("fallbackHits");
            }

            return originResponse;

        } catch (err) {

            const isDown = await env.STATUS_KV.get("isDown");

            // Count fallback requests
            //  const fallbackHits = Number(await env.STATUS_KV.get("fallbackHits") || 0);
            //   await env.STATUS_KV.put("fallbackHits", String(fallbackHits + 1));

            if (!isDown) {
                try {
                    await env.STATUS_KV.put("isDown", "true");
                    await env.STATUS_KV.put("downSince", Date.now().toString());
                } catch (e) {
                    console.error("Unable to update KV:", e);
                }

                await sendTelegram(
                    env,
                    `🚨 Beach Ordering DOWN

Host:
${url.hostname}

Path:
${url.pathname}

Reason:
${err.message}

Time:
${new Date().toLocaleString("en-GB", {
                        timeZone: "Africa/Cairo"
                    })}

Fallback:
ACTIVE`
                );
            }
            return fetchFallback(request);
        }
    }
}
function fetchFallback(request) {
    const fallbackUrl = new URL(request.url);
    fallbackUrl.hostname = "static.30north.coffee";

    return fetch(new Request(fallbackUrl.toString(), request));
}