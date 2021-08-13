
import json
import pandas as pd
import tzlocal
import datetime
import pytz
from icalendar import Calendar, Event

sessions = []

# 2021-07-26T09:26:21Z

calendar = Calendar()
calendar.add('prodid', '-//SeptembRSE//calendar//')
calendar.add('version', '2.0')

data = pd.read_excel("Timetable.xlsx")

tz = tzlocal.get_localzone()

presentation_to_session = {}

now = datetime.datetime.now()

#event = Event()
#event.add('uid', "test_event")
#event.add('summary', "Test Event")
#event.add("dtstart", tz.localize(now+datetime.timedelta(hours=1)).astimezone(pytz.utc))
#event.add("dtend", tz.localize(now+datetime.timedelta(hours=2)).astimezone(pytz.utc))
#event.add("dtstamp", now)
#event.add("location", f"https://septembrse.github.io/#/session/N1001")
#
#calendar.add_component(event)

for i in range(0, len(data)):
    d = data.loc[i]

    session_id = d["Session ID"]

    starts = tz.localize(d["Starts"]).isoformat()
    ends = tz.localize(d["Ends"]).isoformat()

    if d["Starts"] > datetime.date.fromisoformat("2021-09-04"):
        event = Event()
        event.add('uid', session_id)
        event.add('summary', d["Title"])
        event.add("dtstart", tz.localize(d["Starts"]).astimezone(pytz.utc))
        event.add("dtend", tz.localize(d["Ends"]).astimezone(pytz.utc))
        event.add("dtstamp", now)
        event.add("location", f"https://septembrse.github.io/#/session/{session_id}")

        calendar.add_component(event)

    presentations = []

    for c in ["Content1", "Content2", "Content3", "Content4", "Content5"]:
        if not pd.isna(d[c]):
            presentations.append(d[c])
            presentation_to_session[d[c]] = session_id

    session = {"id": d["Session ID"],
               "title": d["Title"],
               "details": None,
               "starts": starts,
               "ends": ends,
               "presentations": presentations}

    sessions.append(session)

# I am assuming that the sessions are already sorted from
# earliest to latest - should add a sort function later

sessions_file = "../src/sessions.json"

with open(sessions_file, "w") as FILE:
    json.dump({"sessions": sessions,
               "presentations": presentation_to_session}, FILE)

with open("septembrse.ical", "wb") as FILE:
    FILE.write(calendar.to_ical())
