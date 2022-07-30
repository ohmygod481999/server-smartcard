require("dotenv").config();

exports.S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
exports.S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
exports.S3_ENDPOINT = process.env.S3_ENDPOINT;
exports.S3_BUCKET = process.env.S3_BUCKET;
exports.S3_REGION = process.env.S3_REGION;
exports.DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
exports.DB_USERNAME = process.env.DB_USERNAME;
exports.DB_HOSTNAME = process.env.DB_HOSTNAME;
exports.DB_DATABASE = process.env.DB_DATABASE;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_PORT = process.env.DB_PORT;
exports.CA_CERT = process.env.CA_CERT;
exports.CLOUD_FUNCTION_URL = process.env.CLOUD_FUNCTION_URL;
exports.RABBITMQ_URL = process.env.RABBITMQ_URL;

exports.POST_TRANSACTION_URL =
    process.env.NODE_ENV === "production"
        ? `${process.env.CLOUD_FUNCTION_URL}/smartcard/transaction`
        : "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-a916d45e-b515-4ffa-8656-7131ef8f4d20/smartcard/transaction";
