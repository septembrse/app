
import json
import pandas as pd
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
    elif id.startswith("X"):
        return "Special event"
    else:
        return "Unknown"


# load the submissions from the accepted presentations from
# the submissions system
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


# now add in any extra sessions, also any fixes to the
# data from the submissions system
extra_data = pd.read_excel("Extra Presentations.xlsx")
diversity = pd.read_excel("Presenter Details and Diversity Form (Responses).xlsx")


def get_name(email):
    if email is None or pd.isna(email):
        return (None, None)

    for i in range(len(diversity)-1, 0, -1):
        e = diversity.loc[i]["Email address"]

        if e == email:
            return (diversity.loc[i]["What is your full name?"],
                    diversity.loc[i][
                        "What is your institution or affiliation?"])

    print(f"WARNING: Need diversity and inclusion data for {email}")

    return (None, None)


def clean(t):
    if pd.isna(t) or t is None:
        return None
    else:
        return str(t)


for i in range(0, len(extra_data)):
    d = extra_data.loc[i]

    ID = d["ID"]
    email = clean(d["Presenter"])
    title = clean(d["Title"])
    abstract = clean(d["Abstract"])

    (name, institution) = get_name(email)

    if ID in submissions:
        if name:
            submissions[ID]["name"] = name

        if institution:
            submissions[ID]["institution"] = institution

        if title:
            submissions[ID]["title"] = title

        if abstract:
            submissions[ID]["abstract"] = abstract
    else:
        submissions[ID] = {
            "title": title,
            "abstract": abstract,
            "name": name,
            "institution": institution,
            "format": get_format(ID)
        }


with open("../src/submissions.json", "w") as FILE:
    json.dump(submissions, FILE)
