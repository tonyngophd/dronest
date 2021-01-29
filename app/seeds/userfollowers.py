from werkzeug.security import generate_password_hash
from random import randint
from app.models import db, User, UserFollower

# Adds a demo user, you can add other users here if you want
def seed_followers():

  demo = UserFollower(userId= 1, followerId= 2)
  db.session.add(demo)

  demo2 = UserFollower(userId= 1, followerId= 3)
  db.session.add(demo2)

  demo3 = UserFollower(userId= 1, followerId= 4)
  db.session.add(demo3)

  demo4 = UserFollower(userId= 1, followerId= 5)
  db.session.add(demo4)

  demo5 = UserFollower(userId= 2, followerId= 1)
  db.session.add(demo5)

  demo6 = UserFollower(userId= 2, followerId= 3)
  db.session.add(demo6)

  demo7 = UserFollower(userId= 2, followerId= 4)
  db.session.add(demo7)

  demo8 = UserFollower(userId= 2, followerId= 5)
  db.session.add(demo8)

  demo9 = UserFollower(userId= 3, followerId= 1)
  db.session.add(demo9)

  demo10 = UserFollower(userId= 3, followerId= 2)
  db.session.add(demo10)

  demo11 = UserFollower(userId= 3, followerId= 4)
  db.session.add(demo11)

  demo12 = UserFollower(userId= 3, followerId= 5)
  db.session.add(demo12)

  demo13 = UserFollower(userId= 4, followerId= 1)
  db.session.add(demo13)

  demo14 = UserFollower(userId= 4, followerId= 2)
  db.session.add(demo14)

  demo15 = UserFollower(userId= 4, followerId= 3)
  db.session.add(demo15)

  demo16 = UserFollower(userId= 4, followerId= 5)
  db.session.add(demo16)

  demo17 = UserFollower(userId= 5, followerId= 1)
  db.session.add(demo17)

  demo18 = UserFollower(userId= 5, followerId= 2)
  db.session.add(demo18)

  demo19 = UserFollower(userId= 5, followerId= 3)
  db.session.add(demo19)

  demo20 = UserFollower(userId= 5, followerId= 4)
  db.session.add(demo20)


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
      userfollower = UserFollower.query.filter(UserFollower.userId==myUserId + 1, UserFollower.followerId == k + 1).all()
      if userfollower:
        pass
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
