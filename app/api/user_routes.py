from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import (db, User, UserFollower, DirectMessage, 
    TaggedUser, CommentTaggedUser,
    MessageTaggedUser, Message, MessageReceiver
)
import json
user_routes = Blueprint('users', __name__)


@user_routes.route('')
# @login_required
def users():
    # TODO: need to check if there is current_user (logged in) or 
    # just a generic unauthorized user to return different kind of information
    # 1) withOUT a current_user (unauthorized): return generic public info
    # 2) with current_user (authorized): can return more sensitive info.
    # right now, there is no distinction yet because the info is kind of NOT too sensitive
    users = User.query.all()
    # return {"users": [user.to_dict() for user in users]}
    # return {"users": [user.to_dict_with_posts_and_follows() for user in users]}
    return {"users": [user.to_dict_with_posts_fast() for user in users]}

@user_routes.route('', methods = ["POST"])
# @login_required
def unum_users():
    # TODO: need to check if there is current_user (logged in) or 
    # just a generic unauthorized user to return different kind of information
    # 1) withOUT a current_user (unauthorized): return generic public info
    # 2) with current_user (authorized): can return more sensitive info.
    # right now, there is no distinction yet because the info is kind of NOT too sensitive
    startNum = request.json["startNum"]
    unum = request.json["unum"]
    users = User.query.order_by(User.createdAt.desc()).offset(startNum).limit(unum)
    # return {"users": [user.to_dict() for user in users]}
    # return {"users": [user.to_dict_with_posts_and_follows() for user in users]}
    return {"users": [user.to_dict_with_posts() for user in users]}
    # return {"users": [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/notifications')
@login_required
def fetch_notifications():
    follows_list = UserFollower.query.filter(UserFollower.viewStatus==False, UserFollower.userId==current_user.id).order_by(UserFollower.createdAt.desc()).all()
    post_mentions_list = TaggedUser.query.filter(TaggedUser.viewStatus==False, TaggedUser.userId==current_user.id).order_by(TaggedUser.createdAt.desc()).all()
    comment_mentions_list = CommentTaggedUser.query.filter(CommentTaggedUser.viewStatus==False, CommentTaggedUser.userId==current_user.id).order_by(CommentTaggedUser.createdAt.desc()).all()
    follows_list = [follow.to_dict_notif() for follow in follows_list]
    follows = {follow["id"]:follow for follow in follows_list}
    post_mentions_list = [mention.to_dict() for mention in post_mentions_list]
    post_mentions = {mention["id"]: mention for mention in post_mentions_list}
    comment_mentions_list = [mention.to_dict_notif() for mention in comment_mentions_list]
    comment_mentions = {mention["id"]: mention for mention in comment_mentions_list}
    total = len(post_mentions) + len(comment_mentions) + len(follows)
    return {"notifications": {"total": total, "num_follows": len(follows_list), "num_post_tags": len(post_mentions_list), "num_comment_tags": len(comment_mentions_list), "follows": follows,  "posts": post_mentions, "comments": comment_mentions}}


@user_routes.route('/notifications/clear')
@login_required
def view_all_notifications():
    follows_list = UserFollower.query.filter(UserFollower.viewStatus==False, UserFollower.userId==current_user.id).all()
    post_mentions_list = TaggedUser.query.filter(TaggedUser.viewStatus==False, TaggedUser.userId==current_user.id).all()
    comment_mentions_list = CommentTaggedUser.query.filter(CommentTaggedUser.viewStatus==False, CommentTaggedUser.userId==current_user.id).all()
    for i in range(len(follows_list)):
        follows_list[i].viewStatus = True
        db.session.add(follows_list[i])
    for i in range(len(post_mentions_list)):
        post_mentions_list[i].viewStatus = True
        db.session.add(post_mentions_list[i])
    for i in range(len(comment_mentions_list)):
        comment_mentions_list[i].viewStatus = True
        db.session.add(comment_mentions_list[i])
    db.session.commit()
    return {"message": "Success"}


@user_routes.route('/notifications/follows/<int:id>')
@login_required
def view_follow_notification(id):
    follow = UserFollower.query.get(id)
    follow.viewStatus = True
    db.session.add(follow)
    db.session.commit()
    return {"id": follow.id}


