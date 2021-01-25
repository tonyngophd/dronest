from .db import db

class CommentLike(db.Model):
    __tablename__ = 'commentlikes'


    id = db.Column(db.Integer, primary_key=True)
    commentId = db.Column(db.Integer, db.ForeignKey('comments.id'), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)



    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "commentId": self.commentId,
          "userId": self.userId,               
        }