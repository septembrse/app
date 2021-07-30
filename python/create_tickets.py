
import json
import pandas as pd
import random
import petname
import hashlib

from create_passwords import generate_password

# Read the input data

# The main ticketing spreadsheet - contains everything
tickets = pd.read_excel("Tickets.xlsx", converters={"password": str,
                                                    "name": str})

# everyone who has bought a ticket
purchased_tickets = pd.read_excel("Email addresses of ticket holders.xlsx")

# All of the sessions associated with someone's email address
submissions = pd.read_csv("sessions_and_emails.tsv", delimiter="\t")

# Diversity data, so that we can get names
diversity = pd.read_excel("diversity.xlsx")

# Initalise the random number generators, so that we get
# the same password sequence
petname.random = random.Random(567893203151)
num_random = random.Random(9473171914287)


def generate_password():
    while True:
        password = "%s_%03d" % (petname.generate(2, "_"),
                                num_random.randint(100, 999))

        if password.find("maggot") == -1:
            return password


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
        print("Need to add!")

print(tickets)

raise SystemError("END")

# Go through all of the emails of people who made submissions and make
# sure that they are in the main spreadsheet - if not, then add them
for i in range(0, len(submissions)):
    submission = submissions.loc[i]
    email = submission["email"]

    row_id = main_spreadsheet.index[
                    main_spreadsheet['email'] == email].tolist()

    if len(row_id) == 0:
        # we need to add this person to the ticketing spreadsheet,
        # as a presenter
        print(email)

for i in range(0, num_attendees):
    email = data.loc[i]["Email"]

    ok = False

    while not ok:
        password = "%s_%03d" % (petname.generate(2, "_"),
                                num_random.randint(100, 999))

        if password.find("maggot") == -1:
            ok = True

    df = df.append({"email": email, "password": password}, ignore_index=True)

    if email in attendees:
        raise SystemError("Email clash!")

    attendee = {"password": password,
                "ticket": "full"}

    attendees[email] = attendee

with open("passwords.json", "w") as FILE:
    json.dump(attendees, FILE)


with open("passwords.csv", "w") as FILE:
    print(df)
