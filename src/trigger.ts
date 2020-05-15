/*
* Create a trigger that fetches an appointment from the calendar every day at 4-5 am 
* and executes doDiscordWebhook() 30 minutes before the appointment start time.
*/
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

/*
* Delete all triggers described in the spreadsheet
*/
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