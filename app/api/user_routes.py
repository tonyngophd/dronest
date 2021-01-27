from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, User, UserFollower

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


@user_routes.route('/follow/<int:userId>')
@login_required
def follow_user(userId):
    user = User.query.get(userId)
    if not user:
        return {"errors": "No user with this id exists"}
    followship = UserFollower(userId=userId, followerId = current_user.id)
    db.session.add(followship)
    db.session.commit()
    # re-query to update the following just added => May not be needed, but maybe doesn't hurt to do. Need to test    
    myself = User.query.get(current_user.id)
    user = User.query.get(userId) 
    return {"follower": myself.to_dict_for_self(), "followee": user.to_dict_as_generic_profile()}

# @user_routes.route('')






