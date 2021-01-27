from flask import Blueprint, jsonify, redirect, request
from sqlalchemy import any_
from flask_login import login_required
from werkzeug.utils import secure_filename
from app.models import db, Post, Image, TaggedUser, Hashtag, HashtagPost, User
from ..helpers import *
from ..config import Config
import json


post_routes = Blueprint('posts', __name__)



@post_routes.route('/')
# @login_required
def allPosts():
    # query to grab all posts
    posts = Post.query.all()
    return {
      "posts": [post.to_dict() for post in posts]
    }


@post_routes.route("/", methods=["POST"])
@login_required
def create_post():

    image = request.files["image"]
    user_id = request.form["userId"]
    mentioned_users = request.form["mentionedUsers"]
    mentioned_users = json.loads(mentioned_users)
    hashtags = request.form["hashtags"]
    hashtags = json.loads(hashtags)
    raw_data = request.form["rawData"]

    post = Post(
      userId=user_id,
      captionRawData = raw_data
    )
    db.session.add(post)
    db.session.flush()

    image.filename = secure_filename(image.filename)
    imgUrl = upload_file_to_s3(image, Config.S3_BUCKET)
    print(imgUrl)
    new_image = Image(
      postId = post.id,
      imgUrl=imgUrl
    )
    db.session.add(new_image)

    for i in range(len(mentioned_users)):
      user_mention = TaggedUser(
        postId = post.id,
        userId = int(mentioned_users[i]),
        viewStatus = False
      )
      db.session.add(user_mention)

    for i in range(len(hashtags)):
      if "id" not in hashtags[i]:
        new_hashtag = Hashtag(
          tagInfo = hashtags[i]["name"]
        )
        db.session.add(new_hashtag)
        db.session.flush()
        tagged_post = HashtagPost(
          postId = post.id,
          hashtagId = new_hashtag.id
        )
        db.session.add(tagged_post)
      else:
        tagged_post = HashtagPost(
          postId = post.id,
          hashtagId = hashtags[i]["id"]
        )
        db.session.add(tagged_post)

    db.session.commit()
    return post.to_dict()

@post_routes.route("/<int:userId>/feed")
def homeFeed(userId):
  user = User.query.get(userId)
  following = user.to_dict_feed()
  following_list = following["followingIds"]
  feed = Post.query.filter(Post.userId.in_(following_list)).all()
  return {'posts': [post.to_dict() for post in feed]}
