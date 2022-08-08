const express = require("express");
const { graphQLClient } = require("../graphql-client")
const Joi = require("joi");
const Boom = require("@hapi/boom");
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
var multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { GET_CV_BY_ACCOUNT_ID, GET_ACCOUNT_BY_ID_QUERY, CREATE_CV_MUTATION, DELETE_CV_MUTATION } = require("../queries")

const {
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_ENDPOINT,
    S3_BUCKET,
    S3_REGION,
} = require("../config");

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
            const fullPath = "smartcard/user-cv/" + newFileName;

            cb(null, fullPath);
        },
    }),
    limits: {
        fileSize: maxSize,
    },
});

const uploadMiddleware = async (req, res, next) => {
    /** CHECKING VALID ACCOUNT **/
    let { account_id } = req.headers
    let accoundInfo = await graphQLClient.request(GET_ACCOUNT_BY_ID_QUERY, { account_id })
    accoundInfo && console.log(accoundInfo.account_by_pk)
    req.account_id = account_id = parseInt(account_id)
    if (accoundInfo.account_by_pk) {
        return next()
    } else return res.status(400).send("account_id is required")
}

router.get("/get", async (req, res) => {
    console.log(`Hello ${req.query.account}`)
    let cv = await graphQLClient.request(GET_CV_BY_ACCOUNT_ID, { account_id:req.query.account })
    if (cv.user_cv_by_pk) {
        return res.status(200).send(cv.user_cv_by_pk)
    } else return res.status(400).send("cv not found")
})

router.post("/upload", uploadMiddleware, upload.single("file"), async function (req, res, next) {
    try {
        if(!req.file) throw new Error("File is required")
        const { account_id } = req
        let cv = await graphQLClient.request(GET_CV_BY_ACCOUNT_ID, { account_id })
        if (cv) {
            await graphQLClient.request(DELETE_CV_MUTATION, { account_id })
            console.log(`Delete old Cv and create new Cv`)
            /** CV should be deleted on S3 Server **/
            let createCV = await graphQLClient.request(
                CREATE_CV_MUTATION, {account_id,path: `${req.file.location}`}
            )
        } else {
            let createCV = await graphQLClient.request(
                CREATE_CV_MUTATION, {account_id, path: `${req.file.location}`}
            );
        }

        return res.json({
            success: true,
            message: `CV has been uploaded to ${req.file.location}`,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(`Error`)
    }
});
module.exports = router;