from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import db, Comment, CommentTaggedUser
import json

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('/')
@login_required
def allComments():
    # query to grab all comments 
    comments = Comment.query.all()
    return {
      "comments": [comment.to_dict() for comment in comments]
    }

@comment_routes.route('/', methods=["POST"])
@login_required
def create_comment():
  userId = request.form["userId"]
  parentPostId = request.form["parentPostId"]
  captionRawData = request.form["rawData"]
  mentioned_users = request.form["mentionedUsers"]
  mentioned_users = json.loads(mentioned_users)

  comment = Comment(
    userId=userId,
    captionRawData=captionRawData,
    parentPostId=parentPostId
  )
  db.session.add(comment)
  db.session.flush()

  for i in range(len(mentioned_users)):
      user_mention = CommentTaggedUser(
        commentId = comment.id,
        userId = int(mentioned_users[i]),
        viewStatus = False
      )
      db.session.add(user_mention)
  
  db.session.commit()
  return comment.to_dict()

