from app.models import db, Equipment


# Adds a demo location, you can add other locations here if you want
def seed_equipment():

  eqps = [
    "Magestic 1",       #1
    "Magestic 2",       #2
    "Magestic Mini 1",  #3
    "Magestic Mini 2",  #4
    "Aspire 1",         #5
    "Aspire 2",         #6
    "Epic 1",           #7
    "Epic 2",           #8
    "Epic 3",           #9
    "Unknown",          #99
  ]

  for i in range(len(eqps)):
    eqp = Category(name=eqps[i])
    db.session.add(eqp)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_equipment():
    db.session.execute('TRUNCATE "Equipment";')
    db.session.commit()
