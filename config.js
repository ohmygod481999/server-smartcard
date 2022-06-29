require('dotenv').config()

exports.S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
exports.S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
exports.S3_ENDPOINT = process.env.S3_ENDPOINT
exports.S3_BUCKET = process.env.S3_BUCKET
exports.S3_REGION = process.env.S3_REGION