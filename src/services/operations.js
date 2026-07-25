/*
 * This service is the single source of truth for the Worker's operating state.
 *
 * All decisions about whether the ordering site is:
 *   - Open
 *   - Closed
 *   - In maintenance
 *   - Out of season
 *   - Outside opening hours
 *   - Manually overridden
 *
 * are made here.
 *
 * index.js should never contain business rules; it should only react to
 * the operating state returned by this service.
 */
export function determineOperatingMode(config) {
    // Manual override always wins
    if (config.operation?.mode === "maintenance") {
        return "maintenance";
    }

    if (config.operation?.mode === "closed") {
        return "closed";
    }

    if (config.operation?.mode === "open") {
        return "open";
    }

    // Otherwise follow the automatic schedule
    return "automatic";
}