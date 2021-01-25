from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import Table, Column, Integer, ForeignKey


class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(40), nullable = False, unique = True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  hashed_password = db.Column(db.String(255), nullable = False)
  bio = db.Column(db.Text, nullable=True)
  websiteUrl = db.Column(db.Text, nullable=False)
  profilePicUrl = db.Column(db.Text, nullable=True)

  ownPosts = db.relationship('Post', foreign_keys='Post.userId')
  taggedPosts = db.relationship('Post', secondary='taggedusers', foreign_keys='TaggedUser.postId')
  likedPosts = db.relationship('Post', secondary='likedposts', foreign_keys='LikedPost.postId')
  sentMessages = db.relationship('DirectMessage', foreign_keys='DirectMessage.senderId')
  receivedMessages = db.relationship('DirectMessage', foreign_keys='DirectMessage.receiverId')
  commentLikes = db.relationship('CommentLike', secondary='commentlikes' foreign_keys='CommentLike.commentId')
  commentTaggedUser = db.relationship('CommentLike' secondary='commenttaggedusers', foreign_keys='CommentTaggedUser.userId')
  followers = db.relationship('User', secondary='userfollowers')


  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)


  def to_dict(self):
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
    }

  def to_dict_for_self(self):
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
      "messages": [sentMsg.to_dict() for sentMsg in self.sentMessages] + [recvdMsg.to_dict() for recvdMsg in self.receivedMessages]
    }
