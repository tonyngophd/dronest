from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # print("Checking if user exists", field.data)
    credential = form.data['credential']
    if '@' in credential:
        user = User.query.filter(User.email == credential).first()
    else:
        user = User.query.filter(User.username == credential).first()
    if not user:
        raise ValidationError("Email provided not found.")


def password_matches(form, field):
    # print("Checking if password matches")
    password = field.data
    credential = form.data['credential']
    if '@' in credential:
        user = User.query.filter(User.email == credential).first()
    else:
        user = User.query.filter(User.username == credential).first()
    if not user:
        raise ValidationError("No such user exists.")
    if not user.check_password(password):
        raise ValidationError("Password was incorrect.")


class LoginForm(FlaskForm):
    credential = StringField('credential', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired(), password_matches])


class ChangePasswordForm(FlaskForm):
    credential = StringField('credential', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired(), password_matches])
    newPassword = StringField('newPassword', validators=[DataRequired()])


