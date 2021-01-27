from werkzeug.security import generate_password_hash
from app.models import db, User
from faker import Faker
fake = Faker()


# Adds a demo user, you can add other users here if you want
def seed_users():

    demo = User(username='Demo', email='demo@aa.io',
                password='password', bio='demo', websiteUrl="www.google.com",
                name="Klark Kent",profilePicUrl="https://placeimg.com/200/200")
    db.session.add(demo)
    for i in range(30):
        p = fake.profile()
        user = User(username=p['username'], email=p['mail'],
            password=f'password{i+1}', bio=p['job'], websiteUrl=p['website'][0],
            name=p['name'],profilePicUrl="https://placeimg.com/200/200")
        db.session.add(user)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users;')
    db.session.commit()
