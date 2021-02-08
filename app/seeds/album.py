from app.models import db, Album


# Adds a demo location, you can add other locations here if you want
def seed_albums():

  albums = [
    {"name": "Generic", "userId": 0},
    {"name": "Great City", "userId": 1},
    {"name": "Winter", "userId": 1},
    {"name": "Night Time", "userId": 1},
    {"name": "Skyscraper", "userId": 1},
    {"name": "Solar Panel", "userId": 2},
    {"name": "Night Hunting", "userId": 2},
    {"name": "My Hometown", "userId": 3},
    {"name": "Zen", "userId": 3},
    {"name": "Naturific", "userId": 4},
    {"name": "Beautiful Lakes", "userId": 4},
    {"name": "Trainnnns", "userId": 5},
    {"name": "Love", "userId": 5},
    {"name": "Sunshine", "userId": 1},
    {"name": "Awesome roads", "userId": 6},
    {"name": "Cars", "userId": 7},
    {"name": "Sky Arts", "userId": 8},
    {"name": "Great Mountains", "userId": 9},
  ]

  for i in range(len(albums)):
    al = Album(name=albums[i]["name"], userId = albums[i]["userId"])
    db.session.add(al)


  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_albums():
    db.session.execute('TRUNCATE "Albums";')
    db.session.commit()
