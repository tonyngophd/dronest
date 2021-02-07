from werkzeug.security import generate_password_hash
from app.models import db, User
from faker import Faker
import random
fake = Faker()


# Adds a demo user, you can add other users here if you want
def seed_users():

    demo = User(username='Demo', email='demo@aa.io',
                password='password', bio='Seeder files are my favorite to make!', websiteUrl="www.google.com",
                name="Klark Kent",profilePicUrl="https://instavibes.s3.amazonaws.com/profiles/profilepics/g0.jpg")
    db.session.add(demo)

    michael = User(username='MichaelJensen24', email='michael@gmail.com',
                password='password', bio='Michael is my name and coding is my game!', websiteUrl="www.google.com",
                name="Michael",profilePicUrl="https://avatars.githubusercontent.com/u/43710448?s=460&u=0776a5d4024f163b62d6901ef2dc2ab2a8f4a8a2&v=4")
    db.session.add(michael)

    tony = User(username='TonyRox', email='tony@gmail.com',
                password='password', bio='Tony is my name and coding is my game!', websiteUrl="www.google.com",
                name="Tony ",profilePicUrl="https://avatars.githubusercontent.com/u/52084654?s=460&u=825259c3a4c199a04970faadbbc929bdd1c5c4e9&v=4")
    db.session.add(tony)

    daniel = User(username='danielIzKewl', email='Daniel@gmail.com',
                password='password', bio='Daniel is my name and coding is my game!', websiteUrl="www.google.com",
                name="Daniel ",profilePicUrl="https://avatars.githubusercontent.com/u/70864617?s=460&v=4")
    db.session.add(daniel)

    adam = User(username='AdamDaMan', email='adam@gmail.com',
                password='password', bio='adam is my name and coding is my game!', websiteUrl="www.google.com",
                name="Adam ",profilePicUrl="https://avatars.githubusercontent.com/u/62448980?s=460&u=06f0b035e68e71b1b36f8ba3bf565ae68081609b&v=4")
    db.session.add(adam)

    F = 1
    M = 1
    i = 0
    while i < 26:
        while (p := fake.profile()) and p['sex'] not in ['F', 'M']:
            continue
        if M > 11 and p['sex'] == 'M':
            continue
        if F > 15 and p['sex'] == 'F':
            continue

        i += 1

        fl = ''
        url = ''
        fl = ''
        url = ''
        if p['sex'] == 'F':
            fl = f'f{F}.jpg'
            F += 1
        else:
            fl = f'm{M}.jpg'
            M += 1
        url = 'https://instavibes.s3.amazonaws.com/profiles/profilepics/' + fl
        user = User(username=p['username'], email=p['mail'],
            password=f'password', bio=p['job'], websiteUrl=p['website'][0],
            name=p['name'],profilePicUrl=url)
        db.session.add(user)

    # for i in range(25):
    #     p = fake.profile()
    #     num1 = random.randint(200, 600)
    #     num2 = random.randint(200, 600)
    #     username = p["username"]
    #     email = fake.email()
    #     password = "password"
    #     bio = fake.text(max_nb_chars=25)
    #     websiteUrl = "www.google.com"
    #     name = fake.name()
    #     profilePicUrl = f"https://placeimg.com/{num1}/{num2}"
    #     fakeUser = User(username=username, email=email, password=password, bio=bio, websiteUrl=websiteUrl, name=name, profilePicUrl=profilePicUrl)
    #     db.session.add(fakeUser)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE "Users";')
    db.session.commit()
