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
  console.log(`I will schedule this amount of products: ${products.length}`);
  for(let i = 0; i < products.length; i++) {
    const product = products[i];
    var params = {
      FunctionName: "track-offers",
      InvocationType: "Event",
      Payload: JSON.stringify({
        asin: product.asin,
        price: product.price,
        description: product.description,
      }),
    };
    promises.push(trackOffer(params, i, product.asin));
  }
  await Promise.all(promises);
}

function trackOffer(params, index, asin) {
  return new Promise((resolve, reject) => {
    console.log(`Product ${index}: "${asin}"`)
    lambda.invoke(params, function (err, data) {
      if (err) {
        console.log(`The product #${index} "${asin}"`);
        reject(err);
      };
      console.log(`For the product #${index} "${asin}" the data is`, data);
      resolve(data)
    })
  })

}

module.exports = {
  Schedule,
};
