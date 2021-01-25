from .db import db

class SavedPost(db.Model):
    __tablename__ = 'savedposts'


    id = db.Column(db.Integer, primary_key=True)
    postId = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.Integer, nullable=False)


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
          "id": self.id,
          "postId": self.postId,
          "userId": self.userId,        
        }
        

