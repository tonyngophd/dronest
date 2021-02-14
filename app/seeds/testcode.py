# from random import randint
# from faker import Faker
# fake = Faker()

# users = []
# for i in range(30):
#   user = fake.simple_profile()
#   users.append(user)

# number_of_users = len(users)
# for i in range(number_of_users):
#   me = users[i]
#   followers = set()
#   following = set()
#   number_of_followers = randint(1, number_of_users // 3)
#   number_of_following = randint(1, number_of_users // 3)
#   for j in range(number_of_followers):
#     while (userid := randint(0, number_of_users - 1)) == i or userid in followers:
#       pass
#     followers.add(userid)
#   for j in range(number_of_following):
#     while (userid := randint(0, number_of_users - 1)) == i or userid in following:
#       pass
#     following.add(userid)
#   print(followers, following)

# F = 1
# M = 1
# i = 0
# while i < 26:
#   while (p := fake.profile()) and p['sex'] not in ['F', 'M']:    
#     continue
#   if M > 11 and p['sex'] == 'M':
#     continue
#   if F > 15 and p['sex'] == 'F':
#     continue

#   i += 1

#   fl = ''
#   url = ''
#   fl = ''
#   url = ''
#   if p['sex'] == 'F':
#       fl = f'f{F}.jpg'
#       F += 1
#   else:
#       fl = f'm{M}.jpg'
#       M += 1
#   url = 'https://instavibes.s3.amazonaws.com/profiles/profilepics/' + fl
#   print(url, F, M, i)

  # user = User(username=p['username'], email=p['mail'],
  #     password=f'password', bio=p['job'], websiteUrl=p['website'][0],
  #     name=p['name'],profilePicUrl=url)

# for i in range(10):
#   text = fake.sentence(nb_words=10)
#   captionRawData='{"blocks":[{"key":"a12d1","text":' + f'"{text}"' + ',"type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
#   print(captionRawData)


# from .models import db, Post, Category, Album
from random import randint
from datetime import datetime

def seed_test():
  for i in range(10):
    month = randint(1,12)
    maxday = 28
    if(month in [1, 3, 5, 7, 8, 10, 12]): maxday = 31
    elif(month in [4, 6, 9, 11]): maxday = 30
    day = randint(1,maxday)

    createdAt = datetime(year=randint(2016, 2021), month=month, day=day, hour=randint(0,23), minute=randint(0,59), second=randint(0, 59))
    # print(createdAt)

    # print(datetime.date(year=randint(2016, 2021), month=month, day=day),
    #   datetime.time(hour=randint(0,23), minute=randint(0,59), second=randint(0, 59))
    # )

# seed_test()

# import json

# with open('addresses-us-all.json') as json_file:
#   data = json.load(json_file)
#   l = set()
#   while len(l) <= 100:
#     l.add(randint(0, len(data['addresses'])))
#   for i in range(len(data['addresses'])):
#     if i in l:
#       # print(data['addresses'][i])      
#       add = data['addresses'][i]
#       try:
#         city = add['city']
#       except:
#         city = 'Unknown'     
#       if city == 'Unknown':
#         print(city) 

from random import random

# for i in range(10):
#   rand = random()
#   # print(rand, rand > 0.5)
#   ulen = 30
#   unum = randint(0, int(ulen//3 * random()))
#   print(unum)

plen = 10
ulen = 30

for i in range(plen):
  unum = randint(0, int(ulen//3 * random()))
  uset = set()
  for j in range(unum):
    while (uid := randint(1, ulen)) in uset:
      pass
    uset.add(uid)

  print(unum, uset)