
import json
import pandas as pd
import glob
import re

from create_passwords import generate_password, get_god_key

# Read the input data

# The main ticketing spreadsheet - contains everything
tickets = pd.read_excel("Tickets.xlsx", converters={"password": str,
                                                    "name": str,
                                                    "presentations": str},
                        index_col=None)

for col in tickets.columns:
    if col.startswith("Unnamed"):
        tickets = tickets.drop(columns=col)

# everyone who has bought a ticket
purchased_tickets = pd.read_excel("Email addresses of ticket holders.xlsx")

# All of the sessions associated with someone's email address
submissions = pd.read_csv("sessions_and_emails.tsv", delimiter="\t")

# All of the extra sessions associated with someone's email address
extras = pd.read_excel("Extra Presentations.xlsx")

# Diversity data, so that we can get names
diversity = pd.read_excel("Presenter Details and Diversity Form (Responses).xlsx")

# Drive links, so that we can add links to write and read presentation
# files
links = pd.read_excel("Drive Links.xlsx")

# Zoom links, so that we can add the zoom links for each day
# (there is a different zoom link each day)
zoom = pd.read_excel("Zoom links.xlsx")

# Extra zoom links - these are when a parallel session needs its
# own zoom link
extra_zoom = pd.read_excel("Extra Zoom links.xlsx")

# Slido links, so that we can add the slido links for each
# session (there is one per session)
slido = pd.read_excel("Slido links.xlsx")

# workshop form links so that we can provide sign-up pages for workshops
wshop_forms = pd.read_excel("Workshop Requirements.xlsx")

# all of the workshop responses
wshop_responses = {}

for wshop in glob.glob("workshop_responses/*.xlsx"):
    m = re.search(r"(S\d\d\d\d)", wshop)

    if (m):
        wshop_responses[m.group(0)] = pd.read_excel(wshop)

# The gather.town link
gather_link = open("gathertown_link.txt", "r").readline().lstrip().rstrip()


def clean(s):
    if pd.isna(s) or s is None:
        return None
    else:
        return str(s).strip()


def clean_and_split(t, sep=","):
    if pd.isna(t) or t is None:
        return None
    else:
        s = clean(t)

        parts = s.split(sep)

        s = []

        for part in parts:
            s.append(clean(part))

        return s


def clean_int(s):
    s = clean(s)

    if (s):
        return int(float(s))
    else:
        return s


def get_name(email):
    rows = diversity.index[diversity['Email address'] == email].tolist()

    if len(rows) == 0:
        return None
    else:
        return diversity.loc[rows[-1]]["What is your full name?"]


def get_affiliation(email):
    rows = diversity.index[diversity['Email address'] == email].tolist()

    if len(rows) == 0:
        return None
    else:
        return diversity.loc[rows[-1]]["What is your institution or affiliation?"]


def get_row_in_tickets(email):
    rows = tickets.index[tickets["email"] == email].tolist()

    if len(rows) == 0:
        return None
    elif len(rows) > 1:
        raise SystemError(f"Too many rows for {email}")
    else:
        return rows[0]


# Go through all of the tickets that exist and make sure that
# we generate missing passwords (or the same passwords). Also
# fill in missing names
for i in range(0, len(tickets)):
    email = tickets.loc[i]["email"]

    current_password = tickets.loc[i]["password"]
    new_password = generate_password()

    if pd.isna(current_password):
        tickets.at[i, "password"] = new_password
    elif current_password != new_password:
        raise ValueError(f"Disagreement in password for {email}")

    current_name = tickets.loc[i]["name"]
    new_name = get_name(email)

    if new_name is not None and new_name != current_name:
        tickets.at[i, "name"] = new_name


# Now go through all people who have bought tickets and make sure that they
# have been added to this spreadsheet
for i in range(0, len(purchased_tickets)):
    email = purchased_tickets.loc[i]["Email"]
    idx = get_row_in_tickets(email)

    if idx is None:
        tickets = tickets.append({"email": email,
                                  "password": generate_password(),
                                  "ticket": "full",
                                  "name": get_name(email)},
                                 ignore_index=True)
    else:
        # make sure that they are recorded as having bought a ticket
        ticket_type = tickets.at[i, "ticket"]

        if ticket_type == "day":
            tickets.at[idx, "ticket"] = "general"


