from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, UserFollower

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/<string:username>')
@login_required
def fetch_user(username):
    user = User.query.filter_by(username=username).first()
    return user.to_dict_as_generic_profile()


@user_routes.route('/<string:username>/followers')
@login_required
def fetch_user_followers(username):
    # user = User.query.filter_by(username=username).first()
    followers = UserFollower.query.filter(UserFollower.userId==current_user.id).all()
    following = UserFollower.query.filter(UserFollower.followerId==current_user.id).all()
    return {"followers": [user.follower.to_dict() for user in followers], 
        "following": [user.person.to_dict() for user in following]}


# @user_routes.route('')






