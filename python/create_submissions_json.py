
import json

import csv

submissions = {}


def get_format(id):
    if id.startswith("T"):
        return "Talk"
    elif id.startswith("P"):
        return "Poster"
    elif id.startswith("W"):
        return "Walkthrough"
    elif id.startswith("S"):
        return "Workshop"
    elif id.startswith("L"):
        return "Panel"
    elif id.startswith("D"):
        return "Discussion"
    elif id.startswith("K"):
        return "Keynote"
    else:
        return "Unknown"


with open("accepted_submissions.tsv") as FILE:
    reader = csv.DictReader(FILE, delimiter="\t")

    for a in reader:
        submission = {
            "title": a["title"],
            "abstract": a["abstract"],
            "name": a["name"],
            "institution": a["institution"],
            "format": get_format(a["id"])
        }

        submissions[a["id"]] = submission

with open("../src/submissions.json", "w") as FILE:
    json.dump(submissions, FILE)
