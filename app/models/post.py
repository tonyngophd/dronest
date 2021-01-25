from .db import db

class Post(db.Model):
    __tablename__ = 'posts'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, nullable=False)
    locationId = db.Column(db.Integer, nullable=False)
    captionRawData = db.Column(db.Text, nullable=False)

    user = db.relationship('User', foreign_keys='User.id')  #owner of the post
    taggedUsers = db.relationship('User', secondary='taggedposts', foreign_key='User.id')

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "locationId": self.locationId,
            "captionRawData": self.captionRawData,
            "user": user.to_dict(),
            "taggedUsers": [user.to_dict() for user in taggedUsers]
        }