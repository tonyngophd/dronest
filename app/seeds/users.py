from werkzeug.security import generate_password_hash
from app.models import db, User
from faker import Faker
import random
fake = Faker()


# Adds a demo user, you can add other users here if you want
def seed_users():

    demo = User(username='Demo', email='demo@aa.io',
                password='password', bio='Seeder files are my favorite to make!', websiteUrl="www.google.com",
                name="Klark Kent",profilePicUrl="https://placeimg.com/200/200")
    db.session.add(demo)
    # for i in range(26):
    #     p = fake.profile()
    #     user = User(username=p['username'], email=p['mail'],
    #         password=f'password', bio=p['job'], websiteUrl=p['website'][0],
    #         name=p['name'],profilePicUrl="https://placeimg.com/200/200")
    #     db.session.add(user)

    michael = User(username='MichaelJensen24', email='michael@gmail.com',
                password='password', bio='Michael is my name and coding is my game!', websiteUrl="www.google.com",
                name="Michael",profilePicUrl="https://placeimg.com/201/201")
    db.session.add(michael)

    tony = User(username='TonyRox', email='tony@gmail.com',
                password='password', bio='Tony is my name and coding is my game!', websiteUrl="www.google.com",
                name="Tony ",profilePicUrl="https://placeimg.com/202/202")
    db.session.add(tony)

    daniel = User(username='danielIzKewl', email='Daniel@gmail.com',
                password='password', bio='Daniel is my name and coding is my game!', websiteUrl="www.google.com",
                name="Daniel ",profilePicUrl="https://placeimg.com/203/203")
    db.session.add(daniel)

    adam = User(username='AdamDaMan', email='adam@gmail.com',
                password='password', bio='adam is my name and coding is my game!', websiteUrl="www.google.com",
                name="Adam ",profilePicUrl="https://placeimg.com/204/204")
    db.session.add(adam)

    for i in range(25):
        p = fake.profile()
        num1 = random.randint(200, 600)
        num2 = random.randint(200, 600)
        username = p["username"]
        email = fake.email()
        password = "password"
        bio = fake.text(max_nb_chars=25)
        websiteUrl = "www.google.com"
        name = fake.name()
        profilePicUrl = f"https://placeimg.com/{num1}/{num2}"
        fakeUser = User(username=username, email=email, password=password, bio=bio, websiteUrl=websiteUrl, name=name, profilePicUrl=profilePicUrl)
        db.session.add(fakeUser)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users;')
    db.session.commit()
