from app.models import db, Equipment


# Adds a demo location, you can add other locations here if you want
def seed_equipment():

  eqps = [
    {"name": "Magestic Mini 1", "level": 1}, 
    {"name": "Magestic Mini 2", "level": 1}, 
    {"name": "Magestic 1", "level": 2}, 
    {"name": "Magestic 2", "level": 2}, 
    {"name": "Skidium 1", "level": 2}, 
    {"name": "Skidium 2", "level": 2}, 
    {"name": "Aspire 1", "level": 3},
    {"name": "Aspire 2", "level": 3},
    {"name": "Parody 1", "level": 3},
    {"name": "Parody 2", "level": 3},
    {"name": "Epic 1", "level": 4},
    {"name": "Epic 2", "level": 4},
    {"name": "Epic 3", "level": 4},
    {"name": "Unknown", "level": 0},
  ]

  for i in range(len(eqps)):
    eqp = Equipment(name=eqps[i]["name"], level=eqps[i]["level"])
    db.session.add(eqp)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_equipment():
    db.session.execute('TRUNCATE "Equipment";')
    db.session.commit()
