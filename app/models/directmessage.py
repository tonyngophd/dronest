from .db import db

class DirectMessage(db.Model):
    __tablename__ = 'directmessages'


    id = db.Column(db.Integer, primary_key=True)
    senderId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    receiverId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    viewStatus = db.Column(db.Boolean, nullable=False, default=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())



    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "senderId": self.senderId,
          "receiverId": self.receiverId,
          "message": self.message,
          "viewStatus": self.viewStatus,
          'createdAt': self.createdAt,
          'updatedAt': self.updatedAt,
        }
        

