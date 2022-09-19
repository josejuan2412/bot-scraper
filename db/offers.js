// SELECT id FROM offers WHERE asinID=${asinID} AND price = '${price}' AND DATE(createdAt) = CURDATE() LIMIT 1
//INSERT INTO offers(asinID, offerID, price, checkoutURL) VALUES (${asinID},'${offer.offerID}', '${offer.price}', '${offer.checkoutUrl}' )`;
import AWS from "aws-sdk";
import "dotenv/config";
let awsConfig = {
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.WWCf9S9EFlsQqWkKhoV4uSQLNbnhk8Qs56K9s6Ky,
};
AWS.config.update(awsConfig);
var dynamoClient = new AWS.DynamoDB.DocumentClient();

export async function offerExists() {
  try {
    let productID = "15842b38-6729-4ecd-a0e3-0618d3db2042";
    // var params = {
    //   Key: {
    //     productID: "15842b38-6729-4ecd-a0e3-0618d3db2042",
    //     // price: 90.41,
    //     // createdAt: "2022-12-21",
    //   },
    //   TableName: "offers",
    // };
    var params = {
      TableName: "offers",
      KeyConditionExpression: "#productID = :productID",
      ExpressionAttributeNames: {
        "#productID": "productID",
      },
      ExpressionAttributeValues: {
        ":productID": productID,
      },
    };

    var result = await dynamoClient.query(params).promise();
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
}
