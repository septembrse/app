
import json
import pandas as pd

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

# Diversity data, so that we can get names
diversity = pd.read_excel("diversity.xlsx")

# Drive links, so that we can add links to write and read presentation
# files
links = pd.read_excel("Drive Links.xlsx")

# Zoom links, so that we can add the zoom links for each day
# (there is a different zoom link each day)
zoom = pd.read_excel("Zoom links.xlsx")


def get_name(email):
    rows = diversity.index[diversity['Email address'] == email].tolist()

    if len(rows) == 0:
        return None
    else:
        return diversity.loc[rows[-1]]["What is your full name?"]


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
        current = f"{current}, {presentation}"
        tickets.at[idx, "presentations"] = current

# Create the JSON file that is needed for the JS conference info system
attendees = []

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
                "presentations": p}

    attendees.append(attendee)

# Now read all of the google drive links and add them to
# the json
drive_links = {}

for i in range(0, len(links)):
    link = links.loc[i]

    drive_links[link["ID"]] = {"read": link["RO_link"],
                               "write": link["RW_link"]}


# Now read all of the zoom links and add them to the json
zoom_links = {}

for i in range(0, len(zoom)):
    link = zoom.loc[i]

    zoom_links[link["Date"].date().isoformat()] = link["Link"]

with open("passwords.json", "w") as FILE:
    json.dump({"attendees": attendees,
               "drive_links": drive_links,
               "zoom_links": zoom_links,
               "god_key": get_god_key()}, FILE)

print(tickets)

tickets.to_excel("Tickets.xlsx", index=False)
