from flask import Blueprint, jsonify, redirect, request
from sqlalchemy import and_
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from app.models import (
  db, Post, Media, TaggedUser, Hashtag, 
  HashtagPost, User, LikedPost, CommentLike, SavedPost,
)
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

@post_routes.route("/explore/<int:page>")
def explore_infinite(page):
  feed = Post.query.order_by(Post.createdAt.desc()).offset(page*24).limit(24)
  return {'posts': {post.id: post.to_dict() for post in feed}}

acceptedFileTypes = [
  'video/mp4',
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/bmp',
]

@post_routes.route("/", methods=["POST"])
@login_required
def create_post():
    numberOfImages = int(request.form["numberOfImages"])
    images = []
    for i in range(numberOfImages):
      mfile = request.files[f'image_{i}']
      if mfile and mfile.content_type in acceptedFileTypes:
        images.append(mfile)
    if len(images) == 0:
      return {"errors": ["Post could not be posted", "No valid media file found"]}
    user_id = request.form["userId"]
    mentioned_users = request.form["mentionedUsers"]
    mentioned_users = json.loads(mentioned_users)
    hashtags = request.form["hashtags"]
    hashtags = json.loads(hashtags)
    raw_data = request.form["rawData"]
    locationId = 1 #TODO update this to have actual one from user from frontend

    post = Post(
      userId=user_id,
      locationId = locationId,
      captionRawData = raw_data
    )
    db.session.add(post)
    db.session.flush()

    for image in images:
      image.filename = f'images/{secure_filename(image.filename)}'
      mediaUrl = upload_file_to_s3(image, Config.S3_BUCKET)
      new_image = Media(
        postId = post.id,
        mediaUrl=mediaUrl,
        mediaType=image.content_type
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
    return {post.id: post.to_dict()}

@post_routes.route("/<int:userId>/feed")
def homeFeed(userId):
  user = User.query.get(userId)
  following = user.to_dict_feed()
  following_list = following["followingIds"]
  following_list.append(userId)
  feed = Post.query.filter(Post.userId.in_(following_list)).order_by(Post.createdAt.desc()).all()
  return {'posts': [post.to_dict() for post in feed]}

@post_routes.route("/<int:userId>/feed/<int:page>")
def homeFeedInfinite(userId, page):
  user = User.query.get(userId)
  following = user.to_dict_feed()
  following_list = following["followingIds"]
  following_list.append(userId)
  feed = Post.query.filter(Post.userId.in_(following_list)).order_by(Post.createdAt.desc()).offset(page*8).limit(8)
  feed_list = [post.to_dict() for post in feed]
  return {'posts': {post["id"]: post for post in feed_list}}

@post_routes.route("/feed/<int:page>")
def allFeedInfinite(page):
  # feed = Post.query.order_by(Post.createdAt.desc()).offset(page*9).limit(9)
  # feed = Post.query.order_by(Post.id.desc()).offset(page*9).limit(9)
  # feed = Post.query.order_by(Post.id.asc()).offset(page*9).limit(9)
  # feed_list = [post.to_dict() for post in feed]
  # return {'posts': {post["id"]: post for post in feed_list}}

  feed = Post.query.order_by(Post.createdAt.desc()).offset(page*24).limit(24)
  return {'posts': {post.id: post.to_dict() for post in feed}}  

@post_routes.route("/tag/<string:hashtag>/<int:page>")
def hashtagFeed(hashtag, page):
  hashtag_obj = Hashtag.query.filter(Hashtag.tagInfo==hashtag).first()
  if not hashtag_obj: return {'posts': {}}
  hashtag_posts = HashtagPost.query.filter(HashtagPost.hashtagId==hashtag_obj.id).order_by(HashtagPost.createdAt.desc()).offset(page*24).limit(24)
  hashtag_posts = [post.to_dict() for post in hashtag_posts]
  feed = [post["post"].to_dict() for post in hashtag_posts]
  return {'posts': {post["id"]: post for post in feed}}

@post_routes.route("/<int:postId>")
def single_post(postId):
  post = Post.query.get(postId)
  return {'post': post.to_dict()}

@post_routes.route("/<int:postId>/delete")
def delete_single_post(postId):
  post = Post.query.get(postId)
  # print("\n\n\n\n\n\n\n\n", post)
  post.cascade_delete()
  db.session.delete(post)
  db.session.commit()
  return {'postId': postId}

@post_routes.route("/<int:postId>/like")
def like_post(postId):
  postLike = LikedPost(
    postId=postId,
    userId=current_user.id
  )
  db.session.add(postLike)
  db.session.commit()
  post = Post.query.get(postId)
  return {'post': post.to_dict()}

@post_routes.route("/<int:postId>/unlike")
def unlike_post(postId):
  postLike = LikedPost.query.filter(LikedPost.postId==postId,LikedPost.userId==current_user.id).first()
  db.session.delete(postLike)
  db.session.commit()
  post = Post.query.get(postId)
  return {'post': post.to_dict()}


@post_routes.route("/<int:postId>/save")
def save_post(postId):
  postSave = SavedPost(
    postId=postId,
    userId=current_user.id
  )
  db.session.add(postSave)
  db.session.commit()
  post = Post.query.get(postId)
  return {'post': post.to_dict_for_self()}


@post_routes.route("/<int:postId>/unsave")
def unsave_post(postId):
  postSave = SavedPost.query.filter(SavedPost.postId==postId,SavedPost.userId==current_user.id).first()
  db.session.delete(postSave)
  db.session.commit()
  post = Post.query.get(postId)
  return {'post': post.to_dict_for_self()}

@post_routes.route("/comments/<int:commentId>/like")
def like_comment(commentId):
  commentLike = CommentLike(
    commentId=commentId,
    userId=current_user.id
  )
  db.session.add(commentLike)
  db.session.commit()
  return {'message': "Success"}

@post_routes.route("/comments/<int:commentId>/unlike")
def unlike_comment(commentId):
  commentLike = CommentLike.query.filter(CommentLike.commentId==commentId,CommentLike.userId==current_user.id).first()
  db.session.delete(commentLike)
  db.session.commit()
  return {'message': "Success"}

@post_routes.route("/<int:postId>/addaview/<int:mediaId>")
def add_a_view(postId, mediaId):
  media = Media.query.get(mediaId)
  if media: 
    media.views += 1
    db.session.commit()
  post = Post.query.get(postId)
  if post:
    return {'post': post.to_dict()}
    #return {'post': {'views': post.get_views(), 'images': [image.to_dict() for image in post.images]}}
  else:
    return {"errors": "post not found"}

