from app.models import db, Equipment, UserEquipment, User
from random import randint


# Adds a demo location, you can add other locations here if you want
def seed_equipment():

  eqps = [
    {"name": "Magestic Mini 1", "level": 1,
      "url": 'https://images.unsplash.com/photo-1599403868569-30dae419c0a7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTd8fG1hdmljJTIwbWluaXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }, 
    {"name": "Magestic Mini 2", "level": 1,
      "url": 'https://images.unsplash.com/photo-1613682988402-9e2ec510b4cb?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTIyfHxtYXZpYyUyMDIlMjBwcm98ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }, 
    {"name": "Magestic 1", "level": 2,
      "url": "https://images.unsplash.com/photo-1508861147305-f48512b7a29b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cGhhbnRvbSUyMDR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      # "url": "https://images.unsplash.com/photo-1595437700895-4a8bbd759db6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NjJ8fG1hdmljJTIwcHJvfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }, 
    {"name": "Magestic 2", "level": 2,
      "url": "https://images.unsplash.com/photo-1605158784354-77a620992933?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjI0fHxtYXZpYyUyMDIlMjBwcm98ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }, 
    {"name": "Skidium 1", "level": 2,
    "url": 'https://dronedj.com/wp-content/uploads/sites/2/2020/09/Teal-Golden-Eagle-American-made-drone.jpg?quality=82&strip=all'
    # "url": 'https://miro.medium.com/max/3000/1*N4BGgf-mqcQKOF7MhmX9bQ.png'
    }, 
    {"name": "Skidium 2", "level": 2,
    "url": 'https://www.dpreview.com/files/p/articles/2760754803/Skydio_2.jpeg'
    },     
    {"name": "Aspire 1", "level": 3,
      "url": 'https://images.unsplash.com/photo-1456615913800-c33540eac399?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aW5zcGlyZSUyMDF8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {"name": "Aspire 2", "level": 3,
      "url": 'https://images.unsplash.com/photo-1543353275-1312506769cd?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTg2fHxpbnNwaXJlJTIwMnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {"name": "Parody 1", "level": 3, 
      "url": 'https://images.unsplash.com/photo-1602937077274-50c4431e2675?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cGFycm90JTIwMSUyMGRyb25lfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {"name": "Parody 2", "level": 3,
      "url": 'https://img.favpng.com/14/15/19/yuneec-international-typhoon-h-yuneec-h520-png-favpng-5eKYzX51UTS1cccpqC5yJvZb7.jpg'
    },
    {"name": "Epic 1", "level": 4, 
      "url": 'https://149351874.v2.pressablecdn.com/wp-content/uploads/2015/09/Tornado-CGO4-Yuneec-Drone-Dynamic-Analie-Cruz.png'
    },
    {"name": "Epic 2", "level": 4, 
      "url": 'https://cdn.shopify.com/s/files/1/0257/4181/products/ALTA8_01.jpg?v=1490219331'
    },
    {"name": "Epic 3", "level": 4, 
      "url": "https://www.maxim.com/.image/t_share/MTQ1NTk3ODU3NzYyNzE0OTA5/popup---04.jpg"
    },
    {"name": "Unknown", "level": 0, 
      "url": 'https://i.ytimg.com/vi/DBz_8Cif-YY/maxresdefault.jpg'
    },
  ]

  for i in range(len(eqps)):
    eqp = Equipment(name=eqps[i]["name"], level=eqps[i]["level"], mediaUrl=eqps[i]["url"])
    db.session.add(eqp)

  db.session.commit()

# Uses a raw SQL query to TRUNCATE the locations table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_equipment():
    db.session.execute('TRUNCATE "Equipment";')
    db.session.commit()


def seed_userequipment():
  users = User.query.all()
  equipmentList = Equipment.query.all()
  for user in users:
    eqnum = randint(0, len(equipmentList))
    eqset = set()
    for i in range(eqnum):
      while (epId := randint(1, len(equipmentList))) in eqset:
        pass
      eqset.add(epId)
      userequipment = UserEquipment(userId = user.id, equipmentId = epId)
      db.session.add(userequipment)

  db.session.commit()

def undo_userequipment():
    db.session.execute('TRUNCATE "UserEquipment";')
    db.session.commit()