@user_routes.route('/notifications/posts/<int:id>')
@login_required
def view_tag_notification(id):
    tag = TaggedUser.query.get(id)
    tag.viewStatus = True
    db.session.add(tag)
    db.session.commit()
    return {"id": tag.id}


@user_routes.route('/notifications/comments/<int:id>')
@login_required
def view_comment_notification(id):
    tag = CommentTaggedUser.query.get(id)
    tag.viewStatus = True
    db.session.add(tag)
    db.session.commit()
    return {"id": tag.id}


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

@user_routes.route('/mentions/<string:query>')
@login_required
def fetch_users_for_mentions(query):
    users = User.query.filter(User.username.ilike(f"%{query}%")).limit(5)
    return {"users": [user.to_dict_for_mentions() for user in users]}

@user_routes.route('/follow/<int:userId>', methods=['GET', 'POST'])
@login_required
def follow_user(userId):
    user = User.query.get(userId)
    if not user or request.method == 'GET':
        return {"errors": "No user with this id exists"}
    if request.json['do_follow']:
        followship = UserFollower(userId=userId, followerId = current_user.id)
        db.session.add(followship)
    else:
        UserFollower.query.filter(UserFollower.userId==userId, UserFollower.followerId==current_user.id).delete()
    db.session.commit()
    # re-query to update the following just added => May not be needed, but maybe doesn't hurt to do. Need to test    
    myself = User.query.get(current_user.id)
    user = User.query.get(userId) 
    return {"follower": myself.to_dict_for_self(), "followee": user.to_dict_as_generic_profile()}

@user_routes.route('/messages/receivers/<int:receiverId>', methods=['POST'])
@login_required
def message_index(receiverId):
    senderId = request.json['senderId']
    message = request.json['messageBody']
    dm = DirectMessage(senderId=senderId, receiverId=receiverId,message=message,viewStatus=0)
    db.session.add(dm)
    db.session.commit()

    myself = User.query.get(senderId) 

    return {"user": myself.to_dict_for_self()}

@user_routes.route('/messages', methods=['POST'])
@login_required
def create_message():
    senderId = request.form["senderId"]
    receiverId = request.form["receiverId"]
    message = request.form["rawData"]
    mentioned_users = request.form["mentionedUsers"]
    mentioned_users = json.loads(mentioned_users)

    dm = DirectMessage(
        senderId=senderId,
        receiverId=receiverId,
        message=message
    )
    db.session.add(dm)
    db.session.flush()

    # for i in range(len(mentioned_users)):
    #     user_mention = MessageTaggedUser(
    #         messageId = dm.id,
    #         userId = int(mentioned_users[i]),
    #         viewStatus = False
    #     )
    #     db.session.add(user_mention)

    db.session.commit()
#   return message.to_dict()
    myself = User.query.get(senderId) 
    return {"user": myself.to_dict_for_self()}

@user_routes.route('/conversations', methods=['POST'])
@login_required
def record_conversation():
    senderId = request.form["senderId"]
    receiverIds = request.form["receiverIds"]
    receiverIds=[int(el) for el in receiverIds.split(',')]
    rawData = request.form["rawData"]
    mentioned_users = request.form["mentionedUsers"]
    mentioned_users = json.loads(mentioned_users)

    msg = Message(
        rawData=rawData,
        totalReceivers=len(receiverIds),
        receiverIdList='_'.join(map(str,receiverIds))
    )
    db.session.add(msg)
    # db.session.flush()
    db.session.commit()

    for id in receiverIds:
        mr = MessageReceiver(
            senderId=senderId,
            messageId=msg.id,
            receiverId=id,
            viewStatus=False,
        )
        db.session.add(mr)

    # for i in range(len(mentioned_users)):
    #     user_mention = MessageTaggedUser(
    #         messageId = dm.id,
    #         userId = int(mentioned_users[i]),
    #         viewStatus = False
    #     )
    #     db.session.add(user_mention)

    db.session.commit()
#   return message.to_dict()
    # myself = User.query.get(senderId)
    myself = current_user
    myself.get_conversations()
    message = myself.allMessages[-1]
    # return {"user": myself.to_dict_for_self()}
    return {"message": message.to_dict()}
