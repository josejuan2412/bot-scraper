const { Products } = require("../products/products");

const AWS = require("aws-sdk");
require("dotenv/config");

export async function Schedule() {
  const MAX_COUNT = 2;
  const productList = new Products();
  const products = await productList.getProducts();
  let promises = [];
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });
  let [...arr] = products;
  var splits = [];
  while (arr.length) {
    splits.push(arr.splice(0, MAX_COUNT));
  }
  console.log(
    `I will schedule this amount of: ${
      products.length
    } products into: ${Math.ceil(products.length / MAX_COUNT)} lambdas`,
  );
  for (let i = 0; i < Math.ceil(products.length / MAX_COUNT); i++) {
    const interval = splits[i];

    var params = {
      FunctionName:
        "arn:aws:lambda:us-east-1:127729251872:function:track-offers",
      InvocationType: "Event",
      Payload: JSON.stringify({
        products: interval,
      }),
    };
    promises.push(trackOffers(params, i, interval));
  }
  await Promise.all(promises);
}

function trackOffers(params, index, interval) {
  return new Promise((resolve, reject) => {
    console.log(
      `Lambda #${index} tracking: "${interval.map((value) => {
        return value.asin + "";
      })}"`,
    );
    var lambda = new AWS.Lambda();
    lambda.invoke(params, function (err, data) {
      if (err) {
        console.log(
          `Error in Lambda #${index} tracking: "${interval.map((value) => {
            return value.asin + "";
          })}"`,
        );
        reject(err);
      }
      console.log(`For the Lambda #${index} the data is`, data);
      resolve(data);
    });
  });
}