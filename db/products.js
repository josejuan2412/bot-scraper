import AWS from "aws-sdk";
import "dotenv/config";
let awsConfig = {
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.WWCf9S9EFlsQqWkKhoV4uSQLNbnhk8Qs56K9s6Ky,
};
AWS.config.update(awsConfig);
let dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export async function getProducts() {
  try {
    var params = {
      TableName: "products",
    };
    var result = await dynamodb.scan(params).promise();
    return result.Items || [];
  } catch (error) {
    console.error(error);
  }
}
