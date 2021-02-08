from app.models import db, Media
from faker import Faker
import random
fake = Faker()
from .data import mediadata


# Adds a demo location, you can add other locations here if you want
def seed_media():

  # demo = Media(postId=1, mediaUrl="http://fantsy-app.s3.amazonaws.com/EzgdmaCQuT84bgDL4fhXZS.jpg")
  # db.session.add(demo)

  # demo2 = Media(postId=2, mediaUrl="http://fantsy-app.s3.amazonaws.com/31531798_10211165893878446_1339226057647063040_n.jpg")
  # db.session.add(demo2)

  # demo3 = Media(postId=3, mediaUrl="http://fantsy-app.s3.amazonaws.com/0bvu6xbvqk331.jpg")
  # db.session.add(demo3)

  # demo4 = Media(postId=4, mediaUrl="http://fantsy-app.s3.amazonaws.com/13906815_10206659420339424_2444900124464175857_n.jpg")
  # db.session.add(demo4)

  # demo5 = Media(postId=5, mediaUrl="http://fantsy-app.s3.amazonaws.com/unnamed.jpg")
  # db.session.add(demo5)

  for i in range(len(mediadata)):
    media = Media(postId=i+1, mediaUrl=mediadata[i]["url"])
    db.session.add(media)

  db.session.commit()


  # for i in range(30):
  #   postId = random.randint(1, 30)
  #   mediaUrl = fake.image_url()
  #   fakeImages = Media(postId=postId, mediaUrl=mediaUrl)
  #   db.session.add(fakeImages)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_media():
    db.session.execute('TRUNCATE "Media";')
    db.session.commit()
