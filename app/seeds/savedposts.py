from app.models import db, SavedPost, User, Post
from random import randint, random

# Adds a demo location, you can add other locations here if you want
def seed_savedposts():

  users = User.query.all()
  posts = Post.query.all()
  plen = len(posts)
  ulen = len(users)
  for i in range(plen):
    unum = randint(0, int(ulen//3 * random()))
    uset = set()
    for _ in range(unum):
      while (uid := randint(1, ulen)) in uset:
        pass
      uset.add(uid)
      savedpost = SavedPost(postId = i + 1, userId = uid)
      db.session.add(savedpost)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_savedposts():
    db.session.execute('TRUNCATE "savedposts";')
    db.session.commit()
