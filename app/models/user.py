from .db import db
from .userfollower import UserFollower
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import Table, Column, Integer, ForeignKey, or_
from .directmessage import DirectMessage


class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(40), nullable = False, unique = True)
  name = db.Column(db.String(100), nullable=True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  hashed_password = db.Column(db.String(255), nullable = False)
  bio = db.Column(db.Text, nullable=True)
  websiteUrl = db.Column(db.Text, nullable=False, default="www.google.com")
  profilePicUrl = db.Column(db.Text, nullable=True)
  createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
  updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())


  ownPosts = db.relationship('Post', foreign_keys='Post.userId')
  ownComments = db.relationship('Comment', foreign_keys='Comment.userId')
  taggedInPosts = db.relationship('Post', secondary='taggedusers')
  likedPosts = db.relationship('Post', secondary='likedposts')
  sentMessages = db.relationship('DirectMessage', foreign_keys='DirectMessage.senderId')
  receivedMessages = db.relationship('DirectMessage', foreign_keys='DirectMessage.receiverId')
  likedComments = db.relationship('Comment', secondary='commentlikes')
  taggedInComments = db.relationship('Comment', secondary='commenttaggedusers')
  followers = [] #db.relationship('User', secondary='userfollowers', foreign_keys='UserFollower.followerId')
  following = [] #db.relationship('User', secondary='userfollowers', foreign_keys='UserFollower.userId')
  allMessages = []


  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)


  def get_followers(self):
    ufs = UserFollower.query.filter(UserFollower.userId == self.id).all()
    self.followers = [uf.follower for uf in ufs]


  def get_following(self):
    ufs = UserFollower.query.filter(UserFollower.followerId == self.id).all()
    self.following = [uf.person for uf in ufs]

  def get_messages(self):
    msgs = DirectMessage.query\
      .filter(or_(DirectMessage.senderId == self.id, \
        DirectMessage.receiverId == self.id)).order_by(DirectMessage.id).all()
    self.allMessages = msgs


  def to_dict(self):
    return {
      "id": self.id,
      "name": self.name,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
    }

  def to_dict_feed(self):
    self.get_following()
    return {
      "followingIds": [int(follow.id) for follow in self.following]
    }

  def to_dict_for_mentions(self):
    return {
      "id": self.id,
      "displayName": self.name,
      "name": self.username,
      "profilePicUrl": self.profilePicUrl,
    }

  def to_dict_no_posts(self):
  #no posts so if a post has this user, there is no infinite circular references
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
    }

  def to_dict_for_self(self):
    self.get_followers()
    self.get_following()
    self.get_messages()
    return {
      "id": self.id,
      "username": self.username,
      "name": self.name,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
      "ownPosts": [post.to_dict_for_self() for post in self.ownPosts],
      "likedPosts": [post.to_dict() for post in self.likedPosts],
      "taggedInPosts": [post.to_dict() for post in self.taggedInPosts],
      "messages": [m.to_dict() for m in self.allMessages], #[sentMsg.to_dict() for sentMsg in self.sentMessages] + [recvdMsg.to_dict() for recvdMsg in self.receivedMessages],
      "followers": [user.to_dict() for user in self.followers],
      "following": [user.to_dict() for user in self.following],
      "likedComments": [comment.to_dict() for comment in self.likedComments],
      "taggedInComments": [comment.to_dict() for comment in self.taggedInComments],
    }

  def to_dict_as_generic_profile(self):
    '''
    compared to "for_self" this does not include:
      - messages
      and more later
    '''
    self.get_followers()
    self.get_following()
    return {
      "id": self.id,
      "username": self.username,
      "name": self.name,
      "email": self.email,
      "bio": self.bio,
      "websiteUrl": self.websiteUrl,
      "profilePicUrl": self.profilePicUrl,
      "ownPosts": [post.to_dict_for_self() for post in self.ownPosts],
      "likedPosts": [post.to_dict() for post in self.likedPosts],
      "taggedInPosts": [post.to_dict() for post in self.taggedInPosts],
      "followers": [user.to_dict() for user in self.followers],
      "following": [user.to_dict() for user in self.following],
      "likedComments": [comment.to_dict() for comment in self.likedComments],
      "taggedInComments": [comment.to_dict() for comment in self.taggedInComments],
    }


'''
mapper(
    User, t_users,
    properties={
        'followers': relation(
            User,
            secondary=t_follows,
            primaryjoin=(t_follows.c.followee_id==t_users.c.id),
            secondaryjoin=(t_follows.c.follower_id==t_users.c.id),
        ),
        'followees': relation(
            User,
            secondary=t_follows,
            primaryjoin=(t_follows.c.follower_id==t_users.c.id),
            secondaryjoin=(t_follows.c.followee_id==t_users.c.id),
        ),
    },
)
'''
