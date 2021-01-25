from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Post

post_routes = Blueprint('posts', __name__)



@post_routes.route('/')
@login_required
def allPosts():
    # query to grab all posts 
    posts = Post.query.all()
    return {
      "posts": [post.to_dict() for post in posts]
    }