# Go through all of the emails of people who made submissions and make
# sure that they are in the main spreadsheet - if not, then add them.
# Also add their sessions to the tickets spreadsheet
for i in range(0, len(submissions)):
    submission = submissions.loc[i]
    email = submission["email"]

    idx = get_row_in_tickets(email)

    if idx is None:
        tickets = tickets.append({"email": email,
                                  "password": generate_password(),
                                  "ticket": "day",
                                  "name": get_name(email)},
                                 ignore_index=True)

        idx = get_row_in_tickets(email)

    presentation = submission["id"]

    current = tickets.loc[idx]["presentations"]

    if pd.isna(current):
        current = presentation
        tickets.at[idx, "presentations"] = current
    elif current.find(presentation) == -1:
        current = f"{current},{presentation}"
        tickets.at[idx, "presentations"] = current


# Go through all of the emails of people who involved in extra sessions and
# make sure that they are in the main spreadsheet - if not, then add them.
# Also add their sessions to the tickets spreadsheet
for i in range(0, len(extras)):
    submission = extras.loc[i]
    emails = clean_and_split(submission["Presenter"])

    if emails:
        for email in emails:
            idx = get_row_in_tickets(email)

            if idx is None:
                tickets = tickets.append({"email": email,
                                          "password": generate_password(),
                                          "ticket": "day",
                                          "name": get_name(email)},
                                          ignore_index=True)

                idx = get_row_in_tickets(email)

            presentation = submission["ID"]

            current = tickets.loc[idx]["presentations"]

            if pd.isna(current):
                current = presentation
                tickets.at[idx, "presentations"] = current
            elif current.find(presentation) == -1:
                current = f"{current},{presentation}"
                tickets.at[idx, "presentations"] = current


# Create the JSON file that is needed for the JS conference info system
attendees = []

all_emails = {}

for i in range(0, len(tickets)):
    ticket = tickets.loc[i]

    p = ticket["presentations"]

    if pd.isna(p):
        p = []
    else:
        p = p.split(",")

    attendee = {"email": ticket["email"],
                "password": ticket["password"],
                "ticket": ticket["ticket"],
                "name": clean(ticket["name"]),
                "affiliation": clean(get_affiliation(ticket["email"])),
                "presentations": p}

    attendees.append(attendee)
    all_emails[ticket["email"]] = 1

# Now read all of the google drive links and add them to
# the json
drive_links = {}

for i in range(0, len(links)):
    link = links.loc[i]

    drive_links[link["ID"]] = {"read": clean(link["RO_link"]),
                               "write": clean(link["RW_link"])}

# Now read all of the zoom links and add them to the json
zoom_links = {}

for i in range(0, len(zoom)):
    link = zoom.loc[i]
    zoom_links[link["Date"].date().isoformat()] = clean(link["Link"])

# Now read all of the extra zoom links and add them to the json
extra_zoom_links = {}

for i in range(0, len(extra_zoom)):
    link = extra_zoom.loc[i]
    extra_zoom_links[link["ID"]] = clean(link["Link"])

# Now read all of the slido links and add them to the json
slido_links = {}

for i in range(0, len(slido)):
    link = slido.loc[i]

    slido_links[link["ID"]] = clean(link["Link"])

# Now read all of the form links and add them to the json
wshop_form_links = {}

for i in range(0, len(wshop_forms)):
    link = wshop_forms.loc[i]
    ID = link["ID"]
    max_attendees = clean_int(link["max_attendees"])

    # get the emails of everyone who has registered
    try:
        responses = wshop_responses[ID]
    except KeyError:
        responses = None
        print(f"No responses for workshop {ID}")

    signed_up = []
    unsuccessful = []

    if responses is not None:
        seen_emails = {}

        for j in range(0, len(responses)):
            email = responses.loc[j]["Email address"]

            if email in seen_emails:
                print(f"\nProblem with workshop {ID}")
                print(f"Duplicate email {email}")
            elif email not in all_emails:
                print(f"\nProblem with workshop {ID}")
                print(f"{email} has registered, but they don't have a ticket!")
            elif max_attendees is not None and max_attendees <= len(signed_up):
                print(f"\nProblem with workshop {ID}")
                print(f"Too many sign ups! {email} cannot join!")
                unsuccessful.append(email)
            else:
                signed_up.append(email)

            seen_emails[email] = 1

    wshop_form_links[ID] = {
        "link": clean(link["form_link"]),
        "max_attendees": max_attendees,
        "signed_up": signed_up,
        "unsuccessful": unsuccessful}


with open("passwords.json", "w") as FILE:
    json.dump({"attendees": attendees,
               "drive_links": drive_links,
               "zoom_links": zoom_links,
               "extra_zoom_links": extra_zoom_links,
               "slido_links": slido_links,
               "wshop_form_links": wshop_form_links,
               "gather_link": gather_link,
               "god_key": get_god_key()}, FILE)

#print(tickets)

tickets.to_excel("Tickets.xlsx", index=False)
