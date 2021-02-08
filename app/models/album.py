
from .db import db

class Album(db.Model):
  __tablename__ = 'Albums' #Title-case plural for Sequelize-compatibility

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50), nullable=False)
  userId = db.Column(db.Integer, db.ForeignKey("Users.id"), nullable=False)
  UniqueConstraint('name', 'userId', name='unique_name_user_combo')

  createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
  updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())



  def to_dict(self):
    return {
      'id': self.id,
      "name": self.name,
      "userId": self.userId,
      "createdAt": self.createdAt,
      "updatedAt": self.updatedAt,
    }



#    UniqueConstraint('customer_id', 'location_code', name='uix_1')
