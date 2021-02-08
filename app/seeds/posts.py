from werkzeug.security import generate_password_hash
from app.models import db, Post, Category, Album
from faker import Faker
from random import randint
fake = Faker()
from .data import mediadata, albums


# Adds a demo post, you can add other posts here if you want
def seed_posts():

    # demo = Post(userId=1, locationId=1, captionRawData='{"blocks":[{"key":"a12d1","text":"A cup of Joe and Java Script","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo)

    # demo1 = Post(userId=2, locationId=1, captionRawData='{"blocks":[{"key":"br8hm","text":"Congrats my friends!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo1)

    # demo2 = Post(userId=3, locationId=1, captionRawData='{"blocks":[{"key":"3q4gs","text":"Neon signs are only cool if they are red","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo2)

    # demo3 = Post(userId=4, locationId=1, captionRawData='{"blocks":[{"key":"d0qlp","text":"Me at a party! ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo3)

    # demo4 = Post(userId=5, locationId=1, captionRawData='{"blocks":[{"key":"7ahvi","text":"Just a couple of friends!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}')
    # db.session.add(demo4)

    for i in range(len(mediadata)):
        text = fake.sentence(nb_words=10)
        userid = randint(1,20)
        albums = Album.query.filter(Album.userId == userid).all()
        album = albums[randint(0, len(albums)-1)]
        albumid = album.id
        post = Post(userId = userid, locationId=randint(1,30),
                captionRawData='{"blocks":[{"key":"a12d1","text":' + f'"{text}"' + ',"type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
                categoryId = mediadata[i]['catid'],
                albumId = albumid
            )
        db.session.add(post)
        

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the posts table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_posts():
    db.session.execute('TRUNCATE posts;')
    db.session.commit()
