const { Products } = require("../products/products");
const AWS = require("aws-sdk");
require("dotenv/config");

async function Schedule() {
  const productList = new Products();
  const products = await productList.getProducts();
  let promises = [];
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });
  var lambda = new AWS.Lambda();
  for (const product of products) {
    var params = {
      FunctionName: "track-offers",
      InvocationType: "Event",
      Payload: JSON.stringify({
        asin: product.asin,
        price: product.price,
        description: product.description,
      }),
    };
    promises.push(
      lambda.invoke(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      }),
    );
  }
  await Promise.all(promises);
}

module.exports = {
  Schedule,
};
