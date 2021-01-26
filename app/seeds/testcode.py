from random import randint
from faker import Faker
fake = Faker()

users = []
for i in range(30):
  user = fake.simple_profile()
  users.append(user)

number_of_users = len(users)
for i in range(number_of_users):
  me = users[i]
  followers = set()
  following = set()
  number_of_followers = randint(1, number_of_users // 3)
  number_of_following = randint(1, number_of_users // 3)
  for j in range(number_of_followers):
    while (userid := randint(0, number_of_users - 1)) == i or userid in followers:
      pass
    followers.add(userid)
  for j in range(number_of_following):
    while (userid := randint(0, number_of_users - 1)) == i or userid in following:
      pass
    following.add(userid)
  print(followers, following)
  