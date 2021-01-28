from werkzeug.security import generate_password_hash

from app.models import db, Image
from faker import Faker
import random
fake = Faker()

# Adds a demo location, you can add other locations here if you want
def seed_images():

  demo = Image(postId=1, imgUrl="https://placeimg.com/210/210")
  db.session.add(demo)

  demo2 = Image(postId=2, imgUrl="https://placeimg.com/211/211")
  db.session.add(demo2)

  demo3 = Image(postId=3, imgUrl="https://placeimg.com/212/212")
  db.session.add(demo3)

  demo4 = Image(postId=4, imgUrl="https://placeimg.com/214/213")
  db.session.add(demo4)

  demo5 = Image(postId=5, imgUrl="https://placeimg.com/215/215")
  db.session.add(demo5)
  db.session.commit()


    # for i in range(30):
    #   postId = random.randint(1, 30)
    #   imgUrl = fake.image_url()
    #   fakeImages = Image(postId=postId, imgUrl=imgUrl)
    #   db.session.add(fakeImages)

    # db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_images():
    db.session.execute('TRUNCATE images;')
    db.session.commit()
