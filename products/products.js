const { DynamoDb } = require("../db/db");

class Products {
  async getProducts() {
    const dynamoDb = new DynamoDb();
    const products = await dynamoDb.getProducts();

    return products;
  }
}

module.exports = {
  Products,
};

// for (const product of products) {
//   promises.push(
//     await lambda.TrackOffers(
//       product.asin,
//       product.price,
//       product.description,
//     ),
//   );
// }
// await Promise.all(promises);
