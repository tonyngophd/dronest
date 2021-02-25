from .db import db

class MessageReceiver(db.Model):
    __tablename__ = 'MessageReceivers'


    id = db.Column(db.Integer, primary_key=True)
    senderId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    messageId = db.Column(db.Integer, db.ForeignKey('Messages.id'), nullable=False)
    receiverId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    viewStatus = db.Column(db.Boolean, nullable=False, default=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())

    sender = db.relationship('User', foreign_keys=senderId, lazy='select')
    receiver = db.relationship('User', foreign_keys=receiverId, lazy='select')
    message = db.relationship('Message', foreign_keys=messageId, lazy='select')



    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "senderId": self.senderId,
          "message": self.message.to_dict(),
          "receiverId": self.receiverId,
          "viewStatus": self.viewStatus,
          'createdAt': self.createdAt,
          'updatedAt': self.updatedAt,
        }
        

