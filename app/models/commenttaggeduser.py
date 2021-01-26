from .db import db

class CommentTaggedUser(db.Model):
    __tablename__ = 'commenttaggedusers'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    commentId = db.Column(db.Integer, db.ForeignKey('comments.id'), nullable=False)
    viewStatus = db.Column(db.Boolean, nullable=True, default=False)


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "postId": self.postId,
          "commentId": self.commentId,        
          "viewStatus": self.viewStatus,        
        }
        

