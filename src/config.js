export const CONFIG = {
    maintenanceMode: false,

    openingHours: {
        enabled: true,

        timezone: "Africa/Cairo",

        branches: {
            beach: {
                sunday: { open: "08:00", close: "01:00" },
                monday: { open: "08:00", close: "01:00" },
                tuesday: { open: "08:00", close: "01:00" },
                wednesday: { open: "08:00", close: "01:00" },
                thursday: { open: "08:00", close: "02:00" },
                friday: { open: "08:00", close: "02:00" },
                saturday: { open: "08:00", close: "01:00" }
            }
        }
    }
};