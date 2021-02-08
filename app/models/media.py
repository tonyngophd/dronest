from .db import db
from ..helpers import delete_file_from_s3

class Media(db.Model):
    __tablename__ = 'media'

    id = db.Column(db.Integer, primary_key=True)
    postId = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    mediaUrl = db.Column(db.Text, nullable=False)
    mediaType = db.Column(db.Text, nullable=True, default="image/jpg")
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())


    def delete_actual_image_from_s3(self):
        delete_file_from_s3(self.mediaUrl)

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
        "id": self.id,
        "postId": self.postId,
        "mediaUrl": self.mediaUrl,
        "mediaType": self.mediaType,
        }
        

