from .db import db

class UserFollower(db.Model):
    __tablename__ = 'userfollowers'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    followerId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())
    viewStatus = db.Column(db.Boolean, nullable=False, default=False)
   
    person = db.relationship('User', foreign_keys=userId)
    follower = db.relationship('User', foreign_keys=followerId)


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "userId": self.userId,
          "followerId": self.followerId,           
        }
    
    def to_dict_notif(self):
      return {
        "id": self.id,
        "viewStatus": self.viewStatus,
        "createdAt": self.createdAt,
        "userId": self.userId,
        "followerId": self.followerId,
        "follower": self.follower.to_dict(),
        "type": "follow"
      }
        