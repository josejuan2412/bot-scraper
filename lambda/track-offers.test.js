const { Browser } = require("../scraper/browser");
const { trackOffers } = require("./track-offers");

describe.skip("Track Offers", () => {
  test("track offers by asin + price", async () => {
    const browser = await Browser.build();
    const response = await trackOffers({
      browser,
      asin: "B08X1C8TK9",
      price: 100.0,
      description:
        "EVGA SuperNOVA 850 GT, 80 Plus Gold 850W, Fully Modular, Auto Eco Mode with FDB Fan, 7 Year Warranty, Includes Power ON Self Tester, Compact 150mm Size, Power Supply 220-GT-0850-Y1",
    });
    expect(response).toBe(null);
  }, 100000);
});
