
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
youtube = pd.read_excel("YouTube Links.xlsx")

tz = tzlocal.get_localzone()

presentation_to_session = {}

now = datetime.datetime.now()

events = json.load(open("../src/submissions.json", "r"))


def get_youtube_link(id):
    for i in range(0, len(youtube)):
        y = youtube.loc[i]

        if y["ID"] == id:
            link = y["Link"]

            if pd.isna(link):
                link = None

            print(f"{id} == {link}")
            return link

    return None


for i in range(0, len(data)):
    d = data.loc[i]

    session_id = d["Session ID"]

    starts = tz.localize(d["Starts"]).isoformat()
    ends = tz.localize(d["Ends"]).isoformat()

    event = None
    summary = None

    if d["Starts"] > datetime.date.fromisoformat("2021-09-04"):
        event = Event()
        event.add('uid', session_id)
        summary = d["Title"]
        event.add("organizer", "Society of Research Software Engineering")
        event.add("dtstart", tz.localize(d["Starts"]).astimezone(pytz.utc))
        event.add("dtend", tz.localize(d["Ends"]).astimezone(pytz.utc))
        event.add("dtstamp", now)
        event.add("location", f"https://septembrse.github.io/#/session/{session_id}")

    presentations = []

    for c in ["Content1", "Content2", "Content3", "Content4", "Content5"]:
        if not pd.isna(d[c]):
            presentations.append(d[c])
            presentation_to_session[d[c]] = session_id

            try:
                e = events[d[c]]
            except Exception:
                e = None
                print(f"Cannot find event {d[c]}")

            if e:
                s = Event()
                summary = f"{summary}\n\n{d[c]}: {e['title']}"

    if event:
        event.add("summary", summary)
        calendar.add_component(event)

    youtube_link = get_youtube_link(d["Session ID"])

    session = {"id": d["Session ID"],
               "title": d["Title"],
               "details": None,
               "starts": starts,
               "ends": ends,
               "youtube": youtube_link,
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
