from werkzeug.security import generate_password_hash
from app.models import db, Post
from faker import Faker
fake = Faker()


# Adds a demo post, you can add other posts here if you want
def seed_posts():

    demo = Post(userId=1, locationId=1, captionRawData="Raw post data")

    db.session.add(demo)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the posts table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_posts():
    db.session.execute('TRUNCATE posts;')
    db.session.commit()
