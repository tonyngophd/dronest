from werkzeug.security import generate_password_hash
from app.models import db, Post
from faker import Faker
fake = Faker()


# Adds a demo post, you can add other posts here if you want
def seed_posts():

    demo = Post(userId=1, locationId=1, captionRawData="Raw post data")

    db.session.add(demo)
    for i in range(30):
        p = fake.profile()
        user = User(username=p['username'], email=p['mail'],
            password=f'password{i+1}', bio=p['job'], websiteUrl=p['website'][0],
            name=p['name'],profilePicUrl="https://placeimg.com/200/200"
            )
        db.session.add(user)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the posts table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_posts():
    db.session.execute('TRUNCATE posts;')
    db.session.commit()
