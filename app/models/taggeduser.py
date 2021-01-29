from .db import db

class TaggedUser(db.Model):
    __tablename__ = 'taggedusers'


    id = db.Column(db.Integer, primary_key=True)
    postId = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    viewStatus = db.Column(db.Boolean, nullable=True, default=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())

    post = db.relationship('Post', foreign_keys=postId)

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "postId": self.postId,
          "userId": self.userId,        
          "viewStatus": self.viewStatus,
          "createdAt": self.createdAt,
          "tagger": self.post.to_dict(), 
          "type": "post"       
        }
        
