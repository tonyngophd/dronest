from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # print("Checking if user exits", field.data)
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("User is already registered.")


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    name = StringField('name', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired()])
    bio = StringField('bio', validators=[DataRequired()])
    websiteUrl = StringField('websiteUrl', validators=[DataRequired()])
    profilePicUrl = StringField('profilePicUrl', validators=[DataRequired()])

class UpdateProfileForm(FlaskForm):
    username = StringField('username')
    name = StringField('name')
    email = StringField('email')
    bio = StringField('bio',)
    websiteUrl = StringField('websiteUrl')
    profilePicUrl = StringField('profilePicUrl')
