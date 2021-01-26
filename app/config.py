import os

class Config:
  SECRET_KEY=os.environ.get('SECRET_KEY')
  SQLALCHEMY_TRACK_MODIFICATIONS=False
  SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL')
  SQLALCHEMY_ECHO=True

  S3_BUCKET=os.environ.get("Hyperion")
  S3_KEY=os.environ.get("AKIAIXJTNPYHTEDHHAVA")
  S3_SECRET=os.environ.get("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")
  S3_LOCATION='http://{}.s3.amazonaws.com/'.format(S3_BUCKET)

  SECRET_KEY=os.urandom(32)
  DEBUG=True
  PORT=5000

# export S3_BUCKET="Hyperion"
# export S3_KEY="AKIAIXJTNPYHTEDHHAVA"
# export S3_SECRET_ACCESS_KEY="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"