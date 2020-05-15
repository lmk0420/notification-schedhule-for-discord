/*
* Get all today's schedule
*/
function getEventToday(date: Date) {
    const properties = getProperties()
    if (!properties) {
      return
    }
    return CalendarApp
      .getCalendarById(properties.CALENDAR_ID)
      .getEventsForDay(date);
}