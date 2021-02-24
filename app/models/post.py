from sqlalchemy import and_
from .db import db
from .taggeduser import TaggedUser
from .comment import Comment
from .media import Media
from .likedpost import LikedPost
from .savedpost import SavedPost
from .hashtagpost import HashtagPost
from .category import Category

class Post(db.Model):
    __tablename__ = 'posts'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    locationId = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=True)
    captionRawData = db.Column(db.Text, nullable=True)
    categoryId = db.Column(db.Integer, db.ForeignKey('Categories.id'), nullable=True, default=18)
    albumId = db.Column(db.Integer, db.ForeignKey('Albums.id'), nullable=True, default=1)
    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.id'), nullable=True, default=1)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())

 
    # Model name is title case and singular
    user = db.relationship('User', foreign_keys=userId, lazy='select')  #owner of the post
    taggedUsers = db.relationship('User', secondary='taggedusers', lazy='select')
    comments = db.relationship('Comment', foreign_keys='Comment.parentPostId')
    images = db.relationship('Media', foreign_keys='Media.postId')
    likingUsers = db.relationship('User', secondary='likedposts', lazy='select')
    userSaves = db.relationship('User', secondary='savedposts', lazy='select')
    category = db.relationship('Category', foreign_keys=categoryId)
    album = db.relationship('Album', foreign_keys=albumId)
    equipment = db.relationship('Equipment', foreign_keys=equipmentId)
    location = db.relationship('Location', foreign_keys=locationId)
    # hastags = db.relationship('Hashtag', secondary='hashtagposts')


    def cascade_delete(self):
        for user in self.taggedUsers:
            TaggedUser.query.filter(and_(TaggedUser.postId == self.id, TaggedUser.userId == user.id)).delete()
        for comment in self.comments:
            comment.cascade_delete()
            db.session.delete(comment)
        for image in self.images:
            image.delete_actual_image_from_s3()
            db.session.delete(image)
        for user in self.likingUsers:
            LikedPost.query.filter(and_(LikedPost.postId == self.id, LikedPost.userId == user.id)).delete()
        for user in self.userSaves:
            SavedPost.query.filter(and_(SavedPost.postId == self.id, SavedPost.userId == user.id)).delete()
        HashtagPost.query.filter(HashtagPost.postId == self.id).delete()
        db.session.commit()


    def get_views(self):
        views = 0
        for image in self.images:
            views += image.views
        return views

    def get_likes(self):
        likedposts = LikedPost.query.filter(LikedPost.postId == self.id).all()
        return len(likedposts)


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):       
        return {
            "id": self.id,
            "userId": self.userId,
            "locationId": self.locationId,
            "location": self.location.to_dict(),
            "captionRawData": self.captionRawData,
            "createdAt": self.createdAt,
            "categoryId": self.categoryId,
            "category": self.category.to_dict(),
            "albumId": self.albumId,
            "album": self.album.to_dict(),
            "equipment": self.equipment.to_dict(),
            "user": self.user.to_dict_no_posts(),   #no posts so if a post has this user, there is no infinite circular references
            "views": self.get_views(),
            "taggedUsers": [user.to_dict_no_posts() for user in self.taggedUsers],
            "comments": [comment.to_dict() for comment in self.comments],
            "images": [image.to_dict() for image in self.images],
            "likingUsers": {user.id:[user.username, user.profilePicUrl] for user in self.likingUsers},
            "likes": len(self.likingUsers),
            "userSaves": {user.id:user.id for user in self.userSaves},
        }

    def to_dict_fast(self):       
        return {
            "id": self.id,
            "userId": self.userId,
            "locationId": self.locationId,
            "location": self.location.to_dict(),
            "createdAt": self.createdAt,
            "categoryId": self.categoryId,
            "category": self.category.to_dict(),
            "albumId": self.albumId,
            "album": self.album.to_dict(),
            "equipment": self.equipment.to_dict(),
            "user": self.user.to_dict_no_posts(),   #no posts so if a post has this user, there is no infinite circular references
            "views": self.get_views(),
            "images": [image.to_dict() for image in self.images],
            "likes": self.get_likes(),
        }

    def to_dict_for_self(self):       
        return {
            "id": self.id,
            "userId": self.userId,
            "locationId": self.locationId,
            "location": self.location.to_dict(),
            "captionRawData": self.captionRawData,
            "createdAt": self.createdAt,
            "categoryId": self.categoryId,
            "category": self.category.to_dict(),
            "albumId": self.albumId,
            "album": self.album.to_dict(),
            "equipment": self.equipment.to_dict(),
            "views": self.get_views(),
            "taggedUsers": [user.to_dict_no_posts() for user in self.taggedUsers],
            "comments": [comment.to_dict() for comment in self.comments],
            "images": [image.to_dict() for image in self.images],
            "likingUsers": {user.id:[user.username, user.profilePicUrl] for user in self.likingUsers},
            "likes": len(self.likingUsers),
            "userSaves": {user.id:user.id for user in self.userSaves},
        }