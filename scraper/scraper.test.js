const { Scraper } = require("./scraper");
const { Browser } = require("./browser");

describe.only("Scraper", () => {
  test("get product offers", async () => {
    const browser = new Browser();
    const scraper = new Scraper();
    const product = { asin: "B08ZJQVV6G", price: 2000 };
    const page = await browser.setupBrowser(product.asin);
    const response = await scraper.getOffers(page, product.asin, product.price);
    expect(response).not.toBe(null);
  }, 30000);
});
