const { DynamoDb } = require("./db");

describe("DynamoDb", () => {
  test("Get the products", async () => {
    const dynamoDb = new DynamoDb();
    const products = dynamoDb.getProducts();
    expect(products.length).toBe(1);
  });
});
