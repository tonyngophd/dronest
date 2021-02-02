from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Media, Post

image_routes = Blueprint('users', __name__)

@user_routes.route('/')
@login_required
def images():
    images = Media.query.all()
    return {"images": [image.to_dict() for image in images]}
