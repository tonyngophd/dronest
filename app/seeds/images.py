from werkzeug.security import generate_password_hash

from app.models import db, Image
from faker import Faker
import random
fake = Faker()

# Adds a demo location, you can add other locations here if you want
def seed_images():

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
