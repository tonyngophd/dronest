from .db import db

class UserEquipment(db.Model):
    __tablename__ = 'UserEquipment'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.id'), nullable=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())



    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "userId": self.userId,        
          "equipmentId": self.equipmentId,
        }
        