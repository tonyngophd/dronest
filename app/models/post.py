from sqlalchemy import and_
from .db import db
from .taggeduser import TaggedUser
from .comment import Comment
from .image import Image
from .likedpost import LikedPost
from .savedpost import SavedPost
from .hashtagpost import HashtagPost

class Post(db.Model):
    __tablename__ = 'posts'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    locationId = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=True)
    captionRawData = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())

 
    # Model name is title case and singular
    user = db.relationship('User', foreign_keys=userId)  #owner of the post
    taggedUsers = db.relationship('User', secondary='taggedusers')
    comments = db.relationship('Comment', foreign_keys='Comment.parentPostId')
    images = db.relationship('Image', foreign_keys='Image.postId')
    likingUsers = db.relationship('User', secondary='likedposts')
    userSaves = db.relationship('User', secondary='savedposts')
    # hastags = db.relationship('Hashtag', secondary='hashtagposts')


    def cascade_delete(self):
        for user in self.taggedUsers:
            TaggedUser.query.filter(and_(TaggedUser.postId == self.id, TaggedUser.userId == user.id)).delete()
        for comment in self.comments:
            comment.cascade_delete()
            db.session.delete(comment)
        for image in self.images:
            #TODO: delete picture from S3
            db.session.delete(image)
        for user in self.likingUsers:
            LikedPost.query.filter(and_(LikedPost.postId == self.id, LikedPost.userId == user.id)).delete()
        for user in self.userSaves:
            SavedPost.query.filter(and_(SavedPost.postId == self.id, SavedPost.userId == user.id)).delete()
        HashtagPost.query.filter(HashtagPost.postId == self.id).delete()
        db.session.commit()

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):       
        return {
            "id": self.id,
            "userId": self.userId,
            "locationId": self.locationId,
            "captionRawData": self.captionRawData,
            "createdAt": self.createdAt,
            "user": self.user.to_dict_no_posts(),   #no posts so if a post has this user, there is no infinite circular references
            "taggedUsers": [user.to_dict_no_posts() for user in self.taggedUsers],
            "comments": [comment.to_dict() for comment in self.comments],
            "images": [image.to_dict() for image in self.images],
            "likingUsers": {user.id:[user.username, user.profilePicUrl] for user in self.likingUsers},
            "userSaves": {user.id:user.id for user in self.userSaves}
        }

    def to_dict_for_self(self):       
        return {
            "id": self.id,
            "userId": self.userId,
            "locationId": self.locationId,
            "captionRawData": self.captionRawData,
            "taggedUsers": [user.to_dict_no_posts() for user in self.taggedUsers],
            "comments": [comment.to_dict() for comment in self.comments],
            "images": [image.to_dict() for image in self.images],
            "likingUsers": {user.id:[user.username, user.profilePicUrl] for user in self.likingUsers},
            "userSaves": {user.id:user.id for user in self.userSaves}
        }