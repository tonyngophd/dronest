from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Hashtag

hashtag_routes = Blueprint('hashtags', __name__)


@hashtag_routes.route('/mentions/<string:query>')
@login_required
def fetch_hashtags_for_mentions(query):
    hashtags = Hashtag.query.filter(Hashtag.tagInfo.ilike(f"%{query}%")).limit(5)
    return {"hashtags": [hashtag.to_dict_for_mentions() for hashtag in hashtags]}