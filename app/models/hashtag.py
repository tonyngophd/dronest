from .db import db

class Hashtag(db.Model):
    __tablename__ = 'hashtags'

    id = db.Column(db.Integer, primary_key=True)
    tagInfo = db.Column(db.String(40), nullable=False)
    createdAt = db.Column(db.DateTime, server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
        "id": self.id,
        "tagInfo": self.tagInfo
        }

    def to_dict_for_mentions(self):
        return {
        "id": self.id,
        "name": self.tagInfo
        }