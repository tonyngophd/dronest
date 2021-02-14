from flask.cli import AppGroup

from .users import seed_users, undo_users
from .posts import seed_posts, undo_posts
from .locations import seed_locations, undo_locations
from .media import seed_media, undo_media
from .category import seed_categories, undo_categories
from .album import seed_albums, undo_albums
from .equipment import seed_equipment, undo_equipment
from .likedposts import seed_likedposts, undo_likedposts
from .savedposts import seed_savedposts, undo_savedposts
# from .testcode import seed_test

from .userfollowers import seed_followers, undo_followers
# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_categories()
    seed_users()
    seed_locations()
    seed_albums()
    seed_equipment()
    seed_posts()
    seed_media()
    seed_followers()
    seed_likedposts()
    seed_savedposts()
    # Add other seed functions here
    # pass

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_savedposts()
    undo_likedposts()
    undo_locations()
    undo_posts()
    undo_followers()
    undo_users()
    undo_albums()
    undo_media()
    undo_categories
    undo_equipment()
    # Add other undo functions here

# @seed_commands.command('test')
# def test():
#     test_code()
