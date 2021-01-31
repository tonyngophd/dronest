from .db import db

class Comment(db.Model):
    __tablename__ = 'comments'


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    parentPostId = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    captionRawData = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())
    commenter = db.relationship('User', foreign_keys=userId)
    likingUsers = db.relationship('User', secondary='commentlikes')

    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
        "id": self.id,
        "userId": self.userId,
        "parentPostId": self.parentPostId,
        "captionRawData": self.captionRawData,
        "createdAt": self.createdAt,
        "commenter": self.commenter.username,
        "commenterPic": self.commenter.profilePicUrl,
        "likingUsers": {user.id:[user.username, user.profilePicUrl] for user in self.likingUsers}
        }