const { Products } = require("./products");

describe.only("products", () => {
  test("get all tracked products", async () => {
    const products = new Products();
    const response = await products.getProducts();
    expect(response.length).toBeGreaterThan(0);
  });
});
