const { DynamoDb } = require("./db");

describe.skip("DynamoDb", () => {
  test("Get the products", async () => {
    const dynamoDb = new DynamoDb();
    const products = dynamoDb.getProducts();
    expect(products.length).toBe(0);
  });
});
