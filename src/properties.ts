function getProperties() {
    const properties = PropertiesService.getScriptProperties();
    const CALENDAR_ID = properties.getProperty("CALENDAR_ID");
    const SHEET_ID = properties.getProperty("SHEET_ID");
    const DISCORD_WEBHOOK_URL = properties.getProperty("DISCORD_WEBHOOK_URL");
    if (CALENDAR_ID && SHEET_ID && DISCORD_WEBHOOK_URL) {
        return {
            CALENDAR_ID: CALENDAR_ID,
            SHEET_ID: SHEET_ID,
            DISCORD_WEBHOOK_URL: DISCORD_WEBHOOK_URL
        };
    }
    return null;
  }