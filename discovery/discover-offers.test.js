const { Browser } = require("../scraper/browser");
const { Discover } = require("./discover-offers");

const products = {
  asin: "B08ZJQVV6G",
  description:
    "ASUS ZenBook Pro Duo 15 OLED UX582 Laptop, 15.6 OLED 4K UHD Touch Display, Intel Core i7-10870H, 16GB RAM, 1TB SSD, GeForce RTX 3070, ScreenPad Plus, Windows 10 Pro, Celestial Blue, UX582LR-XS74T",
};
describe.skip("Get Product Offers", () => {
  beforeEach(() => {
    jest.setTimeout(60000);
  });
  test("get product offers without a price limit", async () => {
    const browser = await Browser.build();
    const response = await Discover(browser, product.asin, product.description);
    expect(response).toBe(null);
  });
});
