from .db import db

class HashtagPost(db.Model):
    __tablename__ = 'hashtagposts'


    id = db.Column(db.Integer, primary_key=True)
    postId = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    hashtagId = db.Column(db.Integer, db.ForeignKey('hashtags.id'), nullable=False)
    createdAt = db.Column(db.DateTime, server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())


    post = db.relationship('Post', foreign_keys=postId)

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "postId": self.postId,
          "hashtagId": self.hashtagId,
          "post": self.post        
        }
        

