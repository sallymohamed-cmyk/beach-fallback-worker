import { isBranchOpen } from "./hours.js";

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
 */

function isWithinSeason(config) {

    if (!config.season.enabled) {
        return true;
    }

    const today = new Date().toISOString().split("T")[0];

    return (
        today >= config.season.start &&
        today <= config.season.end
    );
}

export function determineOperatingMode(config) {

    // Manual overrides always win.
    switch (config.operation.mode) {

        case "maintenance":
            return {
                mode: "maintenance",
                reason: "Manual maintenance mode"
            };

        case "closed":
            return {
                mode: "closed",
                reason: "Manually closed"
            };

        case "open":
            return {
                mode: "open",
                reason: "Manually forced open"
            };
    }

    // Automatic mode

    if (!isWithinSeason(config)) {
        return {
            mode: "closed",
            reason: "Outside beach season"
        };
    }

    if (!isBranchOpen(config)) {
        return {
            mode: "closed",
            reason: "Outside opening hours"
        };
    }

    return {
        mode: "automatic",
        reason: "Within beach season"
    };
}