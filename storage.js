const express = require("express");
const Joi = require("joi");
const Boom = require("@hapi/boom");
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
var multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const {
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_ENDPOINT,
    S3_BUCKET,
    S3_REGION,
} = require("./config");

const maxSize = 1000 * 1000;

const router = express.Router();

const s3Client = new S3Client({
    endpoint: S3_ENDPOINT, // Find your endpoint in the control panel, under Settings. Prepend "https://".
    region: S3_REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    // endpoint: "https://long-space.sgp1.digitaloceanspaces.com",

    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID, // Access key pair. You can create access key pairs using the control panel or API.
        secretAccessKey: S3_SECRET_ACCESS_KEY, // Secret access key defined through an environment variable.
    },
});
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: S3_BUCKET,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const newFileName = Date.now() + "-" + file.originalname;
            const fullPath = "smartcard/avatar/" + newFileName;

            cb(null, fullPath);
        },
    }),
    limits: {
        fileSize: maxSize,
    },
});

router.post("/upload", upload.single("file"), function (req, res, next) {
    console.log(req.file);
    res.json({
        success: true,
        data: req.file,
    });
});

module.exports = router;
