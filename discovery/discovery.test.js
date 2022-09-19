const { Discovery } = require("./discovery");

describe("Discover Untracked Products", () => {
  test.skip("get all asin from URL", async () => {
    const url =
      "https://www.amazon.com/s?i=computers&bbn=10158976011&rh=n%3A10158976011%2Cn%3A172282%2Cn%3A541966%2Cn%3A193870011%2Cn%3A17923671011%2Cn%3A1161760%2Cp_89%3ACooler+Master%7CCorsair%7CEVGA%7CGIGABYTE%7CGigabyte%7CMSI%7CSeasonic&s=price-asc-rank&pldnSite=1";
    const discovery = new Discovery();
    const response = await discovery.fetchProducts(url);
    expect(response).toBeGreaterThan(0);
  });
});
