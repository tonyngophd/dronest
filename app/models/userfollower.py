from .db import db

class UserFollower(db.Model):
    __tablename__ = 'userfollowers'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    followerId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    createdAt = db.Column(db.DateTime, server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

   
    person = db.relationship('User', foreign_keys=userId)
    follower = db.relationship('User', foreign_keys=followerId)


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "userId": self.userId,
          "followerId": self.followerId,           
        }
        