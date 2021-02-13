from werkzeug.security import generate_password_hash

from app.models import db, Location
from faker import Faker
fake = Faker()
import json
from random import randint

# Adds a demo location, you can add other locations here if you want
# Address data cloned from this gibub: https://github.com/EthanRBrown/rrad
def seed_locations():
  with open('/home/tony/appacademy/capstone/dronest/app/seeds/addresses-us-all.json') as json_file:
    data = json.load(json_file)
    l = set()
    while len(l) < 200:
      l.add(randint(0, len(data['addresses'])))
    for i in range(len(data['addresses'])):
      if i in l:
        add = data['addresses'][i]
        try:
          city = add['city']
        except:
          city = 'Unknown'
        state = add['state']
        zipCode = add['postalCode']
        latitude = add['coordinates']['lat']
        longitude = add['coordinates']['lng']

        demo = Location(city=city, state=state, zipCode=zipCode, latitude=latitude, longitude=longitude, country="US")
        db.session.add(demo)        

  # for i in range(100):
  #   add = fake.address()
  #   city = add.split('\n')[1]
  #   city = city[:-10]
  #   demo = Location(city=city, state=add[-8:-6], country="US")
  #   db.session.add(demo)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_locations():
  db.session.execute('TRUNCATE locations;')
  db.session.commit()
