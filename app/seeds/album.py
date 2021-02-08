from app.models import db, Album, User
from .data import albums

# Adds a demo location, you can add other locations here if you want
def seed_albums():

  users = User.query.all()
  for i in range(len(users)):
    al = Album(name="Generic", userId = users[i].id)
    db.session.add(al)

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
