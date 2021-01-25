from .db import db

class Hashtag(db.Model):
    __tablename__ = 'Hashtags'

    id = db.Column(db.Integer, primary_key=True)
    tagInfo = db.Column(db.Integer, nullable=False)

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
        "id": self.id,
        "tagInfo": self.tagInfo
        }