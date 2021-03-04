from .db import db

class Message(db.Model):
    __tablename__ = 'Messages'


    id = db.Column(db.Integer, primary_key=True)
    rawData = db.Column(db.Text, nullable=False)
    totalReceivers = db.Column(db.Integer, nullable=False)
    receiverIdList = db.Column(db.String(255), nullable=False)
    #255: each user has an id, 10 billion users => id = 11 digits long, 255/11 = 23 users max in any conversation
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    # updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())  

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "rawData": self.rawData,
          "totalReceivers": self.totalReceivers,
          "receiverIdList": self.receiverIdList,
          'createdAt': self.createdAt,
          # 'updatedAt': self.updatedAt,
        }
        

