
import json
import pandas as pd
import tzlocal

sessions = []

# 2021-07-26T09:26:21Z

data = pd.read_excel("Timetable.xlsx")

tz = tzlocal.get_localzone()

for i in range(0, len(data)):
    d = data.loc[i]

    starts = tz.localize(d["Starts"]).isoformat()
    ends = tz.localize(d["Ends"]).isoformat()

    session = {"id": d["Session ID"],
               "title": d["Title"],
               "details": None,
               "starts": starts,
               "ends": ends}

    sessions.append(session)

# I am assuming that the sessions are already sorted from
# earliest to latest - should add a sort function later

sessions_file = "../src/sessions.json"

with open(sessions_file, "w") as FILE:
    json.dump(sessions, FILE)
