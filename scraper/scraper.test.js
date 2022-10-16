const { Scraper } = require("./scraper");
const { BrowserClient } = require("./browser-client");

describe.skip("Scraper", () => {
  test("get product offers", async () => {
    const browser = new BrowserClient();
    const scraper = new Scraper();
    const product = { asin: "B08ZJQVV6G", price: 2000 };
    const page = await browser.setupBrowser(product.asin);
    const response = await scraper.getOffers(page, product.asin, product.price);
    expect(response).not.toBe(null);
  }, 30000);
});
