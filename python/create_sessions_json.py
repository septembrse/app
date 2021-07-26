
import json

sessions = []

# 2021-07-26T09:26:21Z

session = {"title": "Committee Meeting 9",
           "details": None,
           "starts": "2021-07-26T10:50:00",
           "ends": "2021-07-26T11:00:00"}

sessions.append(session)


session = {"title": "Committee Meeting 9",
           "details": None,
           "starts": "2021-07-29T11:00:00",
           "ends": "2021-07-29T12:00:00"}

sessions.append(session)

sessions_file = "../src/sessions.json"

with open(sessions_file, "w") as FILE:
    json.dump(sessions, FILE)
