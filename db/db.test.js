const { DynamoDb } = require("./db");

describe.only("DynamoDb", () => {
  test("Get the products", async () => {
    jest.setTimeout(60000);
    const dynamoDb = new DynamoDb();
    const products = await dynamoDb.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });
  test("Get the product offer", async () => {
    jest.setTimeout(60000);
    const dynamoDb = new DynamoDb();
    const offers = await dynamoDb.getOffers("B08WC6VDM5");
    expect(offers.length).toBeGreaterThan(0);
  });
});
