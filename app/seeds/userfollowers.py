from werkzeug.security import generate_password_hash
from random import randint
from app.models import db, User, UserFollower

# Adds a demo user, you can add other users here if you want
def seed_followers():
  users = User.query.all()
  number_of_users = len(users)
  for i in range(number_of_users):
    myUserId = i
    followers = set()
    # following = set()
    number_of_followers = randint(1, number_of_users // 3)
    # number_of_following = randint(1, number_of_users // 3)
    for j in range(number_of_followers):
      while (userid := randint(0, number_of_users - 1)) == myUserId \
        or userid in followers:
        pass
      followers.add(userid)
    # for j in range(number_of_following):
    #   while (userid := randint(0, number_of_users - 1)) == i or userid in following:
    #     pass
    #   following.add(userid)
    # print(followers, following)
    for k in followers:
      userfollower = UserFollower(userId=myUserId + 1, followerId= k + 1)
      db.session.add(userfollower)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_followers():
    db.session.execute('TRUNCATE users;')
    db.session.commit()
