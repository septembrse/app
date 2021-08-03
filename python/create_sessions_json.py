
import json
import pandas as pd
import tzlocal

sessions = []

# 2021-07-26T09:26:21Z

data = pd.read_excel("Timetable.xlsx")

tz = tzlocal.get_localzone()

presentation_to_session = {}

for i in range(0, len(data)):
    d = data.loc[i]

    session_id = d["Session ID"]

    starts = tz.localize(d["Starts"]).isoformat()
    ends = tz.localize(d["Ends"]).isoformat()

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
