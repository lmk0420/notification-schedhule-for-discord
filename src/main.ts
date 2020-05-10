function createTrigger() {
  const properties = getProperties()
  if (!properties) {
    return
  }

  const events = getEventToday(new Date());
  if (!events || events.length == 0) {
    return
  }
  
  const trigerIds = events.map(e => {
    const triggerStartTime = e.getStartTime();
    triggerStartTime.setMinutes(triggerStartTime.getMinutes() - 30);
    return [ScriptApp
      .newTrigger("doDiscordWebhook")
      .timeBased()
      .at(triggerStartTime)
      .create()
      .getUniqueId()];
  });
  const sheet = SpreadsheetApp.openById(properties.SHEET_ID);
  const row = trigerIds.length;
  sheet.getSheets()[0].getRange(1, 1, row, 1).setValues(trigerIds);
}

function doDiscordWebhook() {
  const properties = getProperties()
  if (!properties) {
    return
  }

  const now = new Date();
  const upper = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 30);
  const events = getEventToday(now)
  if (!events) {
    return
  }
  const notifyEvents = events.filter(e =>
    ((e.getStartTime().getTime() <= upper.getTime())
    && (e.getStartTime().getTime() >= now.getTime()))
  );

  const creators = notifyEvents.map(e => e.getCreators());
  const content = `${creators.join(", ")}さんが約30分後に来ます`;
  const res = UrlFetchApp.fetch(properties.DISCORD_WEBHOOK_URL, {
    method: "post",
    payload: {
      "content": content
    }
  });

  console.log(res)
}

function deleteUsedTrigger() {
  const properties = getProperties()
  if (!properties) {
    return
  }

  const range = SpreadsheetApp
    .openById(properties.SHEET_ID)
    .getDataRange()
  const data = range.getValues();
  const triggers = ScriptApp.getProjectTriggers()
  data.forEach(d => {
    const trigger = triggers.find(t => t.getUniqueId() === d[0]);
    if (trigger) {
      ScriptApp.deleteTrigger(trigger);
    }
  })
  range.clearContent();
}

function getEventToday(date: Date) {
  const properties = getProperties()
  if (!properties) {
    return
  }
  return CalendarApp
    .getCalendarById(properties.CALENDAR_ID)
    .getEventsForDay(date);
}