from werkzeug.security import generate_password_hash
from app.models import db, User
from faker import Faker
from random import randint
from .data import mpics, fpics
fake = Faker()


# Adds a demo user, you can add other users here if you want
def seed_users():

    demo = User(username='Demo', email='demo@aa.io',
                password='password', bio='Seeder files are my favorite to make!', websiteUrl="www.google.com",
                name="Klark Kent",profilePicUrl="https://images.unsplash.com/photo-1578146024300-a8f9df2224ef?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDV8fG1hbiUyMHByb2ZpbGV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60")
    db.session.add(demo)

    demo2 = User(username='Demo2', email='demo2@aa.io',
                password='password', bio='Awesome book writer!', websiteUrl="www.google.com",
                name="Michelle Sanders",profilePicUrl="https://images.unsplash.com/photo-1520155707862-5b32817388d6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjU0fHx3b21hbiUyMHByb2ZpbGV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60")
    db.session.add(demo2)

    tony = User(username='TonySE', email='tony@gmail.com',
                password='password', bio='Tony is my name and coding is my game!', websiteUrl="www.google.com",
                name="Tony ",profilePicUrl="https://avatars.githubusercontent.com/u/52084654?s=460&u=825259c3a4c199a04970faadbbc929bdd1c5c4e9&v=4")
    db.session.add(tony)


    F = 1
    M = 1
    i = 0
    Mpics = mpics
    Fpics = fpics
    while i < 29:
        while (p := fake.profile()) and p['sex'] not in ['F', 'M']:
            continue
        if M > 15 and p['sex'] == 'M':
            continue
        if F > 14 and p['sex'] == 'F':
            continue

        i += 1

        fl = ''
        url = ''
        fl = ''
        url = ''
        if p['sex'] == 'F':
            # fl = f'f{F}.jpg'
            fi = randint(0, len(Fpics) - 1)
            url = Fpics[fi]
            Fpics.pop(fi)
            F += 1
        else:
            # fl = f'm{M}.jpg'
            mi = randint(0, len(Mpics) - 1)
            url = Mpics[mi]
            Mpics.pop(mi)
            M += 1
        # url = 'https://instavibes.s3.amazonaws.com/profiles/profilepics/' + fl
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
