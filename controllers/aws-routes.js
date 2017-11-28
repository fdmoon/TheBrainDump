// *********************************************************************************
// aws-routes.js
// *********************************************************************************

// Dependencies
// =============================================================
const aws = require('aws-sdk');
require('dotenv').config();

aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

aws.config.region = "us-west-2";    // US West (Oregon)

const S3_BUCKET = process.env.S3_BUCKET;

// Routes
// =============================================================
module.exports = function(app) {

    app.get('/sign-s3', (req, res) => {
        const s3 = new aws.S3();
        const fileName = req.query['file-name'];
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read'
        };

        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
            };
            res.json(returnData);
        });
    });

    app.delete('/sign-s3/:filename', (req, res) => {
        const s3 = new aws.S3();
        const fileName = req.params.filename;
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName
        };        

        s3.deleteObject(s3Params, function (err, data) {
            if (data) {
                console.log("@ File deleted successfully: " + fileName);
                res.json(true);
            }
            else {
                console.log("@ Check if you have sufficient permissions: " + err);
                res.json(false);
            }
        });
    });

};

