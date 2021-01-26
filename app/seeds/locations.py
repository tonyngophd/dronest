from werkzeug.security import generate_password_hash

from app.models import db, Location
from faker import Faker
fake = Faker()

# Adds a demo location, you can add other locations here if you want
def seed_locations():

    for i in range(30):
      add = fake.address()
      city = add.split('\n')[1]
      city = city[:-10]
      demo = Location(city=city, state=add[-8:-6], country="US")
      db.session.add(demo)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_locations():
    db.session.execute('TRUNCATE locations;')
    db.session.commit()
