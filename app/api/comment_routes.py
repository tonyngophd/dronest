from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Comment

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('/')
@login_required
def allComments():
    # query to grab all comments 
    comments = Comment.query.all()
    return {
      "comments": [comment.to_dict() for comment in comments]
    }


