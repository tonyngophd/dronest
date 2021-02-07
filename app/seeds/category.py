from app.models import db, Category, SubCategory


# Adds a demo location, you can add other locations here if you want
def seed_categories():

  cats = [
    "Nature",     #1
    "City",       #2
    "Thermal",    #3
    "Industrial", #4
    "People",     #5
    "Sports",     #6
    "Aninal",     #7
    'Inspection', #8
    'Construction',#9
    'Park',       #10
    'Beach',      #11
    'Mountain',   #12
    'Valley',     #13
    'Vineyard'    #14
    'Vehicle'     #15
  ]

  sub_cats = [
    "Dogs",
    'Cats',
    'Whales',
    'Deers',
    'Solar Panel',
    'Search and Rescue',
  ]
  for i in range(len(cats)):
    cat = Category(name=cats[i])
    db.session.add(cat)

  for i in range(len(sub_cats)):
    sub_cat = SubCategory(name=sub_cats[i])
    db.session.add(sub_cat)

  # for i in range(30):
  #   postId = random.randint(1, 30)
  #   mediaUrl = fake.image_url()
  #   fakeImages = Media(postId=postId, mediaUrl=mediaUrl)
  #   db.session.add(fakeImages)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_categories():
    db.session.execute('TRUNCATE "Categories";')
    db.session.execute('TRUNCATE "SubCategories";')
    db.session.commit()
