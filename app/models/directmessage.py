from .db import db

class DirectMessage(db.Model):
    __tablename__ = 'directmessages'


    id = db.Column(db.Integer, primary_key=True)
    senderId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiverId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    viewStatus = db.Column(db.Boolean, nullable=False, default=False)


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "senderId": self.senderId,
          "receiverId": self.receiverId,
          "message": self.message,
          "viewStatus": self.viewStatus  
        }
        

