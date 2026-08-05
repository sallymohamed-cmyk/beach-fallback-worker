export function isBranchOpen(config) {

    if (!config.hours.enabled) {
        return true;
    }

    // Current time in Cairo (24-hour format HH:MM)
    const now = new Intl.DateTimeFormat("en-GB", {
        timeZone: config.hours.timezone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).format(new Date());

    return (
        now >= config.hours.open &&
        now < config.hours.close
    );
}