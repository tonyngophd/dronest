from .db import db

class Comment(db.Model):
    __tablename__ = 'comments'


    id = db.Column(db.Integer, primary_key=True)
    parentPostId = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    captionRawData = db.Column(db.Text, nullable=False)

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
        "id": self.id,
        "parentPostId": self.parentPostId,
        "captionRawData": self.captionRawData
        }