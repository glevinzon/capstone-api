'use strict';

const Operation = use('App/Operations/Operation');
const { HttpException } = use('node-exceptions');
const Env = use('Env');
const HTTPResponse = use('App/HTTPResponse');

var s3 = require('s3');

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: "AKIAIEGJFGCZK4GIMNHA",
    secretAccessKey: "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",
    region: "us-east-1",
    // endpoint: 'http://apicapstone.herokuapp.com/',
    // sslEnabled: false
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

/**
 * Operations related to Audios
 *
 * @author glen
 */
class S3Operation extends Operation {
  constructor (args) {
    super(args);
  }

  static * uploadAudioToS3Bucket(url, filename) {
    var params = {
      localFile: url,

      s3Params: {
        Bucket: "usepcapstone",
        Key: "uploads/" + `${filename}`,
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      },
    };
    var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      console.log("done uploading");
    });
  }

  static * uploadAppAudioToS3Bucket(url, filename) {
    var params = {
      localFile: url,

      s3Params: {
        Bucket: "usepcapstone",
        Key: "app/uploads/" + `${filename}`,
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      },
    };
    var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      console.log("done uploading");
    });
  }
}

module.exports = S3Operation;
