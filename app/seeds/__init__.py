from flask.cli import AppGroup

from .users import seed_users, undo_users
from .posts import seed_posts, undo_posts
from .locations import seed_locations, undo_locations
from .media import seed_media, undo_media
from .category import seed_categories, undo_categories

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
    seed_posts()
    seed_media()
    seed_followers()
    # Add other seed functions here

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_locations()
    undo_posts()
    undo_followers()
    undo_users()
    undo_media()
    undo_categories
    # Add other undo functions here
