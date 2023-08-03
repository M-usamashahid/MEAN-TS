import fs from 'fs';
import S3 from 'aws-sdk/clients/s3';
let s3: any;


/**
 * @function getConfiguration: Get AWS configuration from master API collection
 * for triggering AWS SDK functions.
 */
const getConfiguration = async () => {

    try {
        const ID = process.env.AWSAccessKey;
        const SECRET = process.env.AWSSecretAccessKey;
        /* Enter access ID and secret key here for S3 Bucket global file access*/
        s3 = new S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
            apiVersion: 'latest',
            region: 'us-east-1'
        });
    } catch (error) {
        console.error(error)
    }
}


/**
 * @function uploadFile: upload a file in your specific S3 bucket.
 * 
 * @param {String} link File read location url
 * @param {String} fileName File name you want to save as in S3
 * @param {String} BUCKET_NAME Bucket name in which you want to save in S3
 */
export const uploadFile = async (body: any, fileName: string, BUCKET_NAME: string = 'eztoned-studio-assets', ACL: boolean, ContentType?: any) => {

    // Read content from the file
    // if (typeof body == 'string') {
    //     body = fs.readFileSync(body);
    //     // link = "Hello World"
    // }


    // Setting up S3 upload parameters
    let params: any = {
        Bucket: BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: body,
        ACL: ACL ? 'public-read' : null
    }

    if (ContentType) {
        params.ContentType = ContentType
    }

    try {
        // Uploading files to the bucket
        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully. ${data.Location}`);
        return data.Location;
    } catch (error: any) {
        console.log(error, error.stack);

    }

};

/**
 * @function getObject: Retrieves objects from Amazon S3.
 * 
 * @param {String} bucket File read location url
 * @param {String} objectKey URL of your bucket file.
 */
export const getObject = async (bucket: string, objectKey: string) => {
    try {
        const params = {
            Bucket: bucket,
            Key: objectKey
        }

        const data = await s3.getObject(params).promise();
        return data.Body;
    } catch (e: any) {
        throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
}

/**
 * Load Configuration on Server Start 
 * Mentioned it in app.js to load these configurations at server start
 */
getConfiguration();