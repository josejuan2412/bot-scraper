const { trackOffers } = require("./lambda");

describe.only("Track Offers", () => {
  test("track offers by asin + price", async () => {
    const response = await trackOffers(
      "B08X1C8TK9",
      100,
      "EVGA SuperNOVA 850 GT, 80 Plus Gold 850W, Fully Modular, Auto Eco Mode with FDB Fan, 7 Year Warranty, Includes Power ON Self Tester, Compact 150mm Size, Power Supply 220-GT-0850-Y1",
    );
    expect(response).toBe(null);
  });
});
