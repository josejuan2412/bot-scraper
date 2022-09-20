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
