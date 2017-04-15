var configs = {
  bucket: process.env.S3_BUCKET,
  access_key: process.env.ACCESS_KEY,
  secret_key: process.env.SECRET_KEY,
  region: process.env.S3_REGION,
  acl: 'public-read',
  'x-amz-algorithm': 'AWS4-HMAC-SHA256',
  success_action_status: '201'
}

exports = module.exports = configs
