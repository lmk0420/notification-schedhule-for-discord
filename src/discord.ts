/*
* Get someone scheduled in 30 minutes and notify discord about it
*/
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