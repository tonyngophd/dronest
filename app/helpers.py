import boto3, botocore
from botocore.exceptions import ClientError

from .config import Config
# from config import S3_KEY, S3_SECRET, S3_BUCKET

s3 = boto3.client(
   "s3",
   aws_access_key_id=Config.S3_KEY,
   aws_secret_access_key=Config.S3_SECRET
)

def file_exists(bucket, key):
    try:
        s3.head_object(Bucket=bucket, Key=key)
    except ClientError as e:
        return int(e.response['Error']['Code']) != 404
    return True


def upload_file_to_s3(file, bucket_name=Config.S3_BUCKET, acl="public-read"):
    filename = file.filename
    i = 0
    base = filename[:filename.rindex('.')]
    extension = filename[filename.rindex('.'):]
    while(file_exists(bucket_name, filename)):
        i += 1
        filename = base + f'_{i}' + extension

    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e

    return "{}{}".format(Config.S3_LOCATION, filename)

def delete_file_from_s3(filename, bucket_name=Config.S3_BUCKET):
    try:
        # bucket_name = filename[filename.index('//') + 2:filename.index('.s3')]
        filename_on_s3 = filename[filename.index('.com/') + len('.com/'):]
        if 's3.amazonaws.com' not in filename_on_s3:
            return {'status': 'file not hosted on AWS S3'}
        response = s3.delete_object(Bucket=bucket_name, Key=filename_on_s3)
    except Exception as e:
        prrint('Could not delete file from s3', e)
        return e
    return response
# delete_file_from_s3('http://fantsy-app.s3.amazonaws.com/phone2.png')
'''
Response Syntax
{
    'DeleteMarker': True|False,
    'VersionId': 'string',
    'RequestCharged': 'requester'
}
{'ResponseMetadata': {'RequestId': '48377B034622110D', 'HostId': 'X+8UmA3NnaIQMJYNIbX81lJfLDfKyEH7T47gdtqPbFvWyRly3R2IO9PLrqzW34LI8DP+X62VUgA=', 'HTTPStatusCode': 204, 'HTTPHeaders': {'x-amz-id-2': 'X+8UmA3NnaIQMJYNIbX81lJfLDfKyEH7T47gdtqPbFvWyRly3R2IO9PLrqzW34LI8DP+X62VUgA=', 'x-amz-request-id': '48377B034622110D', 'date': 'Tue, 02 Feb 2021 19:24:40 GMT', 'x-amz-version-id': 'UOInvqB2z7RHR8BU2snJH7ZgBGYGwkUk', 'x-amz-delete-marker': 'true', 'server': 'AmazonS3'}, 'RetryAttempts': 0}, 'DeleteMarker': True, 'VersionId': 'UOInvqB2z7RHR8BU2snJH7ZgBGYGwkUk'}
'''