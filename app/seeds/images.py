from werkzeug.security import generate_password_hash

from app.models import db, Image
from faker import Faker
import random
fake = Faker()

# Adds a demo location, you can add other locations here if you want
def seed_images():

  demo = Image(postId=1, imgUrl="http://fantsy-app.s3.amazonaws.com/EzgdmaCQuT84bgDL4fhXZS.jpg")
  db.session.add(demo)

  demo2 = Image(postId=2, imgUrl="http://fantsy-app.s3.amazonaws.com/31531798_10211165893878446_1339226057647063040_n.jpg")
  db.session.add(demo2)

  demo3 = Image(postId=3, imgUrl="http://fantsy-app.s3.amazonaws.com/0bvu6xbvqk331.jpg")
  db.session.add(demo3)

  demo4 = Image(postId=4, imgUrl="http://fantsy-app.s3.amazonaws.com/13906815_10206659420339424_2444900124464175857_n.jpg")
  db.session.add(demo4)

  demo5 = Image(postId=5, imgUrl="http://fantsy-app.s3.amazonaws.com/unnamed.jpg")
  db.session.add(demo5)
  db.session.commit()


    for i in range(30):
      postId = random.randint(1, 30)
      imgUrl = fake.image_url()
      fakeImages = Image(postId=postId, imgUrl=imgUrl)
      db.session.add(fakeImages)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_images():
    db.session.execute('TRUNCATE images;')
    db.session.commit()
