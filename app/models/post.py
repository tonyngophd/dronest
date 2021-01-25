from .db import db

class Post(db.Model):
    __tablename__ = 'posts'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    locationId = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    captionRawData = db.Column(db.Text, nullable=False)
 
    # Model name is title case and singular
    # user = db.relationship('User', foreign_keys=userId)  #owner of the post
    # taggedUsers = db.relationship('User', secondary='taggedposts', foreign_keys='User.id')
    # comments = db.relationship('Comment', foreign_keys='Comment.id')
    # likedPosts = db.relationship('LikedPost', foreign_keys='LikedPost.id')
    # images = db.relationship('Images', foreign_keys='Image.id')



    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "locationId": self.locationId,
            "captionRawData": self.captionRawData,
            # "user": user.to_dict(),
            # "taggedUsers": [user.to_dict() for user in taggedUsers]
        }