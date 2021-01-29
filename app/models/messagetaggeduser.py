from .db import db

class MessageTaggedUser(db.Model):
    __tablename__ = 'messagetaggedusers'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    messageId = db.Column(db.Integer, db.ForeignKey('messages.id'), nullable=False)
    viewStatus = db.Column(db.Boolean, nullable=True, default=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())



    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "postId": self.postId,
          "messageId": self.messageId,        
          "viewStatus": self.viewStatus,        
        }
        

