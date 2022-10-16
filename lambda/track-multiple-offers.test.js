const { BrowserClient } = require("../scraper/browser-client");
const { trackMultipleOffers } = require("./track-multiple-offers");

const products = [
  {
    asin: "B08ZJQVV6G",
    price: 2000,
    description:
      "ASUS ZenBook Pro Duo 15 OLED UX582 Laptop, 15.6 OLED 4K UHD Touch Display, Intel Core i7-10870H, 16GB RAM, 1TB SSD, GeForce RTX 3070, ScreenPad Plus, Windows 10 Pro, Celestial Blue, UX582LR-XS74T",
  },
  {
    asin: "B073SB2MXT",
    price: 130,
    description:
      "Western Digital 1TB WD Blue 3D NAND Internal PC SSD - SATA III 6 Gb/s, M.2 2280, Up to 560 MB/s - WDS100T2B0B",
  },
];
describe.skip("Track Multiple Offers", () => {
  beforeEach(() => {
    jest.setTimeout(60000);
  });
  test("Should track multiple offers", async () => {
    const browser = await Browser.build();
    const response = await trackMultipleOffers({
      browser,
      products,
    });
    expect(response).toBe(null);
  }, 100000);
});
