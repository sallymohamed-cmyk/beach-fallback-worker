export const CONFIG = {
    /*
     * Operating Modes
     *
     * automatic
     *   - Uses the configured season and opening hours.
     *   - Future KV/Telegram overrides are also applied.
     *
     * open
     *   - Forces the ordering site to remain open.
     *   - Ignores season and opening hours.
     *
     * closed
     *   - Forces the ordering site to remain closed.
     *   - Customers are shown the "We're Closed" page.
     *
     * maintenance
     *   - Forces the maintenance page to be shown.
     *   - Used during deployments, outages or planned maintenance.
     *
     * Future:
     *   - The value will be stored in Cloudflare KV and controlled
     *     remotely via Telegram or an admin portal without requiring
     *     a deployment.
     */

    operation: {
        mode: "automatic" //automatic or closed or open
    },

    season: {
        enabled: true,
        start: "2026-05-15",
        end: "2026-09-30"
    },

    openingHours: {
        enabled: true,
        timezone: "Africa/Cairo",
        open: "08:00",
        close: "sunset"
    }
};