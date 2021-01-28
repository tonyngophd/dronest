from werkzeug.security import generate_password_hash
from app.models import db, Post
from faker import Faker
import random
fake = Faker()


# Adds a demo post, you can add other posts here if you want
def seed_posts():

    demo = Post(userId=1, locationId=1, captionRawData='{"blocks":[{"key":"6h23d","text":"test","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    db.session.add(demo)

    demo1 = Post(userId=2, locationId=1, captionRawData='{"blocks":[{"key":"6h23d","text":"test","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    db.session.add(demo1)

    demo2 = Post(userId=3, locationId=1, captionRawData='{"blocks":[{"key":"b71t8","text":"cool stuff","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    db.session.add(demo2)

    demo3 = Post(userId=4, locationId=1, captionRawData='{"blocks":[{"key":"c50jn","text":"I like this place","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    db.session.add(demo3)

    demo4 = Post(userId=5, locationId=1, captionRawData='{"blocks":[{"key":"5tq4t","text":"What a weird group of guys","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    db.session.add(demo4)



    db.session.commit()

# Uses a raw SQL query to TRUNCATE the posts table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_posts():
    db.session.execute('TRUNCATE posts;')
    db.session.commit()
